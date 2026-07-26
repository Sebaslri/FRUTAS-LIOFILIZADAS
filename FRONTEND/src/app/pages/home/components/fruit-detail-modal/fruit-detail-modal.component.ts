import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-fruit-detail-modal',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './fruit-detail-modal.component.html',
  styleUrl: './fruit-detail-modal.component.css',
})
export class FruitDetailModalComponent {
  protected readonly data = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<FruitDetailModalComponent>);

  protected close() {
    this.dialogRef.close();
  }
}
