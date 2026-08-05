import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../../shared/material.module';
import { Fruta } from '../../../fruit/models/Fruta.interface';
import { MetricItem } from './configuration.interface';
import { EducationalGoal } from '../condition-results/configuration.interface';
import { PdfDataService, BioactiveCompound } from '../../services/pdf-data.service';

@Component({
  selector: 'app-condition-fruit-detail-modal',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './condition-fruit-detail-modal.component.html',
  styleUrl: './condition-fruit-detail-modal.component.css',
})
export class ConditionFruitDetailModalComponent {
  protected readonly data = inject<{ fruit: Fruta; isMix?: boolean; fruitImages?: string[]; selectedGoal?: EducationalGoal }>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ConditionFruitDetailModalComponent>);
  private readonly pdfDataService = inject(PdfDataService);

  protected bioactiveCompounds: BioactiveCompound[] = [];

  constructor() {
    if (this.data.fruit && this.data.fruit.frutaId) {
      this.bioactiveCompounds = this.pdfDataService.getFruitData(this.data.fruit.frutaId);
    }
  }

  protected metricValue(metric: MetricItem): string {
    const rawValue = this.data.fruit[metric.key as keyof Fruta];
    const value = typeof rawValue === 'number' ? rawValue : Number(rawValue);

    if (rawValue === null || rawValue === undefined || !Number.isFinite(value)) {
      return 'Sin datos';
    }

    return `${new Intl.NumberFormat('es-EC', { maximumFractionDigits: 2 }).format(value)}${metric.suffix ?? ''}`;
  }

  protected getExplanation(metricType: string): string {
    switch (metricType) {
      case 'dulzor':
        return 'El valor (del 1 al 10) representa el nivel de dulzor percibido en la fruta según el perfil sensorial.';
      case 'acidez':
        return 'El valor (del 1 al 10) representa el nivel de acidez percibido, indicando qué tan refrescante o cítrica es.';
      case 'aroma':
        return 'El valor (del 1 al 10) representa la intensidad de las notas aromáticas frutales presentes.';
      case 'aceptacion':
        return 'El valor (del 1 al 10) representa la aceptación global y el equilibrio de la fruta en evaluaciones sensoriales.';
      case 'color':
        return 'El valor (del 1 al 10) indica la vivacidad y atractivo del color de la fruta.';
      case 'intensidad':
        return 'El valor (del 1 al 10) representa la fuerza e intensidad del sabor característico de la fruta.';
      default:
        return 'Estos son los valores asociados al perfil seleccionado.';
    }
  }

  protected getMetricsForGoal(metricType: string): MetricItem[] {
    switch (metricType) {
      case 'dulzor':
        return [{ label: 'Dulzor (Escala 1-10)', key: 'psDulzor' }];
      case 'acidez':
        return [{ label: 'Acidez (Escala 1-10)', key: 'psAcidez' }];
      case 'aroma':
        return [{ label: 'Aroma Frutal (Escala 1-10)', key: 'psAromaFrutal' }];
      case 'aceptacion':
        return [{ label: 'Aceptación Global (Escala 1-10)', key: 'psAceptacionGlobal' }];
      case 'color':
        return [{ label: 'Color (Escala 1-10)', key: 'psColor' }];
      case 'intensidad':
        return [{ label: 'Intensidad (Escala 1-10)', key: 'psIntensidad' }];
      default:
        return [];
    }
  }

  protected close(): void {
    this.dialogRef.close();
  }
}
