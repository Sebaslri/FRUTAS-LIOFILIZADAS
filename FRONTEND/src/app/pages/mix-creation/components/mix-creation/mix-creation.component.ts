import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { endpoint } from '../../../../shared/apis/endpoints';
import { environment as env } from '../../../../environments/environment';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { FruitService } from '../../../../shared/services/fruit.service';
import { Fruta } from '../../../../shared/interfaces/Fruta.interface';
import { fadeInRight400ms, scaleIn400ms, stagger40ms } from '../../../../shared/animations/page.animations';
import { CustomTitleService } from '../../../../shared/services/custom-title.service';
import { HostListener } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MixMobileModalComponent } from '../mix-mobile-modal/mix-mobile-modal.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-mix-creation',
  standalone: true,
  imports: [CommonModule, DragDropModule, HttpClientModule, SweetAlert2Module, MatIconModule, MatButtonModule, MatTableModule, MatDialogModule, MatProgressSpinnerModule],
  templateUrl: './mix-creation.component.html',
  styleUrls: ['./mix-creation.component.css'],
  animations: [fadeInRight400ms, scaleIn400ms, stagger40ms]
})
export class MixCreationComponent implements OnInit {

  private readonly _fruitService = inject(FruitService);
  private readonly _http = inject(HttpClient);
  private readonly customTitle = inject(CustomTitleService);
  private readonly dialog = inject(MatDialog);

  allFruitsDb: Fruta[] = [];

  availableFruits: Fruta[] = [];
  mixerFruits: Fruta[] = [];
  isMixing = false;
  loading = true;
  modelMetrics: any = null;
  predictions: any = null;
  displayedColumns: string[] = ['variable', 'mae', 'rmse', 'nrmse', 'r2', 'estado'];
  metricsDataSource: any[] = [];
  envApi = env.api; // Para acceder a las imágenes si es necesario construir URL
  isMobile = false;

  @HostListener('window:resize')
  onResize() {
    this.checkMobile();
  }

  checkMobile() {
    this.isMobile = window.innerWidth <= 1023; // Breakpoint para vista móvil donde se oculta la galería
  }

  ngOnInit(): void {
    this.customTitle.set('Laboratorio de Mixes');
    this.checkMobile();
    this.loadFruits();
  }

  loadFruits() {
    const state = window.history.state;
    const preselectedIds: number[] = state?.preselectedFruitIds || [];

    this._fruitService.getAll().subscribe({
      next: (frutas) => {
        this.allFruitsDb = frutas;
        if (preselectedIds.length > 0) {
          this.availableFruits = frutas.filter(f => !preselectedIds.includes(f.frutaId));
          this.mixerFruits = frutas.filter(f => preselectedIds.includes(f.frutaId));
        } else {
          this.availableFruits = frutas;
        }
        
        // Preload images before hiding the loading screen
        this.preloadImages(frutas).then(() => {
          this.loading = false;
        });
      },
      error: (err) => {
        this.loading = false;
        console.error('Error cargando frutas:', err);
        Swal.fire('Error', 'No se pudieron cargar las frutas de la base de datos.', 'error');
      }
    });
  }

  private preloadImages(frutas: Fruta[]): Promise<void[]> {
    const urlsToPreload = new Set<string>();
    frutas.forEach(f => {
      if (f.imagen) {
        urlsToPreload.add(f.imagen);
      }
    });
    urlsToPreload.add('/images/fruit-hero.png');

    const promises = Array.from(urlsToPreload).map(url => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    });

    return Promise.all(promises);
  }

  drop(event: CdkDragDrop<Fruta[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (event.container.id === 'mixerList' && this.mixerFruits.length >= 4) {
        Swal.fire('Límite alcanzado', 'Puedes mezclar un máximo de 4 frutas', 'warning');
        return;
      }
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  openMobileSelectionModal() {
    if (!this.isMobile || this.isMixing) return;

    const dialogRef = this.dialog.open(MixMobileModalComponent, {
      width: '90vw',
      maxWidth: '400px',
      data: {
        allFruits: this.allFruitsDb,
        selectedFruits: [...this.mixerFruits]
      },
      panelClass: 'mix-mobile-dialog'
    });

    dialogRef.afterClosed().subscribe((result: Fruta[] | undefined) => {
      if (result) {
        this.mixerFruits = result;
        const selectedIds = this.mixerFruits.map(f => f.frutaId);
        this.availableFruits = this.allFruitsDb.filter(f => !selectedIds.includes(f.frutaId));
      }
    });
  }

  async mix() {
    if (this.mixerFruits.length < 2) {
      Swal.fire('Faltan ingredientes', 'Debes añadir al menos 2 frutas a la mezcladora', 'info');
      return;
    }

    this.isMixing = true;

    setTimeout(() => {
      this.predictMix();
    }, 3500);
  }

  predictMix() {
    const fruitIds = this.mixerFruits.map(f => f.frutaId);

    this._http.post<any>(`${env.api}${endpoint.PREDICT_MIX}`, { fruit_ids: fruitIds }).subscribe({
      next: (response) => {
        this.isMixing = false;

        if (response.metrics) {
          this.modelMetrics = response.metrics;
          this.metricsDataSource = ['cap_ant_digerido', 'bioacc_carotenoides', 'bioacc_flavonoides', 'bioacc_acAsc'].map(key => {
            return {
              id: key,
              targetName: this.getTargetDisplayName(key),
              mae: this.modelMetrics.per_target[key].mae,
              rmse: this.modelMetrics.per_target[key].rmse,
              nrmse: this.modelMetrics.per_target[key].nrmse,
              r2: this.modelMetrics.per_target[key].r2,
              quality: this.getScoreQuality(this.modelMetrics.per_target[key].r2)
            };
          });
        }

        this.predictions = response;

        this.availableFruits.push(...this.mixerFruits);
        this.mixerFruits = [];

        setTimeout(() => {
          document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      },
      error: (error) => {
        this.isMixing = false;
        console.error(error);
        Swal.fire('Error', 'No se pudo conectar con el motor de IA.', 'error');
      }
    });
  }

  getBestAndWorstTargets() {
    if (!this.modelMetrics || !this.modelMetrics.per_target) return null;
    const targets = this.modelMetrics.per_target;

    let bestTarget = '';
    let bestR2 = -Infinity;
    let worstTarget = '';
    let worstR2 = Infinity;

    for (const key of Object.keys(targets)) {
      if (targets[key].r2 > bestR2) {
        bestR2 = targets[key].r2;
        bestTarget = key;
      }
      if (targets[key].r2 < worstR2) {
        worstR2 = targets[key].r2;
        worstTarget = key;
      }
    }

    return { bestTarget, worstTarget };
  }

  getTargetDisplayName(key: string): string {
    const map: any = {
      'cap_ant_digerido': 'Cap. Antioxidante',
      'bioacc_carotenoides': 'Carotenoides',
      'bioacc_flavonoides': 'Flavonoides',
      'bioacc_acAsc': 'Ácido Ascórbico'
    };
    return map[key] || key;
  }

  getScoreQuality(r2: number) {
    if (r2 >= 0.60) return { label: 'Excelente predictibilidad', class: 'text-green-600', border: 'border-green-200', bg: 'bg-green-50', icon: 'verified' };
    if (r2 >= 0.45) return { label: 'Predictibilidad moderada', class: 'text-yellow-600', border: 'border-yellow-200', bg: 'bg-yellow-50', icon: 'moving' };
    return { label: 'Predictibilidad baja', class: 'text-red-600', border: 'border-red-200', bg: 'bg-red-50', icon: 'error_outline' };
  }

}
