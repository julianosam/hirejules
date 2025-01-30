import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HireJulesApiService } from '../../shared/hire-jules-api.service';
import { RESUME_PROMPTS } from './prompts';
import { ResumeViewerComponent } from './resume-viewer/resume-viewer.component';

@Component({
  selector: 'hj-gpt',
  templateUrl: './gpt.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ResumeViewerComponent],
  providers: [HireJulesApiService],
  styleUrls: ['./gpt.component.scss']
})
export class GptComponent implements OnInit {


  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  @ViewChild('typingContainer', { static: true }) typingContainer!: ElementRef;

  messages: Message[] = [];
  prompts = RESUME_PROMPTS;
  jobName: string = '';
  enableTyping = true;
  typingTimeout: any = null;
  typingSpeed = 10;
  inputText = '';
  isWaitingOnGPT = false;

  constructor(
    private _hireJulesApi: HireJulesApiService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.jobName = this._route.snapshot.queryParamMap.get('jobName') || '';
    this.prompts.forEach(p => p.delay = Math.random() * 0.1);
    this.init();
  }

  ngAfterViewInit(): void {
    this.messageContainer.nativeElement.addEventListener('click', (event: Event) => {
      const clickedElement = event.target as HTMLElement;


      if (clickedElement.tagName === 'A' && !clickedElement.getAttribute('target')) {
        event.preventDefault();
        this.send(clickedElement.getAttribute('href') || clickedElement.textContent as string);
      }
    });
  }

  async init() {

    if (this.jobName) {

      // fetches the job details
      const jobInfoResponse = this._hireJulesApi.findJobByName(this.jobName);
      const gptResponse = this._hireJulesApi.askGPT('list all main job requirements and why Jules is a great fit. skip the initial sentence', this.jobName);
      const urlJobData = this.extractCompanyAndJob(this.jobName);
      const openingMsg = `<h1>Hello <span class="hj-capitalize">${urlJobData?.company}</span> team!</h1><p>I'm Jules' assistant powered by GenAI, and I'm here to make your hiring process simpler.</p>`;

      // First message
      await this.addAssistantMessage(openingMsg, false, 40, 600);


      // Second message
      const jobInfo = await jobInfoResponse;
      const jobInfoText = `<p>I see you're interested in Jules for the <b class="hj-capitalize">${jobInfo.title}</b> role at <b class="hj-capitalize">${jobInfo.company}</b>. 
        Here's why he is the best fit based on the <a class="underlined" href="${jobInfo.originalUrl}" target="__blank">job description <i class="bi bi-box-arrow-up-right"></i></a>:</p>`;
      await this.addAssistantMessage(jobInfoText, true, 40);

      // Gpt response message
      let text = await gptResponse;
      text = text.includes('<div class="prompts">') ? text.replace('</div>', '') : text + '<div class="prompts">';
      this.prompts.forEach(p => {
        text += `<a class="prompt" href="${p.prompt}">${p.label}</a>`
      });
      text += `</div><br>Or ask your own question using the input below.`;
      this.addAssistantMessage(text, true);


    } else {

      let openingMsg = `
      <h1>Hi there!</h1> 
      <p>I'm Jules' assistant powered by GenAI, and I'm here to make your hiring process simpler. Ask me anything about Jules' skills, experience, and how they align with your job requirements!</p>
      <p>Start by asking a question, or select from the options below.</p>
      `;

      let prompts = `<div class="prompts">`;
      this.prompts.forEach(p => {
        prompts += `<a class="prompt" href="${p.prompt}">${p.label}</a>`
      });
      prompts += `</div>`

      await this.addAssistantMessage(openingMsg, false, 40);
      this.addAssistantMessage(prompts, true);
    }

  }

  addUserMessage(text: string) {
    this.messages.unshift({ text, sent: true });
    setTimeout(() => this.scrollToBottom(), 100);
  }

  scrollToBottom(): void {
    try {
      this.messageContainer?.nativeElement.scroll({
        top: this.messageContainer.nativeElement.scrollHeight,
        // behavior: 'smooth'
      });
    } catch (err) {
      console.error('Scrolling error:', err);
    }
  }

  async addAssistantMessage(content: string, append = false, typingSpeed = this.typingSpeed, delayAfterFinished = 0): Promise<void> {

    return new Promise((resolve) => {

      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout); // Clear previous typing processes
      }

      this.enableTyping = false;
      let contentLength = content.length;
      let index = 0; // Current character index
      let tempHTML = ''; // Temporary holder for the content being typed

      if (!append) {
        this.messages.unshift({ text: '', sent: false });
      } else {
        tempHTML = this.messages[0].text;
      }

      const typeNext = () => {
        if (index < contentLength) {
          const char = content[index];

          if (char === '<') {
            // Handle opening or closing HTML tags
            const endTagIndex = content.indexOf('>', index);
            if (endTagIndex !== -1) {
              // Add the complete tag to the tempHTML
              tempHTML += content.substring(index, endTagIndex + 1);
              index = endTagIndex + 1; // Move index past the tag
            } else {
              // Fallback for malformed HTML (append character as-is)
              tempHTML += char;
              index++;
            }
          } else {
            // Handle plain text
            tempHTML += char;
            index++;
          }

          // Update the container's innerHTML after each step
          this.messages[0].text = tempHTML;
          this.typingTimeout = setTimeout(typeNext, typingSpeed);
        } else {
          this.enableTyping = true;
          setTimeout(resolve, delayAfterFinished);
          // setTimeout(() => this.inputTextField.nativeElement.focus(), 0);
        }

        this.scrollToBottom();
      };

      typeNext();
    });

  }

  isTypingEnabled() {
    return this.enableTyping && !this.isWaitingOnGPT;
  }


  send(text: string = '') {
    if (!this.isTypingEnabled() || (!this.inputText && !text)) return;
    this.addUserMessage(text || this.inputText);
    this.ask(text || this.inputText);
    this.inputText = '';
    setTimeout(() => this.scrollToBottom(), 300);
  }

  async ask(msg: string) {
    this.isWaitingOnGPT = true;
    const answer = await this._hireJulesApi.askGPT(msg, this.jobName);
    this.addAssistantMessage(answer);
    this.isWaitingOnGPT = false;
  }


  private extractCompanyAndJob(str: string): { company: string, jobName: string } | null {
    const [company, ...jobParts] = str.split('-');
    const jobName = jobParts.join(' ');
    return company && jobName ? { company: company.replaceAll('_', ' '), jobName } : null;
  }

}


interface Message {
  text: string;
  sent: boolean;
}
