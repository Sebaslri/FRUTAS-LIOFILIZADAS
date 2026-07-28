import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Fruta } from '../../../fruit/models/Fruta.interface';
import { MaterialModule } from '../../../../shared/material.module';
import { FruitComparisonService } from '../../services/fruit-comparison.service';
import { FruitComparisonTableModalComponent } from './fruit-comparison-table-modal.component';
import { fadeInRight400ms, scaleIn400ms, stagger40ms } from '../../../../shared/animations/page.animations';
import { MixService } from '../../../../shared/services/mix.service';
import { CustomTitleService } from '../../../../shared/services/custom-title.service';
import { Mix } from '../../../../shared/interfaces/mix.interface';
import {
  ComparisonPropertyConfig,
  ComparisonSlot,
  ComparisonTableRow,
  FruitComparisonDialogData,
} from './configuration.interface';

@Component({
  selector: 'app-fruit-comparison',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './fruit-comparison.component.html',
  styleUrl: './fruit-comparison.component.css',
  animations: [fadeInRight400ms, scaleIn400ms, stagger40ms],
})
export class FruitComparisonComponent implements OnInit {
  protected readonly properties: ComparisonPropertyConfig[] = [
    {
      key: 'promedioCapAntInfusion',
      label: 'Capacidad antioxidante en infusión',
      group: 'Antioxidantes',
    },
    {
      key: 'promedioCapAntDigerido',
      label: 'Capacidad antioxidante digerida',
      group: 'Antioxidantes',
    },
    {
      key: 'promedioBioaccCarotenoides',
      label: 'Bioaccesibilidad de carotenoides',
      group: 'Bioaccesibilidad',
    },
    {
      key: 'promedioBioaccFlavonoides',
      label: 'Bioaccesibilidad de flavonoides',
      group: 'Bioaccesibilidad',
    },
    {
      key: 'promedioBioaccAcAsc',
      label: 'Bioaccesibilidad de ácido ascórbico',
      group: 'Bioaccesibilidad',
    },
    {
      key: 'promedioAcidez',
      label: 'Acidez',
      group: 'Perfil fisicoquímico',
    },
    {
      key: 'promedioGradosBrix',
      label: 'Dulzor',
      group: 'Perfil fisicoquímico',
      unit: '°Brix',
    },
  ];

  protected fruits: Fruta[] = [];
  protected slots: ComparisonSlot[] = [
    { label: 'Fruta A', fruit: null },
    { label: 'Fruta B', fruit: null },
  ];
  protected draggingFruitId: number | null = null;
  protected comparisonLoading = false;
  protected loading = true;
  protected mixes: (Mix & { fruitImages?: string[] })[] = [];

  private readonly comparisonService = inject(FruitComparisonService);
  private readonly dialog = inject(MatDialog);
  private readonly mixService = inject(MixService);
  private readonly customTitle = inject(CustomTitleService);
  private comparisonTimer?: number;

