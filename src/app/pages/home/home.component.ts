import { Component, HostListener } from '@angular/core';
import { IntersectionObserverDirective } from '../../shared/intersection-observer.directive';


@Component({
  selector: 'hj-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [IntersectionObserverDirective]
})
export class HomeComponent {

  constructor() { }

  onVisibilityChange(isVisible: boolean, page: string) {
    if (isVisible) {
      console.log(`Page has entered the view: ${page}`);

    } else {
      console.log(`Page has left the view: ${page}`);
    }
  }
}
