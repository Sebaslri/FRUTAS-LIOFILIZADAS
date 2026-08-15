import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Fruta } from '../../../../shared/interfaces/Fruta.interface';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

export interface MixModalData {
  allFruits: Fruta[];
  selectedFruits: Fruta[];
}

@Component({
  selector: 'app-mix-mobile-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, SweetAlert2Module],
  templateUrl: './mix-mobile-modal.component.html',
  styleUrls: ['./mix-mobile-modal.component.css']
})
export class MixMobileModalComponent {
  availableFruits: Fruta[] = [];
  selectedFruits: Fruta[] = [];

  constructor(
    public dialogRef: MatDialogRef<MixMobileModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MixModalData
  ) {
    this.selectedFruits = [...data.selectedFruits];
    
    // Available fruits are those not in selectedFruits
    const selectedIds = this.selectedFruits.map(f => f.frutaId);
    this.availableFruits = data.allFruits.filter(f => !selectedIds.includes(f.frutaId));
  }

  toggleFruit(fruit: Fruta, isSelectedList: boolean) {
    if (isSelectedList) {
      // Remove from selected, add to available
      this.selectedFruits = this.selectedFruits.filter(f => f.frutaId !== fruit.frutaId);
      this.availableFruits.push(fruit);
      // Sort available to keep order (optional)
      this.availableFruits.sort((a, b) => a.nombreComun.localeCompare(b.nombreComun));
    } else {
      // Add to selected, remove from available
      if (this.selectedFruits.length >= 4) {
        Swal.fire({
          title: 'Límite alcanzado',
          text: 'Puedes mezclar un máximo de 4 frutas.',
          icon: 'warning',
          confirmButtonColor: '#78a549'
        });
        return;
      }
      this.availableFruits = this.availableFruits.filter(f => f.frutaId !== fruit.frutaId);
      this.selectedFruits.push(fruit);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close(this.selectedFruits);
  }
}
