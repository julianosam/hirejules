import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'julesgpt-ui';

  ngOnInit() {
    function setFullHeight() {
      const vh = window.innerHeight * 0.01; // Calculate 1% of visible height
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // Set on page load
    setFullHeight();
    
    // Update on window resize or orientation change
    window.addEventListener('resize', setFullHeight);
    window.addEventListener('orientationchange', setFullHeight);
    
  }
}
