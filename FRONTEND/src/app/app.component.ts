import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { routeFadeSlide } from './shared/animations/page.animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [routeFadeSlide],
})
export class AppComponent {
  protected prepareRoute(outlet: RouterOutlet): string {
    if (!outlet?.isActivated) {
      return '';
    }

    return outlet?.activatedRouteData?.['animation'] ?? outlet?.activatedRoute?.routeConfig?.path ?? '';
  }
}
