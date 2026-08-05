import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../../../shared/material.module';
import { FRUIT_COLORS } from '../../../../shared/functions/variables.interface';
import { Fruta } from '../../../fruit/models/Fruta.interface';
import { SensoryProfileService } from '../../services/sensory-profile.service';
import { SensoryProfileInfoModalComponent } from './sensory-profile-info-modal.component';
import { fadeInRight400ms, scaleIn400ms, stagger40ms } from '../../../../shared/animations/page.animations';
import { CustomTitleService } from '../../../../shared/services/custom-title.service';
import {
  SensoryMetric,
  SensoryMetricConfig,
  SensoryMetricKey,
  SensoryProfileSelection,
} from './configuration.interface';

@Component({
  selector: 'app-sensory-profile',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './sensory-profile.component.html',
  styleUrl: './sensory-profile.component.css',
  animations: [fadeInRight400ms, scaleIn400ms, stagger40ms],
})
export class SensoryProfileComponent implements OnInit {
  protected readonly metricConfig: SensoryMetricConfig[] = [
    {
      key: 'sweetness',
      label: 'Dulzor',
      shortLabel: 'Dulzor',
      explanation: 'Nivel de dulzor percibido en evaluaciones sensoriales.',
      color: '#e5a52d',
    },
    {
      key: 'acidity',
      label: 'Acidez',
      shortLabel: 'Acidez',
      explanation: 'Intensidad de acidez y notas cítricas o refrescantes.',
      color: '#d87955',
    },
    {
      key: 'fruitiness',
      label: 'Aroma frutal',
      shortLabel: 'Aroma frutal',
      explanation: 'Intensidad de las notas aromáticas características.',
      color: '#77a642',
    },
    {
      key: 'color',
      label: 'Color',
      shortLabel: 'Color',
      explanation: 'Atractivo visual e intensidad cromática.',
      color: '#8b6bb1',
    },
    {
      key: 'intensity',
      label: 'Intensidad',
      shortLabel: 'Intensidad',
      explanation: 'Fuerza global del sabor de la fruta.',
      color: '#477b9b',
    },
    {
      key: 'acceptance',
      label: 'Aceptación global',
      shortLabel: 'Aceptación',
      explanation: 'Equilibrio y aceptación general del consumidor.',
      color: '#c46c83',
    },
  ];

  protected fruits: Fruta[] = [];
  protected selectedFruit: Fruta | null = null;
  protected loading = true;

  private readonly sensoryProfileService = inject(SensoryProfileService);
  private readonly dialog = inject(MatDialog);
  private readonly customTitle = inject(CustomTitleService);

  ngOnInit(): void {
    this.customTitle.set('Perfil Sensorial');
    this.sensoryProfileService.getFruits().subscribe({
      next: (fruits) => {
        this.fruits = fruits;
        this.selectedFruit = fruits[0] ?? null;
      },
      error: () => {
        this.fruits = [];
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  protected get selection(): SensoryProfileSelection | null {
    if (!this.selectedFruit) {
      return null;
    }

    const metrics = this.metricConfig.map((config) => ({
      ...config,
      color: config.key === 'color' ? this.fruitColor(this.selectedFruit!) : config.color,
      value: this.metricValue(this.selectedFruit!, config.key),
    }));
    const available = metrics.map((metric) => metric.value).filter((value): value is number => value !== null);

    return {
      fruit: this.selectedFruit,
      metrics,
      average: available.length
        ? available.reduce((sum, value) => sum + value, 0) / available.length
        : null,
    };
  }

  protected selectFruit(fruit: Fruta): void {
    this.selectedFruit = fruit;
  }

  protected formatScore(value: number | null): string {
    return value === null ? 'Sin dato' : `${Math.round(value)}/10`;
  }

  protected roundedScore(value: number | null): number | null {
    return value === null ? null : Math.round(value);
  }

  protected scoreWidth(value: number | null): number {
    return value === null ? 0 : (value / 10) * 100;
  }

  private fruitColor(fruit: Fruta): string {
    return FRUIT_COLORS[fruit.nombreComun] ?? '#8b6bb1';
  }

  protected circleGradient(metrics: SensoryMetric[]): string {
    const available = metrics.map((metric) => metric.value ?? 0);
    const total = available.reduce((sum, value) => sum + value, 0);

    if (!total) {
      return 'conic-gradient(#dfe6d5 0 100%)';
    }

    let cursor = 0;
    const segments = metrics.map((metric, index) => {
      const start = cursor;
      cursor += ((available[index] ?? 0) / total) * 100;
      return `${metric.color} ${start}% ${cursor}%`;
    });

    return `conic-gradient(${segments.join(', ')})`;
  }

  protected highestMetric(metrics: SensoryMetric[]): string {
    const available = metrics.filter((metric) => metric.value !== null);
    if (!available.length) {
      return 'Aún no hay mediciones disponibles.';
    }

    return `Destaca en ${available.reduce((highest, metric) => (metric.value! > highest.value! ? metric : highest)).label.toLowerCase()}.`;
  }

  private metricValue(fruit: Fruta, key: SensoryMetricKey): number | null {
    switch (key) {
      case 'sweetness': return fruit.psDulzor ?? null;
      case 'acidity': return fruit.psAcidez ?? null;
      case 'fruitiness': return fruit.psAromaFrutal ?? null;
      case 'color': return fruit.psColor ?? null;
      case 'intensity': return fruit.psIntensidad ?? null;
      case 'acceptance': return fruit.psAceptacionGlobal ?? null;
      default: return null;
    }
  }

  private average(values: number[]): number {
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
  }
}
