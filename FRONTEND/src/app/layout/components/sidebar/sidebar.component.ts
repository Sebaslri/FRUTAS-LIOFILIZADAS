import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationService } from '../../../shared/services/navigation.service';
import { AuthService } from '../../../pages/auth-pages/services/auth.service';
import { environment } from '../../../environments/environment';
import { MaterialModule } from '../../../shared/material.module';
import { stagger40ms } from '../../../shared/animations/page.animations';

import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MaterialModule, AsyncPipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  animations: [stagger40ms],
})
export class SidebarComponent {
  private readonly navigationService = inject(NavigationService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected mobileOpen = false;
  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();
  
  protected readonly backendUrl = environment.api;

  protected get navigationItems() {
    return this.navigationService.items;
  }

  protected readonly currentUser$ = this.authService.currentUser$;

  protected getInitials(user: any) {
    const first = user?.nombre?.charAt(0) ?? 'U';
    const last = user?.apellido?.charAt(0) ?? '';
    return `${first}${last}`.toUpperCase();
  }

  protected readonly isLink = this.navigationService.isLink.bind(this.navigationService);
  protected readonly isSubheading = this.navigationService.isSubheading.bind(this.navigationService);

  protected toggleMobile() {
    const nextState = !this.mobileOpen;
    this.mobileOpen = nextState;

    if (nextState && this.collapsed) {
      this.collapsedChange.emit(false);
    }
  }

  protected closeMobile() {
    this.mobileOpen = false;
  }

  protected toggleCollapsed() {
    this.collapsedChange.emit(!this.collapsed);
  }

  protected logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {
        this.authService.clearSession();
        this.router.navigate(['/']);
      },
    });
  }
}
