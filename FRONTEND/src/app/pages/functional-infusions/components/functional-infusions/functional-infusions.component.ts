import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/material.module';
import { fadeInRight400ms, scaleIn400ms, stagger40ms } from '../../../../shared/animations/page.animations';
import { Fruta } from '../../../fruit/models/Fruta.interface';
import { FunctionalInfusionSource, Table1Row, Table2Row } from '../../models/functional-infusions.model';
import { FunctionalInfusionsService } from '../../services/functional-infusions.service';

@Component({
  selector: 'app-functional-infusions',
  standalone: true,
  imports: [FormsModule, MaterialModule],
  templateUrl: './functional-infusions.component.html',
  styleUrl: './functional-infusions.component.css',
  animations: [fadeInRight400ms, scaleIn400ms, stagger40ms],
})
export class FunctionalInfusionsComponent implements OnInit {
  protected fruits: Fruta[] = [];
  protected mixes: FunctionalInfusionSource[] = [];
  protected selected: FunctionalInfusionSource | null = null;
  protected loading = true;

  private readonly infusionsService = inject(FunctionalInfusionsService);

  ngOnInit(): void {
    this.infusionsService.getSources().subscribe({
      next: ({ fruits, mixes }) => {
        this.fruits = fruits;
        this.mixes = mixes;
        if (this.fruits.length > 0) {
          this.selected = this.fruits[0];
        } else if (this.mixes.length > 0) {
          this.selected = this.mixes[0];
        }
      },
      error: () => { this.loading = false; },
      complete: () => { this.loading = false; },
    });
  }

  protected selectSource(source: FunctionalInfusionSource): void {
    this.selected = source;
  }

  protected get selectedName(): string {
    if (!this.selected) return 'Selecciona una fruta o mix';
    return 'nombreComun' in this.selected ? this.selected.nombreComun : this.selected.frutas;
  }

  protected get selectedImage(): string {
    return this.selected?.imagen || '/images/fruit-hero.png';
  }

  protected sourceType(source: FunctionalInfusionSource): string {
    return 'nombreComun' in source ? 'Fruta' : 'Mix';
  }

  // --- Table 1: Fresca vs Liofilizada ---
  protected get table1Row() {
    if (!this.selected) return null;
    return {
      dpph_ff: this.valueFor('dpph_FF', 'promedioDpphFF'),
      fenoles_ff: this.valueFor('fenolesTotales_FF', 'promedioFenolesFF'),
      frap_ff: this.valueFor('frap_FF', 'promedioFrapFF'),
      flavonoides_ff: this.valueFor('flavonoides_FF', 'promedioFlavonoidesFF'),
      antocianinas_ff: this.valueFor('antocianinas_FF', 'promedioAntocianinasFF'),
      dpph_fl: this.valueFor('dpph_FL', 'promedioDpphFL'),
      frap_fl: this.valueFor('frap_FL', 'promedioFrapFL'),
      fenoles_fl: this.valueFor('fenolesTotales_FL', 'promedioFenolesFL'),
      flavonoides_fl: this.valueFor('flavonoides_FL', 'promedioFlavonoidesFL'),
      antocianinas_fl: this.valueFor('antocianinas_FL', 'promedioAntocianinasFL'),
    };
  }

  // --- Table 2: Infusión vs Digerido ---
  protected get table2Row() {
    if (!this.selected) return null;
    return {
      cap_ant_infusion: this.valueFor('cap_ant_infusion', 'promedioCapAntInfusion'),
      cap_ant_digerido: this.valueFor('cap_ant_digerido', 'promedioCapAntDigerido'),
      bioacc_carotenoides: this.valueFor('bioacc_carotenoides', 'promedioBioaccCarotenoides'),
      bioacc_flavonoides: this.valueFor('bioacc_flavonoides', 'promedioBioaccFlavonoides'),
      bioacc_acAsc: this.valueFor('bioacc_acAsc', 'promedioBioaccAcAsc'),
    };
  }

  protected format(value: number | null, isPercentage: boolean = false): string {
    if (value === null) return '-';
    const num = new Intl.NumberFormat('es-EC', { maximumFractionDigits: 1 }).format(value);
    return isPercentage ? `${num}%` : num;
  }

  /** Helper para sacar los campos dependiendo si es mix o fruta */
  private valueFor(mixKey: string, fruitKey: string): number | null {
    if (!this.selected) return null;
    const raw = 'nombreComun' in this.selected ? (this.selected as any)[fruitKey] : (this.selected as any)[mixKey];
    const parsed = Number(raw);
    return raw === null || raw === undefined || !Number.isFinite(parsed) ? null : parsed;
  }
}
