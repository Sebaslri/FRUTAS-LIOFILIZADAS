import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-sensory-profile-info-modal',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './sensory-profile-info-modal.component.html',
  styleUrl: './sensory-profile-info-modal.component.css',
})
export class SensoryProfileInfoModalComponent {
  private readonly dialogRef = inject(MatDialogRef<SensoryProfileInfoModalComponent>);
  protected readonly data = inject(MAT_DIALOG_DATA, { optional: true }) as { fruitName?: string } | null;

  protected close(): void {
    this.dialogRef.close();
  }
}
