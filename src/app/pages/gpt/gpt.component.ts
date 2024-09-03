import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { GptService, Message } from '../../shared/gpt.service';

@Component({
  selector: 'hj-gpt',
  templateUrl: './gpt.component.html',
  standalone: true,
  imports: [CommonModule],
  providers: [{ provide: GptService, useClass: GptService }],
  styleUrls: ['./gpt.component.scss']
})
export class GptComponent {

  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  messages: Message[] = [
    { text: 'I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! ', sent: true },
    { text: 'I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! I’m good, thanks! ', sent: false }
  ];

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  addMessage(newMessage: string, sent: boolean) {
    this.messages.unshift({ text: newMessage, sent });
  }

  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scroll({
        top: this.messageContainer.nativeElement.scrollHeight,
        behavior: 'smooth'
      });
    } catch (err) {
      console.error('Scrolling error:', err);
    }
  }

  send() {
    this.addMessage('porra', true);
  }

}
