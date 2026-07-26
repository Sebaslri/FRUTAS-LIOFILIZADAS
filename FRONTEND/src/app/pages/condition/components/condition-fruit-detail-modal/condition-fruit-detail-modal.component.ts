import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../../shared/material.module';
import { Fruta } from '../../../fruit/models/Fruta.interface';
import { MetricItem } from './configuration.interface';
import { EducationalGoal } from '../condition-results/configuration.interface';

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
      case 'fruitiness':
        return 'El valor representa los °Brix, que indican el dulzor de la fruta. Un número mayor significa que la infusión tendrá un sabor más dulce y pronunciado, destacando mejor las notas frutales.';
      case 'bioaccessibility':
        return 'Estos valores indican el porcentaje de nutrientes (carotenoides, flavonoides, ácido ascórbico) que el cuerpo puede llegar a aprovechar después de la digestión. Un porcentaje mayor representa un mejor aprovechamiento nutricional.';
      case 'sensory':
        return 'Este valor representa el índice de madurez de la fruta. Un número más alto indica que está en un punto óptimo de maduración, lo que generalmente se traduce en una mayor y mejor aceptación al consumirse.';
      default:
        return 'Estos son los valores asociados al perfil seleccionado.';
    }
  }

  protected getMetricsForGoal(metricType: string): MetricItem[] {
    switch (metricType) {
      case 'fruitiness':
        return [{ label: 'Sólidos solubles', key: 'promedioGradosBrix', suffix: ' °Brix' }];
      case 'bioaccessibility':
        return [
          { label: '% Bioaccesibilidad carotenoides', key: 'promedioBioaccCarotenoides', suffix: '%' },
          { label: '% Bioaccesibilidad Flavonoides', key: 'promedioBioaccFlavonoides', suffix: '%' },
          { label: '% Bioaccesibilidad Ác. Asc.', key: 'promedioBioaccAcAsc', suffix: '%' },
        ];
      case 'sensory':
        return [{ label: 'Índice de madurez', key: 'promedioIndiceMadurez' }];
      default:
        return [];
    }
  }

  protected close(): void {
    this.dialogRef.close();
  }
}
