import { NgStyle } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { MaterialModule } from '../../../../shared/material.module';
import { CustomTitleService } from '../../../../shared/services/custom-title.service';
import {
  fadeInRight400ms,
  scaleIn400ms,
  stagger40ms,
} from '../../../../shared/animations/page.animations';
import { FruitDetailModalComponent } from '../fruit-detail-modal/fruit-detail-modal.component';
import { LoginPromptModalComponent } from '../login-prompt-modal/login-prompt-modal.component';
import { HomeTopbarComponent } from '../home-topbar/home-topbar.component';
import { Fruta } from '../../../../shared/interfaces/Fruta.interface';
import { FruitService } from '../../../../shared/services/fruit.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgStyle, RouterLink, CardComponent, HomeTopbarComponent, MaterialModule],
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
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('statsSection', { static: false }) private statsSection!: ElementRef<HTMLElement>;

  protected scrollY = 0;
  protected carouselIndex = 0;
  protected carouselAnimation = 0;
  protected carouselDirection: 'next' | 'previous' = 'next';
  protected frutas: Fruta[] = [];

  // Counter animation state
  protected statsAnimated = false;
  protected displayedStats = { modules: 0, fruits: 0, indicators: 0 };
  private statsObserver?: IntersectionObserver;


  protected readonly appModules = [
    {
      icon: 'compare',
      name: 'Comparador de frutas',
      description: 'Contrasta propiedades fisicoquímicas, bioactivas y sensoriales lado a lado entre dos frutas.',
      color: '#3f6528',
    },
    {
      icon: 'device_thermostat',
      name: 'Calculadora de preparación',
      description: 'Simula cómo la temperatura de infusión afecta los antioxidantes y fenoles totales.',
      color: '#c66b2b',
    },
    {
      icon: 'psychology',
      name: 'Perfil sensorial',
      description: 'Visualiza dulzor, acidez, aroma frutal, color e intensidad de cada fruta en escala comparativa.',
      color: '#8b5cf6',
    },
    {
      icon: 'map',
      name: 'Mapa bioactivo',
      description: 'Explora los compuestos bioactivos de cada fruta según la provincia de origen en Ecuador.',
      color: '#0ea5a0',
    },
    {
      icon: 'favorite',
      name: 'Condiciones de salud',
      description: 'Descubre qué infusiones se asocian con tu perfil de interés de bienestar.',
      color: '#e74c6f',
    },
    {
      icon: 'science',
      name: 'Infusiones funcionales',
      description: 'Analiza la composición bioactiva desde la fruta fresca hasta la digestión simulada.',
      color: '#2563eb',
    },
    {
      icon: 'school',
      name: 'Educación al consumidor',
      description: 'Aprende sobre compuestos bioactivos, antioxidantes y liofilización con cápsulas interactivas.',
      color: '#f59e0b',
    },
    {
      icon: 'blender',
      name: 'Laboratorio de Mixes',
      description: 'Crea mezclas personalizadas y predice su potencial antioxidante con inteligencia artificial.',
      color: '#06b6d4',
    },
  ];

  protected readonly featuredModules = [
    {
      eyebrow: 'Exploración lado a lado',
      title: 'Compara frutas con rigor científico',
      description: 'Selecciona dos frutas y obtén una comparación visual e inmediata de sus propiedades fisicoquímicas, compuestos bioactivos y perfil sensorial. Ideal para tomar decisiones informadas sobre ingredientes.',
      icon: 'compare',
      color: '#3f6528',
      highlights: [
        'Composición proximal, pH, acidez y grados Brix',
        'Fenoles totales, flavonoides y capacidad antioxidante',
        'Tabla detallada exportable con todos los indicadores',
      ],
    },
    {
      eyebrow: 'Exploración geográfica',
      title: 'Un mapa vivo de compuestos bioactivos',
      description: 'Navega el mapa interactivo de Ecuador y descubre qué frutas liofilizadas destacan en cada provincia, tanto antes como después de la digestión simulada. Ciencia y territorio en un solo vistazo.',
      icon: 'map',
      color: '#0ea5a0',
      highlights: [
        'Filtro por estado: antes y después de digestión <i>in vitro</i>',
        'Marcadores por provincia con datos de bioaccesibilidad',
        'Visualización de fenoles, flavonoides y antocianinas',
      ],
    },
    {
      eyebrow: 'Inteligencia artificial aplicada',
      title: 'Diseña mixes y predice su potencial',
      description: 'Arrastra frutas liofilizadas a la licuadora virtual y nuestro modelo de IA estimará la actividad antioxidante de tu mezcla. Un laboratorio digital para experimentar sin límites.',
      icon: 'blender',
      color: '#06b6d4',
      highlights: [
        'Drag & drop intuitivo de ingredientes',
        'Predicción de DPPH y ABTS con machine learning',
        'Guarda y compara tus formulaciones favoritas',
      ],
    },
  ];

  constructor(
    private _fruitService: FruitService,
    private _customTitle: CustomTitleService,
    private _dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this._customTitle.set('Home');
    this._fruitService.getAll().subscribe((resp) => {
      this.frutas = resp;
    });
  }

  ngAfterViewInit(): void {
    this.setupStatsObserver();
  }

  ngOnDestroy(): void {
    this.statsObserver?.disconnect();
  }

  private setupStatsObserver(): void {
    if (!this.statsSection) return;
    this.statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this.statsAnimated) {
          this.statsAnimated = true;
          this.animateCounter('modules', 8, 1200);
          this.animateCounter('fruits', 12, 1400);
          this.animateCounter('indicators', 30, 1600);
        }
      },
      { threshold: 0.3 }
    );
    this.statsObserver.observe(this.statsSection.nativeElement);
  }

  private animateCounter(key: 'modules' | 'fruits' | 'indicators', target: number, duration: number): void {
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      this.displayedStats[key] = Math.round(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
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
      disableClose: true,
      autoFocus: false,
      restoreFocus: true,
      panelClass: 'fruit-detail-dialog',
      backdropClass: 'fruit-detail-backdrop',
      width: 'min(940px, calc(100vw - 2rem))',
      maxWidth: '940px',
      maxHeight: '92vh',
    });
  }

  protected openLoginPrompt(mod: { name: string; icon: string; color: string }): void {
    this._dialog.open(LoginPromptModalComponent, {
      data: {
        moduleName: mod.name,
        icon: mod.icon,
        color: mod.color,
      },
      panelClass: 'login-prompt-dialog-panel',
      autoFocus: false,
      restoreFocus: true,
      width: '480px',
      maxWidth: 'calc(100vw - 2rem)',
    });
  }

  @HostListener('window:scroll')
  protected onScroll(): void {
    this.scrollY = window.scrollY;
  }
}
