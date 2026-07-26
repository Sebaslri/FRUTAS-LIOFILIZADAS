import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../../../shared/material.module';
import { FRUIT_COLORS } from '../../../../shared/functions/variables.interface';
import { Fruta } from '../../../fruit/models/Fruta.interface';
import { SensoryProfileService } from '../../services/sensory-profile.service';
import { SensoryProfileInfoModalComponent } from './sensory-profile-info-modal.component';
import { fadeInRight400ms, scaleIn400ms, stagger40ms } from '../../../../shared/animations/page.animations';
import { MixService } from '../../../../shared/services/mix.service';
import { Mix } from '../../../../shared/interfaces/mix.interface';
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
      explanation: 'Se estima a partir de los sólidos solubles (°Brix).',
      color: '#e5a52d',
    },
    {
      key: 'acidity',
      label: 'Acidez',
      shortLabel: 'Acidez',
      explanation: 'Representa la intensidad relativa de la acidez titulable.',
      color: '#d87955',
    },
    {
      key: 'fruitiness',
      label: 'Aroma frutal',
      shortLabel: 'Aroma frutal',
      explanation: 'Indicador orientativo basado en el índice de madurez.',
      color: '#77a642',
    },
    {
      key: 'color',
      label: 'Color',
      shortLabel: 'Color',
      explanation: 'Intensidad cromática estimada desde las coordenadas CIELAB.',
      color: '#8b6bb1',
    },
    {
      key: 'intensity',
      label: 'Intensidad',
      shortLabel: 'Intensidad',
      explanation: 'Lectura conjunta de acidez, aroma frutal y color.',
      color: '#477b9b',
    },
    {
      key: 'acceptance',
      label: 'Aceptación global',
      shortLabel: 'Aceptación',
      explanation: 'Estimación de equilibrio entre dulzor, acidez, aroma y color.',
      color: '#c46c83',
    },
  ];

  protected fruits: Fruta[] = [];
  protected selectedFruit: Fruta | null = null;
  protected selectedIsMix = false;
  protected selectedMixImages: string[] = [];
  protected loading = true;
  protected mixes: (Mix & { fruitImages?: string[] })[] = [];

  private readonly sensoryProfileService = inject(SensoryProfileService);
  private readonly dialog = inject(MatDialog);
  private readonly mixService = inject(MixService);

  ngOnInit(): void {
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
    this.mixService.getAll().subscribe({
      next: (mixes) => {
        this.mixes = mixes.map(mix => {
          const fruitImages = mix.frutaIds.map(id => {
            const fruit = this.fruits.find(f => f.frutaId === id);
            return fruit?.imagen || '/images/fruit-hero.png';
          });
          return { ...mix, fruitImages };
        });
      },
      error: () => undefined,
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
    this.selectedIsMix = false;
    this.selectedMixImages = [];
  }

  protected selectMix(mix: Mix & { fruitImages?: string[] }): void {
    const fruitMix: Fruta = {
      frutaId: mix.mixId,
      nombreComun: mix.frutas,
      nombreCientifico: 'Mezcla experimental de frutas.',
      descripcion: 'Mezcla experimental de frutas.',
      imagen: mix.imagen,
      region: '',
      provincias: [],
      promedioAcidez: mix.acidez,
      promedioGradosBrix: mix.gradosBrix,
      promedioIndiceMadurez: mix.indiceMadurez,
      promedioPh: mix.pH,
      promedioColorL: mix.L,
      promedioColorA: mix.a,
      promedioColorB: mix.b,
      promedioHumedad: mix.humedad,
      promedioCenizas: mix.cenizas,
      promedioFirmeza: mix.firmeza
    };
    
    this.selectedFruit = fruitMix;
    this.selectedIsMix = true;
    this.selectedMixImages = mix.fruitImages || [];
  }

  protected openInfo(): void {
    this.dialog.open(SensoryProfileInfoModalComponent, {
      data: { fruitName: this.selectedFruit?.nombreComun },
      autoFocus: false,
      width: 'min(580px, calc(100vw - 2rem))',
      maxWidth: '580px',
      maxHeight: '88vh',
    });
  }

  protected formatScore(value: number | null): string {
    return value === null ? 'Sin dato' : `${Math.round(value)}/100`;
  }

  protected roundedScore(value: number | null): number | null {
    return value === null ? null : Math.round(value);
  }

  protected scoreWidth(value: number | null): number {
    return value ?? 0;
  }

  private fruitColor(fruit: Fruta): string {
    if (this.selectedIsMix) return '#b3824f';
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
    const directScores: Record<'sweetness' | 'acidity' | 'fruitiness' | 'color', number | null> = {
      sweetness: this.normalized(fruit, (item) => this.numberValue(item.promedioGradosBrix)),
      acidity: this.normalized(fruit, (item) => this.numberValue(item.promedioAcidez)),
      fruitiness: this.normalized(fruit, (item) => this.numberValue(item.promedioIndiceMadurez)),
      color: this.normalized(fruit, (item) => this.colorIntensity(item)),
    };

    if (key in directScores) {
      return directScores[key as keyof typeof directScores];
    }

    const acidity = directScores.acidity;
    const fruitiness = directScores.fruitiness;
    const color = directScores.color;
    const available = [acidity, fruitiness, color].filter((value): value is number => value !== null);

    if (key === 'intensity') {
      return available.length ? this.average(available) : null;
    }

    const sweetness = directScores.sweetness;
    const balance = sweetness !== null && acidity !== null ? 100 - Math.abs(sweetness - (100 - acidity)) : null;
    const acceptanceValues = [balance, fruitiness, color].filter((value): value is number => value !== null);

    return acceptanceValues.length ? this.average(acceptanceValues) : null;
  }

  private normalized(fruit: Fruta, valueOf: (item: Fruta) => number | null): number | null {
    const values = this.fruits.map(valueOf).filter((value): value is number => value !== null);
    const value = valueOf(fruit);

    if (value === null || !values.length) {
      return null;
    }

    const minimum = Math.min(...values);
    const maximum = Math.max(...values);
    return minimum === maximum ? 50 : ((value - minimum) / (maximum - minimum)) * 100;
  }

  private colorIntensity(fruit: Fruta): number | null {
    const colorA = this.numberValue(fruit.promedioColorA);
    const colorB = this.numberValue(fruit.promedioColorB);
    return colorA === null || colorB === null ? null : Math.sqrt(colorA ** 2 + colorB ** 2);
  }

  private numberValue(value: number | null | undefined): number | null {
    if (value === null || value === undefined) {
      return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private average(values: number[]): number {
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }
}
