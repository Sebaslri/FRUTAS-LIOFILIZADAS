import { NgStyle } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../shared/components/card/card.component';
import { CustomTitleService } from '../../shared/services/custom-title.service';
import {
  fadeInRight400ms,
  scaleIn400ms,
  stagger40ms,
} from '../../shared/animations/page.animations';
import { FruitDetailModalComponent } from './components/fruit-detail-modal/fruit-detail-modal.component';
import { HomeTopbarComponent } from './components/home-topbar/home-topbar.component';
import { Fruta } from '../fruit/models/Fruta.interface';
import { FruitService } from '../fruit/service/fruit.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgStyle, RouterLink, CardComponent, HomeTopbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [
    stagger40ms,
    scaleIn400ms,
    fadeInRight400ms,
    trigger('carouselTransition', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateX({{offset}})' }),
        animate('420ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  protected scrollY = 0;
  protected carouselIndex = 0;
  protected carouselAnimation = 0;
  protected carouselDirection: 'next' | 'previous' = 'next';
  protected frutas: Fruta[] = [];

  protected readonly harvestNotes = [
    'Consulta fichas cientificas con composicion proximal, acidez, Brix, color y compuestos bioactivos.',
    'Compara frutas e infusiones por antioxidantes, bioaccesibilidad, sabor, acidez y aceptacion sensorial.',
    'Interpreta los resultados como divulgacion educativa: potencial bioactivo disponible tras digestion in vitro.',
  ];

  constructor(
    private _fruitService: FruitService,
    private _customTitle: CustomTitleService,
    private _dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this._customTitle.set('Home');
    this._fruitService.getAll().subscribe((resp) => {
      this.frutas = resp;      
    });
  }

  protected get heroProgress(): number {
    return Math.min(this.scrollY / 430, 1);
  }

  protected get heroStyle() {
    const progress = this.heroProgress;

    return {
      opacity: `${Math.max(1 - progress * 1.25, 0)}`,
      transform: `translateY(${progress * -72}px) scale(${1 - progress * 0.06})`,
      filter: `blur(${progress * 9}px) saturate(${1 - progress * 0.25})`,
      pointerEvents: progress > 0.82 ? 'none' : 'auto',
    };
  }

  protected get visibleFruits(): Fruta[] {
    return this.frutas.slice(this.carouselIndex, this.carouselIndex + 4);
  }

  protected get canMoveBackward(): boolean {
    return this.carouselIndex > 0;
  }

  protected get canMoveForward(): boolean {
    return this.carouselIndex + 4 < this.frutas.length;
  }

  protected get carouselAnimationState() {
    return {
      value: this.carouselAnimation,
      params: {
        offset: this.carouselDirection === 'next' ? '42px' : '-42px',
      },
    };
  }

  protected nextFruits(): void {
    if (this.canMoveForward) {
      this.carouselDirection = 'next';
      this.carouselIndex += 4;
      this.carouselAnimation += 1;
    }
  }

  protected previousFruits(): void {
    if (this.canMoveBackward) {
      this.carouselDirection = 'previous';
      this.carouselIndex = Math.max(this.carouselIndex - 4, 0);
      this.carouselAnimation += 1;
    }
  }

  protected openFruitDetails(fruit: Fruta): void {    
    
    this._dialog.open(FruitDetailModalComponent, {
      data: { fruit },
      disableClose:true,
      autoFocus: false,
      restoreFocus: true,
      panelClass: 'fruit-detail-dialog',
      backdropClass: 'fruit-detail-backdrop',
      width: 'min(940px, calc(100vw - 2rem))',
      maxWidth: '940px',
      maxHeight: '92vh',
    });
  }

  @HostListener('window:scroll')
  protected onScroll(): void {
    this.scrollY = window.scrollY;
  }
}
