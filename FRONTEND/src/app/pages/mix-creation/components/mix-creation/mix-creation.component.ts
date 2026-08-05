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
import { FruitService } from '../../../fruit/service/fruit.service';
import { Fruta } from '../../../fruit/models/Fruta.interface';
import { fadeInRight400ms, scaleIn400ms, stagger40ms } from '../../../../shared/animations/page.animations';
import { CustomTitleService } from '../../../../shared/services/custom-title.service';

@Component({
  selector: 'app-mix-creation',
  standalone: true,
  imports: [CommonModule, DragDropModule, HttpClientModule, SweetAlert2Module, MatIconModule, MatButtonModule],
  templateUrl: './mix-creation.component.html',
  styleUrls: ['./mix-creation.component.css'],
  animations: [fadeInRight400ms, scaleIn400ms, stagger40ms]
})
export class MixCreationComponent implements OnInit {
  
  private readonly _fruitService = inject(FruitService);
  private readonly _http = inject(HttpClient);
  private readonly customTitle = inject(CustomTitleService);

  availableFruits: Fruta[] = [];
  mixerFruits: Fruta[] = [];
  isMixing = false;
  modelMetrics: any = null;
  envApi = env.api; // Para acceder a las imágenes si es necesario construir URL

  ngOnInit(): void {
    this.customTitle.set('Laboratorio de Mixes');
    this.loadFruits();
  }

  loadFruits() {
    const state = window.history.state;
    const preselectedIds: number[] = state?.preselectedFruitIds || [];

    this._fruitService.getAll().subscribe({
      next: (frutas) => {
        if (preselectedIds.length > 0) {
          this.availableFruits = frutas.filter(f => !preselectedIds.includes(f.frutaId));
          this.mixerFruits = frutas.filter(f => preselectedIds.includes(f.frutaId));
        } else {
          this.availableFruits = frutas;
        }
      },
      error: (err) => {
        console.error('Error cargando frutas:', err);
        Swal.fire('Error', 'No se pudieron cargar las frutas de la base de datos.', 'error');
      }
    });
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
  
  async mix() {
    if (this.mixerFruits.length < 2) {
      Swal.fire('Faltan ingredientes', 'Debes añadir al menos 2 frutas a la mezcladora', 'info');
      return;
    }

    this.isMixing = true;
    
    setTimeout(() => {
      this.predictMix();
    }, 1500); 
  }
  
  predictMix() {
    const fruitIds = this.mixerFruits.map(f => f.frutaId);
    
    this._http.post<any>(endpoint.PREDICT_MIX, { fruit_ids: fruitIds }).subscribe({
      next: (response) => {
        this.isMixing = false;
        
        if (response.metrics) {
          this.modelMetrics = response.metrics;
        }

        const imagesHtml = this.mixerFruits.map(f => {
          const imgUrl = f.imagen || '/images/fruit-hero.png';
          return `<img src="${imgUrl}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 50%; border: 2px solid #ccc; margin: 0 5px;" alt="${f.nombreComun}">`;
        }).join('<span style="font-size: 24px; font-weight: bold; color: #888;">+</span>');

        Swal.fire({
          title: '¡Tu Mix de Bioactivos!',
          html: `
            <div style="display: flex; justify-content: center; align-items: center; gap: 10px; margin-bottom: 20px;">
              ${imagesHtml}
            </div>
            
            <div class="grid grid-cols-2 gap-4 text-left p-4 bg-gray-50 rounded-lg shadow-inner mb-4">
              <div class="flex flex-col p-2 bg-white rounded-md shadow-sm border-l-4 border-red-500">
                <span class="text-[10px] text-gray-500 font-bold uppercase leading-tight">Cap. Antioxidante</span>
                <span class="text-xl font-extrabold text-red-500">${response.capacidad_antioxidante}</span>
              </div>
              <div class="flex flex-col p-2 bg-white rounded-md shadow-sm border-l-4 border-orange-500">
                <span class="text-[10px] text-gray-500 font-bold uppercase leading-tight">Carotenoides</span>
                <span class="text-xl font-extrabold text-orange-500">${response.carotenoides}</span>
              </div>
              <div class="flex flex-col p-2 bg-white rounded-md shadow-sm border-l-4 border-purple-500">
                <span class="text-[10px] text-gray-500 font-bold uppercase leading-tight">Flavonoides</span>
                <span class="text-xl font-extrabold text-purple-500">${response.flavonoides}</span>
              </div>
              <div class="flex flex-col p-2 bg-white rounded-md shadow-sm border-l-4 border-yellow-500">
                <span class="text-[10px] text-gray-500 font-bold uppercase leading-tight">Ác. Ascórbico</span>
                <span class="text-xl font-extrabold text-yellow-500">${response.acido_ascorbico}</span>
              </div>
            </div>
          `,
          width: '600px',
          confirmButtonColor: '#3b82f6',
          confirmButtonText: 'Experimentar con otra mezcla',
          showCancelButton: true,
          cancelButtonText: '<i class="material-symbols-outlined" style="vertical-align: middle; font-size: 18px; margin-right: 4px;">insights</i> Ver detalles de IA',
          cancelButtonColor: '#10b981',
          reverseButtons: true
        }).then((result) => {
          this.availableFruits.push(...this.mixerFruits);
          this.mixerFruits = [];
          
          if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
            setTimeout(() => {
              document.getElementById('metrics-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
          }
        });
      },
      error: (error) => {
        this.isMixing = false;
        console.error(error);
        Swal.fire('Error', 'No se pudo conectar con el motor de IA.', 'error');
      }
    });
  }

  getMetricsComparisonMessage(): { title: string, text: string, bgColor: string, borderColor: string, textColor: string, icon: string } | null {
    if (!this.modelMetrics) return null;
    
    const diff = this.modelMetrics.rmse - this.modelMetrics.mae;
    
    if (diff < (this.modelMetrics.mae * 0.3)) {
      return {
        title: '🌟 Excelente Consistencia',
        text: 'La diferencia entre MAE y RMSE es mínima. Esto significa que el modelo de IA es sumamente estable y sus errores son uniformes; rara vez se desvía drásticamente al calcular la interacción de tu mezcla.',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-400',
        textColor: 'text-green-800',
        icon: 'check_circle'
      };
    } else if (diff > (this.modelMetrics.mae * 0.6)) {
      return {
        title: '⚠️ Variaciones Atípicas Detectadas',
        text: 'El RMSE es notablemente mayor que el MAE. Esto sugiere que, aunque el modelo suele ser preciso, esta combinación particular de frutas genera una predicción con posibles errores más grandes de lo normal (outliers).',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-400',
        textColor: 'text-red-800',
        icon: 'error'
      };
    } else {
      return {
        title: '📊 Consistencia Moderada',
        text: 'Existe una diferencia normal entre el MAE y RMSE. El modelo tiene una exactitud sólida, presentando solo variaciones naturales y esperadas al evaluar la compleja interacción bioquímica de estas frutas.',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-400',
        textColor: 'text-yellow-800',
        icon: 'warning'
      };
    }
  }

}
