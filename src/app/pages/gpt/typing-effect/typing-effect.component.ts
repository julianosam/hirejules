import { ChangeDetectionStrategy, Component, ElementRef, Input, Renderer2, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'hj-typing-effect',
  standalone: true,
  imports: [],
  templateUrl: './typing-effect.component.html',
  styleUrl: './typing-effect.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypingEffectComponent {

  @Input() htmlContent: string = ''; // The HTML content to render
  @Input() typingSpeed: number = 10; // Speed in ms per character
  @ViewChild('typingContainer', { static: true }) typingContainer!: ElementRef;

  private typingTimeout: any; // To clear typing timeouts when content changes

  constructor(private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    // Start typing effect for the initial value of htmlContent
    if (this.htmlContent) {
      this.startTyping(this.htmlContent, this.typingContainer.nativeElement);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['htmlContent'] && !changes['htmlContent'].firstChange) {
      // Restart typing if `htmlContent` changes
      this.startTyping(this.htmlContent, this.typingContainer.nativeElement);
    }
  }

  private startTyping(content: string, container: HTMLElement) {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout); // Clear previous typing processes
    }
  
    container.innerHTML = ''; // Clear container before typing
    let index = 0; // Current character index
    let tempHTML = ''; // Temporary holder for the content being typed
  
    const typeNext = () => {
      if (index < content.length) {
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
        container.innerHTML = tempHTML;
        this.typingTimeout = setTimeout(typeNext, this.typingSpeed);
      }
    };
  
    typeNext();
  }

}
