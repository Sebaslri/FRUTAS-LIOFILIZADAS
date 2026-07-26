import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomeNavigationItem } from './configuration.interface';

@Component({
  selector: 'app-home-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home-sidebar.component.html',
  styleUrl: './home-sidebar.component.css',
})
export class HomeSidebarComponent {
  @Input() variant: 'desktop' | 'dropdown' = 'desktop';

  protected readonly authItems: HomeNavigationItem[] = [
    {
      label: 'Iniciar sesion',
      route: '/signin',
      icon: 'login',
      variant: 'secondary',
    },
    {
      label: 'Registrarse',
      route: '/signup',
      icon: 'user-plus',
      variant: 'primary',
    },
  ];

  protected isPrimary(item: HomeNavigationItem) {
    return item.variant === 'primary';
  }
}
