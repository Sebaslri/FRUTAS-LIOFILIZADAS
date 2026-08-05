import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../../shared/material.module';
import { FRUIT_COLORS } from '../../../../shared/functions/variables.interface';
import { ComparisonTableRow, FruitComparisonDialogData } from './configuration.interface';

@Component({
  selector: 'app-fruit-comparison-table-modal',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './fruit-comparison-table-modal.component.html',
  styleUrl: './fruit-comparison-table-modal.component.css',
})
export class FruitComparisonTableModalComponent {
  protected readonly data = inject<FruitComparisonDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<FruitComparisonTableModalComponent>);

  protected get firstFruitColor(): string {
    return FRUIT_COLORS[this.data.firstFruit.nombreComun] ?? '#d9890f';
  }

  protected get secondFruitColor(): string {
    return FRUIT_COLORS[this.data.secondFruit.nombreComun] ?? '#4f7b38';
  }

  protected formatValue(value: number | null, unit?: string): string {
    if (value === null) {
      return 'Sin dato';
    }

    const formatted = new Intl.NumberFormat('es-EC', { maximumFractionDigits: 2 }).format(value);
    return unit ? (unit.startsWith('/') ? `${formatted}${unit}` : `${formatted} ${unit}`) : formatted;
  }

  protected formatPercentage(value: number | null): string {
    return value === null
      ? '—'
      : `${new Intl.NumberFormat('es-EC', { maximumFractionDigits: 1 }).format(value)}%`;
  }

  protected winner(row: ComparisonTableRow): string {
    if (row.firstValue === null && row.secondValue === null) {
      return 'Sin datos';
    }

    if (row.firstValue === row.secondValue) {
      return 'Iguales';
    }

    if (row.secondValue === null || (row.firstValue !== null && row.firstValue > row.secondValue)) {
      return this.data.firstFruit.nombreComun;
    }

    return this.data.secondFruit.nombreComun;
  }

  protected close(): void {
    this.dialogRef.close();
  }
}
