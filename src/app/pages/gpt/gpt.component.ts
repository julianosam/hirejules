import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GptService } from '../../shared/gpt.service';
import { ResumeViewerComponent } from './resume-viewer/resume-viewer.component';
import { JobReqViewerComponent } from "./job-req-viewer/job-req-viewer.component";
import { HireJulesApiService } from '../../shared/hire-jules-api.service';

@Component({
  selector: 'hj-gpt',
  templateUrl: './gpt.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ResumeViewerComponent, JobReqViewerComponent],
  providers: [HireJulesApiService],
  styleUrls: ['./gpt.component.scss']
})
export class GptComponent implements OnInit {


  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  @ViewChild('typingContainer', { static: true }) typingContainer!: ElementRef;

  messages: Message[] = [];
  // prompts: string[] = ['Why is he the best fit?', 'Top 3 career achievements', 'Leadership style', 'Experience with technologies', 'Soft Skills', 'Hard Skills', 'Database experience', 'Top programming languages', 'Front-end experience', 'Back-end experience', 'Experience with Microservices', 'Experience with Cloud/AWS'];
  prompts = [
    { label: 'Why is he the best fit?', prompt: 'Why is he the best fit?', delay: 0 },
    { label: 'Top 3 career achievements', prompt: 'What are his top 3 career achievements?', delay: 0 },
    { label: 'Machine Learning, AI, GenAI and LLMs', prompt: 'What projects did he use AI and Machine Learning?', delay: 0 },
    { label: 'Innovation', prompt: 'What projects showcase Jules\' innovative mindset?', delay: 0 },
    { label: 'Leadership style', prompt: 'What is Jules leadership style?', delay: 0 },
    { label: 'Soft skills', prompt: 'What are his soft skills?', delay: 0 },
    { label: 'Programming Languages', prompt: 'Jules top programming languages?', delay: 0 },
    { label: 'Microservices', prompt: 'What is his experience with Microservices?', delay: 0 },
    { label: 'AWS Services', prompt: 'What is his experience with Cloud and AWS?', delay: 0 },
    { label: 'SQL Databases', prompt: 'What is his experience with SQL databases?', delay: 0 },
    { label: 'NoSQL Databases', prompt: 'What is his experience with NoSQL databases?', delay: 0 },
    { label: 'Front-end', prompt: 'What is his experience with front-end development?', delay: 0 },
    { label: 'Back-end', prompt: 'What is his experience with front-end development?', delay: 0 },
    { label: 'CI/CD tools', prompt: 'What CI/CD tools has he used?', delay: 0 }
  ];
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

  async init() {

    if (this.jobName) {

      const urlJobData = this.extractCompanyAndJob(this.jobName);
      const openingMsg = `<h1>Hello <span class="hj-capitalize">${urlJobData?.company}</span> team!</h1><p>I'm Jules' assistant powered by GenAI, and I'm here to make your hiring process simpler.</p>`;

      const openingMessageTyping = this.addAssistantMessage(openingMsg, false, 30);

      const jobInfoTyping = this.concatJobInfo(openingMessageTyping);


      // fetches the 
      this._hireJulesApi.askGPT('top 5 job requirements and why Jules meets them. return only the <ul>.', this.jobName).then((answer) => {
        let text = answer + `<br/><p>What else would you like to know about Jules? Start by asking a question, or select from the options below.</p>`;
        jobInfoTyping.then(() => this.addAssistantMessage(text, true));
      });


    } else {

      const openingMsg = `
      <h1>Hi there!</h1> 
      <p>I'm Jules' assistant powered by GenAI, and I'm here to make your hiring process simpler. Ask me anything about Jules' skills, experience, and how they align with your job requirements!</p>
      <p>Start by asking a question, or select from the options below.</p>
      `;

      this.addAssistantMessage(openingMsg, false, 20);
    }

  }


  async concatJobInfo(openingMessageTyping: Promise<void>) {
    const jobInfo = await this._hireJulesApi.findJobByName(this.jobName)
    const text = `<p>I see you're interested in Jules for the <b class="hj-capitalize">${jobInfo.title}</b> role at <b class="hj-capitalize">${jobInfo.company}</b>. Here are 5 reasons why he is the best fit based on the <a class="underlined" href="${jobInfo.originalUrl}" target="__blank">job description <i class="bi bi-box-arrow-up-right"></i></a>:</p>`;
    await openingMessageTyping;
    return this.addAssistantMessage(text, true, 30);
  }


  addUserMessage(text: string) {
    this.messages.unshift({ text, sent: true });
    setTimeout(() => this.scrollToBottom(), 100);
  }

  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scroll({
        top: this.messageContainer.nativeElement.scrollHeight,
        // behavior: 'smooth'
      });
    } catch (err) {
      console.error('Scrolling error:', err);
    }
  }

  async addAssistantMessage(content: string, append = false, typingSpeed = this.typingSpeed): Promise<void> {

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
          resolve();
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
    return company && jobName ? { company, jobName } : null;
  }

}


interface Message {
  text: string;
  sent: boolean;
}
