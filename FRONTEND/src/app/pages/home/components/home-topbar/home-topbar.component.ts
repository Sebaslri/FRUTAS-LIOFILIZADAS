import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../../../shared/material.module';
import { scaleIn400ms } from '../../../../shared/animations/page.animations';

@Component({
  selector: 'app-home-topbar',
  standalone: true,
  imports: [RouterLink, MaterialModule],
  templateUrl: './home-topbar.component.html',
  styleUrl: './home-topbar.component.css',
  animations: [scaleIn400ms],
})
export class HomeTopbarComponent {
  protected menuOpen = false;
  protected scrolled = false;

  @HostListener('window:scroll')
  protected onWindowScroll(): void {
    // Cambiado a > 0 para que reaccione inmediatamente al iniciar el scroll
    this.scrolled = window.scrollY > 0;
  }

  protected toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  protected closeMenu(): void {
    this.menuOpen = false;
  }
}
