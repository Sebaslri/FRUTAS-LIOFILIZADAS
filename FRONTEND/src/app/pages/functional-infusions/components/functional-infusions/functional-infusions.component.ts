import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/material.module';
import { fadeInRight400ms, scaleIn400ms, stagger40ms } from '../../../../shared/animations/page.animations';
import { Fruta } from '../../../../shared/interfaces/Fruta.interface';
import { FunctionalInfusionSource, Table1Row, Table2Row } from '../../models/functional-infusions.interface';
import { FunctionalInfusionsService } from '../../services/functional-infusions.service';
import { CustomTitleService } from '../../../../shared/services/custom-title.service';

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
  private readonly customTitle = inject(CustomTitleService);

  ngOnInit(): void {
    this.customTitle.set('Infusiones Funcionales');
    this.infusionsService.getSources().subscribe({
      next: ({ fruits, mixes }) => {
        this.fruits = fruits;
        this.mixes = mixes;
        if (this.mixes.length > 0) {
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

  // --- Table 1: Antes vs Después de la Digestión ---
  protected get table1Row() {
    if (!this.selected) return null;
    return {
      // Antes (Infusión)
      cap_ant_infusion: this.valueFor('cap_ant_infusion', 'promedioCapAntInfusion'),
      carotenoides_infusion: this.valueFor('carotenoides_infusion', 'promedioCarotenoidesInfusion'),
      flavonoides_infusion: this.valueFor('flavonoides_infusion', 'promedioFlavonoidesInfusion'),
      acido_asc_infusion: this.valueFor('acido_asc_infusion', 'promedioAcidoAscInfusion'),
      // Después (Digerido)
      cap_ant_digerido: this.valueFor('cap_ant_digerido', 'promedioCapAntDigerido'),
      carotenoides_digerido: this.valueFor('carotenoides_digerido', 'promedioCarotenoidesDigerido'),
      flavonoides_digerido: this.valueFor('flavonoides_digerido', 'promedioFlavonoidesDigerido'),
      acido_asc_digerido: this.valueFor('acido_asc_digerido', 'promedioAcidoAscDigerido'),
    };
  }

  // --- Table 2: Infusión vs Digerido ---
  protected get table2Row() {
    if (!this.selected) return null;
    return {
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