  ngOnInit(): void {
    this.customTitle.set('Comparador de Frutas');
    this.comparisonService.getFruits().subscribe({
      next: (fruits) => {
        this.fruits = fruits;
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

  protected get readyToCompare(): boolean {
    return this.slots.every((slot) => slot.fruit !== null);
  }

  protected selectFruit(fruit: Fruta, slotIndex?: number): void {
    if (this.isFruitSelected(fruit, false)) {
      return;
    }

    const emptySlot = this.slots.findIndex((slot) => slot.fruit === null);
    const index = slotIndex !== undefined ? slotIndex : (emptySlot >= 0 ? emptySlot : 0);
    this.slots[index].fruit = fruit;
    this.slots[index].isMix = false;
    this.slots[index].fruitImages = [];
    this.queueComparisonUpdate();
  }

  protected selectMix(mix: Mix & { fruitImages?: string[] }, slotIndex?: number): void {
    const fruitMix: Fruta = {
      frutaId: mix.mixId,
      nombreComun: mix.frutas,
      nombreCientifico: 'Mezcla experimental de frutas.',
      descripcion: 'Mezcla experimental de frutas.',
      imagen: mix.imagen,
      region: '',
      provincias: [],
      promedioCapAntInfusion: mix.cap_ant_infusion,
      promedioCapAntDigerido: mix.cap_ant_digerido,
      promedioBioaccCarotenoides: mix.bioacc_carotenoides,
      promedioBioaccFlavonoides: mix.bioacc_flavonoides,
      promedioBioaccAcAsc: mix.bioacc_acAsc,
      promedioGradosBrix: mix.gradosBrix,
      promedioAcidez: mix.acidez,
      promedioFirmeza: mix.firmeza,
      promedioIndiceMadurez: mix.indiceMadurez
    };

    if (this.isFruitSelected(fruitMix, true)) {
      return;
    }

    const emptySlot = this.slots.findIndex((slot) => slot.fruit === null);
    const index = slotIndex !== undefined ? slotIndex : (emptySlot >= 0 ? emptySlot : 0);
    this.slots[index].fruit = fruitMix;
    this.slots[index].isMix = true;
    this.slots[index].fruitImages = mix.fruitImages || [];
    this.queueComparisonUpdate();
  }

  protected isFruitSelected(fruit: Fruta, isMix = false): boolean {
    return this.slots.some((slot) => slot.fruit?.frutaId === fruit.frutaId && slot.isMix === isMix);
  }

  protected removeFruit(slotIndex: number): void {
    this.slots[slotIndex].fruit = null;
    this.slots[slotIndex].isMix = false;
    this.slots[slotIndex].fruitImages = [];
    this.queueComparisonUpdate();
  }

  protected onDragStart(event: DragEvent, fruit: Fruta): void {
    if (this.isFruitSelected(fruit, false)) {
      event.preventDefault();
      return;
    }

    this.draggingFruitId = fruit.frutaId;
    event.dataTransfer?.setData('text/plain', JSON.stringify({ id: fruit.frutaId, isMix: false }));
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'copy';
    }
  }

  protected onMixDragStart(event: DragEvent, mix: Mix): void {
    const fruitMix = { frutaId: mix.mixId } as Fruta;
    if (this.isFruitSelected(fruitMix, true)) {
      event.preventDefault();
      return;
    }

    this.draggingFruitId = mix.mixId;
    event.dataTransfer?.setData('text/plain', JSON.stringify({ id: mix.mixId, isMix: true }));
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'copy';
    }
  }

  protected onDragEnd(): void {
    this.draggingFruitId = null;
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  protected onDrop(event: DragEvent, slotIndex: number): void {
    event.preventDefault();
    try {
      const data = JSON.parse(event.dataTransfer?.getData('text/plain') || '{}');
      if (data.isMix) {
        const mix = this.mixes.find(m => m.mixId === data.id);
        if (mix && !this.isFruitSelectedInOtherSlot({ frutaId: mix.mixId } as Fruta, slotIndex, true)) {
          this.selectMix(mix, slotIndex);
        }
      } else {
        const fruit = this.fruits.find((item) => item.frutaId === data.id);
        if (fruit && !this.isFruitSelectedInOtherSlot(fruit, slotIndex, false)) {
          this.selectFruit(fruit, slotIndex);
        }
      }
    } catch (e) {
      // Ignorar si el JSON no es válido
    }

    this.draggingFruitId = null;
  }

  protected openComparison(): void {
    const firstFruit = this.slots[0].fruit;
    const secondFruit = this.slots[1].fruit;

    if (!firstFruit || !secondFruit || this.comparisonLoading) {
      return;
    }

    const data: FruitComparisonDialogData = {
      firstFruit,
      secondFruit,
      rows: this.buildTableRows(firstFruit, secondFruit),
    };

    this.dialog.open(FruitComparisonTableModalComponent, {
      data,
      autoFocus: false,
      width: 'min(920px, calc(100vw - 2rem))',
      maxWidth: '920px',
      maxHeight: '90vh',
    });
  }

  private buildTableRows(firstFruit: Fruta, secondFruit: Fruta): ComparisonTableRow[] {
    return this.properties.map((property) => {
      const firstValue = this.numberValue(firstFruit[property.key]);
      const secondValue = this.numberValue(secondFruit[property.key]);
      const percentages = this.percentagesFor(firstValue, secondValue);

      return {
        ...property,
        firstValue,
        secondValue,
        firstPercentage: percentages[0],
        secondPercentage: percentages[1],
      };
    });
  }

  private percentagesFor(firstValue: number | null, secondValue: number | null): [number | null, number | null] {
    if (firstValue === null && secondValue === null) {
      return [null, null];
    }

    const first = firstValue ?? 0;
    const second = secondValue ?? 0;
    const total = first + second;

    if (total <= 0) {
      return [firstValue === null ? null : 50, secondValue === null ? null : 50];
    }

    return [
      firstValue === null ? null : (first / total) * 100,
      secondValue === null ? null : (second / total) * 100,
    ];
  }

  private numberValue(value: unknown): number | null {
    if (value === null || value === undefined) {
      return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private queueComparisonUpdate(): void {
    window.clearTimeout(this.comparisonTimer);

    if (!this.readyToCompare) {
      this.comparisonLoading = false;
      return;
    }

    this.comparisonLoading = true;
    this.comparisonTimer = window.setTimeout(() => {
      this.comparisonLoading = false;
    }, 360);
  }

  private isFruitSelectedInOtherSlot(fruit: Fruta, slotIndex: number, isMix: boolean): boolean {
    return this.slots.some((slot, index) => index !== slotIndex && slot.fruit?.frutaId === fruit.frutaId && slot.isMix === isMix);
  }
}
