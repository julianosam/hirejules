import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GptService } from '../../shared/gpt.service';
import { SidePanelComponent } from '../../shared/side-panel/side-panel.component';

@Component({
  selector: 'hj-gpt',
  templateUrl: './gpt.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, SidePanelComponent],
  providers: [{ provide: GptService, useClass: GptService }],
  styleUrls: ['./gpt.component.scss']
})
export class GptComponent implements OnInit {


  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  @ViewChild('inputTextField') private inputTextField!: ElementRef;
  @ViewChild('typingContainer', { static: true }) typingContainer!: ElementRef;

  messages: Message[] = [];
  prompts: string[] = ['Why is he the best fit?', 'Top 3 career achievements', 'Jules\' leadership style', 'Database experience', 'Top programming languages', 'Front-end experience', 'Back-end experience', 'Experience with Microservices', 'Experience with Cloud/AWS', 'Education and qualifications', 'Management Experience'];
  jobName: string = '';
  enableTyping = true;
  typingTimeout: any = null;
  typingSpeed = 10;
  inputText = '';
  isWaitingOnGPT = false;

  constructor(
    private _gtp: GptService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.jobName = this._route.snapshot.queryParamMap.get('jobName') || '';
    // this.init();
  }

  async init() {

    const jobInfo = this.extractCompanyAndJob(this.jobName);
    let openingMsg = `<p>Hello! I'm Jules' personal assistant. I can answer questions about Jules and his outstanding professional career. </p>
      <p>Here are 5 reasons why he is the best fit for your company:</p>`;
    let openingPrompt = `5 reasons why Jules is the best fit`;

    if (jobInfo) {
      openingMsg = `<p>Hello <b class="hj-capitalize">${jobInfo.company}</b> team! I'm Jules' personal assistant. I can answer questions about Jules and his outstanding professional career.</p>
      <p>Here are 5 reasons why he is the best fit for the <b class="hj-capitalize">${jobInfo.jobName}</b> role at <b class="hj-capitalize">${jobInfo.company}</b> based on the job description:</p>`;
      openingPrompt = 'match 5 requirements from the job description with Jules skills. no preface.';
    }


    this.__addAssistantMessage(openingMsg, false, 30);
    this._gtp.ask(openingPrompt, this.jobName).then((answer) => {

      const f = () => {
        if (this.enableTyping) {
          this.__addAssistantMessage(answer, true);
        } else {
          setTimeout(f, 250);
        }
      };

      f();
    });


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

  __addAssistantMessage(content: string, append = false, typingSpeed = this.typingSpeed): void {

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
        // setTimeout(() => this.inputTextField.nativeElement.focus(), 0);
      }

      this.scrollToBottom();
    };

    typeNext();

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
    const answer = await this._gtp.ask(msg, this.jobName);
    this.__addAssistantMessage(answer);
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
