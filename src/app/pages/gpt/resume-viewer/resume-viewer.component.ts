import { Component, ElementRef, EventEmitter, Output, Renderer2 } from '@angular/core';

import { PdfViewerModule } from 'ng2-pdf-viewer';


@Component({
  selector: 'hj-resume-viewer',
  standalone: true,
  imports: [PdfViewerModule],
  templateUrl: './resume-viewer.component.html',
  styleUrl: './resume-viewer.component.scss'
})
export class ResumeViewerComponent {

  isOpen = false;
  pdfSrc = '';

  @Output()
  onAskGPT: EventEmitter<string> = new EventEmitter();

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit() {
    // Listen for link clicks
    this.renderer.listen(this.el.nativeElement, 'click', (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'A') {
        event.preventDefault();
        const href = target.getAttribute('href') || '';
        console.log(`Link clicked: ${href}`);
        // Add your custom behavior here
        const params = new URLSearchParams(href.split('?')[1]); // Extract query part and parse it
        const question = params.get("str");
        if (question) {
          this.onAskGPT.emit(question);
          this.close();
        }
      }
    });

    // Listen for text selection
    this.renderer.listen(this.el.nativeElement, 'mouseup', () => {
      const selectedText = window.getSelection()?.toString().trim();
      if (selectedText) {
        console.log(`Text selected: "${selectedText}"`);
        // Add your custom behavior here
      }
    });
  }

  open(pdfUrl: string) {
    this.pdfSrc = pdfUrl;
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }



}
