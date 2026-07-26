import { Component, OnDestroy, inject } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MaterialModule } from '../shared/material.module';
import { routeFadeSlide } from '../shared/animations/page.animations';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, MaterialModule],
  templateUrl: './app-layout.component.html',
  animations: [routeFadeSlide],
})
export class AppLayoutComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly subscription: Subscription;

  protected loading = false;
  protected sidebarCollapsed = false;
  protected routeAnimationState = '';

  constructor() {
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart || event instanceof RouteConfigLoadStart) {
        this.loading = true;
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError ||
        event instanceof RouteConfigLoadEnd
      ) {
        this.loading = false;
      }
    });
  }

  protected setSidebarCollapsed(collapsed: boolean): void {
    this.sidebarCollapsed = collapsed;
  }

  protected onActivate(outlet: RouterOutlet): void {
    if (outlet.isActivated) {
      setTimeout(() => {
        this.routeAnimationState = outlet.activatedRoute.snapshot.routeConfig?.path ?? '';
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
