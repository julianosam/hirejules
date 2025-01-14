import { Component, EventEmitter, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'hj-job-req-viewer',
  standalone: true,
  imports: [],
  templateUrl: './job-req-viewer.component.html',
  styleUrl: './job-req-viewer.component.scss'
})
export class JobReqViewerComponent {

  isOpen = false;
  jobReqUrl!: SafeResourceUrl;

  constructor(
    private sanitizer: DomSanitizer
  ) { 
  }

  @Output()
  onAskGPT: EventEmitter<string> = new EventEmitter();

  open(jobReqUrl: string) {
    this.jobReqUrl = this.sanitizer.bypassSecurityTrustResourceUrl(jobReqUrl);
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }
}
