import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/material.module';
import { fadeInRight400ms, scaleIn400ms, stagger40ms } from '../../../../shared/animations/page.animations';
import { Mix } from '../../../../shared/interfaces/mix.interface';
import { MixService } from '../../../../shared/services/mix.service';
import { Fruta } from '../../../fruit/models/Fruta.interface';
import { FruitComparisonService } from '../../../fruit-comparison/services/fruit-comparison.service';
import { CustomTitleService } from '../../../../shared/services/custom-title.service';
import { PreparationSource } from './configuration.interface';

@Component({
  selector: 'app-preparation-calculator',
  standalone: true,
  imports: [FormsModule, MaterialModule],
  templateUrl: './preparation-calculator.component.html',
  styleUrl: './preparation-calculator.component.css',
  animations: [fadeInRight400ms, scaleIn400ms, stagger40ms],
})
export class PreparationCalculatorComponent implements OnInit {
  protected fruits: Fruta[] = [];
  protected mixes: (Mix & { fruitImages?: string[] })[] = [];
  protected selected: PreparationSource | null = null;
  protected temperature = 22;
  protected loading = true;

  private readonly fruitService = inject(FruitComparisonService);
  private readonly mixService = inject(MixService);
  private readonly customTitle = inject(CustomTitleService);

  ngOnInit(): void {
    this.customTitle.set('Calculadora de Preparación');
    let pending = 2;
    const done = () => { pending -= 1; if (pending === 0) this.loading = false; };

    this.fruitService.getFruits().subscribe({
      next: (fruits) => { this.fruits = fruits; this.selected = fruits[0] ?? null; },
      error: done,
      complete: done,
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
      error: done,
      complete: done,
    });
  }

  protected selectSource(source: PreparationSource): void { this.selected = source; }

  protected get selectedName(): string {
    if (!this.selected) return 'Selecciona una fruta o mix';
    return 'nombreComun' in this.selected ? this.selected.nombreComun : this.selected.frutas;
  }

  protected get selectedImage(): string {
    return this.selected?.imagen || '/images/fruit-hero.png';
  }

  protected sourceType(source: PreparationSource): string { return 'nombreComun' in source ? 'Fruta' : 'Mix'; }

  protected get currentDpph(): number | null {
    if (!this.selected) return null;
    let v22 = null;
    let v90 = null;
    
    if ('nombreComun' in this.selected) {
      v22 = this.selected.promedioActAntioxDpphInf22;
      v90 = this.selected.promedioActAntioxDpphInf90;
    } else {
      v22 = this.selected.ActAntiox_dpph_inf22;
      v90 = this.selected.ActAntiox_dpph_inf90;
    }
    
    return this.interpolate(v22, v90);
  }

  protected get currentFenoles(): number | null {
    if (!this.selected) return null;
    let v22 = null;
    let v90 = null;

    if ('nombreComun' in this.selected) {
      v22 = this.selected.promedioFenolesTotalesInf22;
      v90 = this.selected.promedioFenolesTotalesInf90;
    } else {
      v22 = this.selected.fenolesTotales_inf22;
      v90 = this.selected.fenolesTotales_inf90;
    }

    return this.interpolate(v22, v90);
  }

  private interpolate(v22: number | null | undefined, v90: number | null | undefined): number | null {
    const val22 = Number(v22);
    const val90 = Number(v90);
    
    if (!Number.isFinite(val22) || !Number.isFinite(val90)) {
      return null; 
    }

    const ratio = (this.temperature - 22) / (90 - 22);
    return val22 + ratio * (val90 - val22);
  }

  protected format(value: number | null): string {
    return value === null ? 'Sin datos' : new Intl.NumberFormat('es-EC', { maximumFractionDigits: 2 }).format(value);
  }

  // Calculate percentage of heating (0 to 1) for the thermos UI
  protected get heatPercentage(): number {
    return (this.temperature - 22) / (90 - 22);
  }

  protected getInterpolated(source: PreparationSource, key: 'dpph' | 'fenoles'): number | null {
    let v22 = null;
    let v90 = null;
    
    if ('nombreComun' in source) {
      v22 = key === 'dpph' ? source.promedioActAntioxDpphInf22 : source.promedioFenolesTotalesInf22;
      v90 = key === 'dpph' ? source.promedioActAntioxDpphInf90 : source.promedioFenolesTotalesInf90;
    } else {
      v22 = key === 'dpph' ? source.ActAntiox_dpph_inf22 : source.fenolesTotales_inf22;
      v90 = key === 'dpph' ? source.ActAntiox_dpph_inf90 : source.fenolesTotales_inf90;
    }
    
    return this.interpolate(v22, v90);
  }

  // Exact tracker position to match slider thumb
  protected get trackerPosition(): string {
    // Range thumb is 36px wide
    return `calc(${this.heatPercentage * 100}% + ${18 - this.heatPercentage * 36}px)`;
  }

  // Exact gradient matching the slider: #3498db -> #f39c12 -> #e74c3c
  protected get thermosColor(): string {
    const c1 = [52, 152, 219]; // #3498db (Blue)
    const c2 = [243, 156, 18]; // #f39c12 (Orange)
    const c3 = [231, 76, 60];  // #e74c3c (Red)

    let r, g, b;
    if (this.heatPercentage < 0.5) {
      const p = this.heatPercentage * 2;
      r = Math.round(c1[0] + (c2[0] - c1[0]) * p);
      g = Math.round(c1[1] + (c2[1] - c1[1]) * p);
      b = Math.round(c1[2] + (c2[2] - c1[2]) * p);
    } else {
      const p = (this.heatPercentage - 0.5) * 2;
      r = Math.round(c2[0] + (c3[0] - c2[0]) * p);
      g = Math.round(c2[1] + (c3[1] - c2[1]) * p);
      b = Math.round(c2[2] + (c3[2] - c2[2]) * p);
    }
    return `rgb(${r}, ${g}, ${b})`;
  }

  protected isSliding = false;
}
