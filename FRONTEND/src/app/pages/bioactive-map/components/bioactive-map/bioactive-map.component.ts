import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import * as L from 'leaflet';
import { BioactiveMapService } from '../../services/bioactive-map.service';
import { Fruta } from '../../../../shared/interfaces/Fruta.interface';
import { StateFilter, MapState, ProvincePoint } from '../../models/bioactive-map.interface';

export interface FruitDetailScore {
  label: string;
  value: number | null;
  score: number;
  showTooltip?: boolean;
}

import { fadeInRight400ms, scaleIn400ms, stagger40ms } from '../../../../shared/animations/page.animations';
import { CustomTitleService } from '../../../../shared/services/custom-title.service';

@Component({
  selector: 'app-bioactive-map',
  standalone: true,
  imports: [MatChipsModule, MatIconModule, MatDialogModule],
  templateUrl: './bioactive-map.component.html',
  styleUrl: './bioactive-map.component.css',
  animations: [fadeInRight400ms, scaleIn400ms, stagger40ms],
})
export class BioactiveMapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapHost', { static: true }) private readonly mapHost!: ElementRef<HTMLElement>;

  protected readonly filters: StateFilter[] = [
    { key: 'antes', label: 'Antes de digestión' },
    { key: 'despues', label: 'Después de digestión' },
  ];

  protected selectedState: MapState = 'antes';
  protected fruits: Fruta[] = [];
  protected selectedFruit: Fruta | null = null;
  protected selectedFruitScores: FruitDetailScore[] = [];

  private readonly mapService = inject(BioactiveMapService);
  private readonly http = inject(HttpClient);
  private readonly ngZone = inject(NgZone);
  private readonly customTitle = inject(CustomTitleService);
  private map?: L.Map;
  private tileLayer?: L.TileLayer;
  private markerLayer?: L.LayerGroup;
  private outlineLayer?: L.GeoJSON;
  private resizeObserver?: ResizeObserver;

  private readonly provincePoints: Record<string, ProvincePoint> = {
    Azuay: { lat: -2.9, lng: -79.0 },
    Bolívar: { lat: -1.58, lng: -79.0 },
    Cañar: { lat: -2.56, lng: -78.94 },
    Carchi: { lat: 0.6, lng: -77.8 },
    Chimborazo: { lat: -1.67, lng: -78.65 },
    Cotopaxi: { lat: -0.7, lng: -78.62 },
    'El Oro': { lat: -3.5, lng: -79.95 },
    Esmeraldas: { lat: 0.95, lng: -79.65 },
    Galápagos: { lat: -0.8, lng: -90.5 },
    Guayas: { lat: -2.2, lng: -79.9 },
    Imbabura: { lat: 0.35, lng: -78.1 },
    Loja: { lat: -3.99, lng: -79.2 },
    'Los Ríos': { lat: -1.4, lng: -79.45 },
    Manabí: { lat: -1.05, lng: -80.45 },
    'Morona Santiago': { lat: -2.3, lng: -77.8 },
    Napo: { lat: -1.0, lng: -77.8 },
    Orellana: { lat: -0.7, lng: -76.4 },
    Pastaza: { lat: -1.5, lng: -77.9 },
    Pichincha: { lat: 0, lng: -78.5 },
    'Santa Elena': { lat: -2.2, lng: -80.75 },
    'Santo Domingo de los Tsáchilas': { lat: -0.25, lng: -79.17 },
    Sucumbíos: { lat: 0.15, lng: -76.5 },
    Tungurahua: { lat: -1.25, lng: -78.6 },
    'Zamora Chinchipe': { lat: -4.1, lng: -78.95 },
  };

  ngAfterViewInit(): void {
    this.customTitle.set('Mapa Bioactivo');
    this.map = L.map(this.mapHost.nativeElement, {
      center: [-1.45, -78.55],
      zoom: 6,
      minZoom: 5,
      maxZoom: 11,
      maxBounds: L.latLngBounds([[-5.5, -81.5], [1.7, -75]]),
      maxBoundsViscosity: 1,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    this.tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);

    this.markerLayer = L.layerGroup().addTo(this.map);
    this.resizeObserver = new ResizeObserver(() => this.refreshMapLayout());
    this.resizeObserver.observe(this.mapHost.nativeElement);
    requestAnimationFrame(() => this.refreshMapLayout());
    window.setTimeout(() => {
      this.refreshMapLayout();
      if (this.map && this.outlineLayer) {
        this.map.fitBounds(this.outlineLayer.getBounds(), { padding: [22, 22] });
        this.refreshMapLayout();
      }
    }, 450);
    this.loadOutline();
    this.mapService.getFruits().subscribe((fruits) => {
      this.fruits = fruits;
      this.renderMarkers();
    });
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.map?.remove();
  }

  protected selectState(key: unknown): void {
    const filter = this.filters.find((item) => item.key === key);
    if (!filter) {
      return;
    }
    this.selectedState = filter.key;
    if (this.selectedFruit) {
      this.updateSelectedFruitScores();
    }
  }

  private loadOutline(): void {
    this.http.get<GeoJSON.GeoJsonObject>('/data/ecuador.geo.json').subscribe((geoJson) => {
      if (!this.map) {
        return;
      }
      this.outlineLayer = L.geoJSON(geoJson, {
        style: { color: '#50763b', weight: 1.5, fillColor: '#dfeaca', fillOpacity: 0.26 },
      }).addTo(this.map);
      this.map.fitBounds(this.outlineLayer.getBounds(), { padding: [22, 22] });
      requestAnimationFrame(() => this.refreshMapLayout());
    });
  }

  private renderMarkers(): void {
    if (!this.markerLayer) {
      return;
    }

    this.markerLayer.clearLayers();

    // Map to keep track of how many markers are in each province to offset them
    const provinceCounts: Record<string, number> = {};

    // Solo dibujar los marcadores de la fruta seleccionada para evitar ruido visual
    const fruitsToRender = this.selectedFruit ? [this.selectedFruit] : [];

    for (const fruit of fruitsToRender) {
      for (const province of fruit.provincias ?? []) {
        const point = this.provincePoints[province];
        if (!point) continue;

        provinceCounts[province] = (provinceCounts[province] || 0) + 1;
        const count = provinceCounts[province];

        // Add a small spiral offset to prevent markers from exactly overlapping
        const angle = count * 0.5 * Math.PI;
        const radius = count > 1 ? 0.15 + (count * 0.05) : 0;
        const offsetLat = Math.sin(angle) * radius;
        const offsetLng = Math.cos(angle) * radius;

        const marker = L.marker([point.lat + offsetLat, point.lng + offsetLng], {
          icon: this.createFruitIcon(fruit),
          title: `${fruit.nombreComun} · ${province}`,
        });

        marker.on('click', () => {
          this.ngZone.run(() => {
            this.selectedFruit = fruit;
            this.updateSelectedFruitScores();
            setTimeout(() => {
              document.querySelector('.detail-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          });
        });

        marker.bindTooltip(this.createTooltip(fruit, province), {
          direction: 'top',
          offset: [0, -18],
          opacity: 0.96,
          className: 'bioactive-tooltip',
        });
        marker.addTo(this.markerLayer);
      }
    }
  }

  private createFruitIcon(fruit: Fruta): L.DivIcon {
    const image = fruit.imagen || '/images/fruit-hero.png';
    return L.divIcon({
      className: 'bioactive-fruit-marker',
      html: `<img src="${image}" alt="" aria-hidden="true">`,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -18],
    });
  }

  private createTooltip(fruit: Fruta, province: string): string {
    return `<div class="bioactive-tooltip-content" style="display: flex; flex-direction: column;">
      <strong>${fruit.nombreComun}</strong>
      <span style="font-size: 0.75rem; color: #58634d; font-weight: normal;">${province}</span>
    </div>`;
  }

  private refreshMapLayout(): void {
    if (!this.map) return;
    this.map.invalidateSize({ pan: false, debounceMoveend: true });
    this.tileLayer?.redraw();
  }

  // Value Extractors
  private extractAntioxidant(fruit: Fruta): number | null {
    return this.selectedState === 'antes' ? this.numberOrNull(fruit.promedioCapAntInfusion) : this.numberOrNull(fruit.promedioCapAntDigerido);
  }

  private extractCarotenoids(fruit: Fruta): number | null {
    return this.selectedState === 'antes' ? null : this.numberOrNull(fruit.promedioBioaccCarotenoides);
  }

  private extractFlavonoids(fruit: Fruta): number | null {
    return this.selectedState === 'antes' ? null : this.numberOrNull(fruit.promedioBioaccFlavonoides);
  }

  private extractAscorbic(fruit: Fruta): number | null {
    return this.selectedState === 'antes' ? null : this.numberOrNull(fruit.promedioBioaccAcAsc);
  }

  // Helpers
  private numberOrNull(value: number | null | undefined): number | null {
    if (value === null || value === undefined) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private average(...values: Array<number | null | undefined>): number | null {
    const available = values.map(v => this.numberOrNull(v)).filter((v): v is number => v !== null);
    return available.length ? available.reduce((sum, v) => sum + v, 0) / available.length : null;
  }

  private calculateScore(value: number | null, extractor: (f: Fruta) => number | null): number {
    if (value === null) return -1;
    const allValues = this.fruits.map(f => extractor.call(this, f)).filter(v => v !== null) as number[];
    if (allValues.length === 0) return 0;
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    if (min === max) return 100;
    return ((value - min) / (max - min)) * 100;
  }

  // Custom tooltip toggle
  protected toggleTooltip(item: FruitDetailScore): void {
    // Esconder otros tooltips primero
    this.selectedFruitScores.forEach(s => {
      if (s !== item) s.showTooltip = false;
    });
    item.showTooltip = !item.showTooltip;
  }

  // Handle list selection and map centering
  protected selectFruitFromList(fruit: Fruta): void {
    this.selectedFruit = fruit;
    this.updateSelectedFruitScores();
    this.renderMarkers();

    // Encontrar el marcador correspondiente en el mapa y centrar
    // Para simplificar, buscamos los puntos de las provincias de esta fruta
    if (fruit.provincias && fruit.provincias.length > 0) {
      const bounds = L.latLngBounds([]);
      for (const province of fruit.provincias) {
        const point = this.provincePoints[province];
        if (point) {
          bounds.extend([point.lat, point.lng]);
        }
      }

      if (bounds.isValid() && this.map) {
        // Centrar con un poco de padding
        this.map.flyToBounds(bounds, { maxZoom: 8, padding: [50, 50], duration: 1.5 });
      }
    }
  }

  private readonly dialog = inject(MatDialog);

  protected openHelpModal(): void {
    this.dialog.open(BioactiveMapInfoModalComponent, {
      width: '90%',
      maxWidth: '600px',
      autoFocus: false,
    });
  }

  private updateSelectedFruitScores(): void {
    if (!this.selectedFruit) return;

    this.selectedFruitScores = [
      {
        label: 'Capacidad Antioxidante',
        value: this.extractAntioxidant(this.selectedFruit),
        score: this.calculateScore(this.extractAntioxidant(this.selectedFruit), this.extractAntioxidant)
      },
      {
        label: 'Carotenoides',
        value: this.extractCarotenoids(this.selectedFruit),
        score: this.calculateScore(this.extractCarotenoids(this.selectedFruit), this.extractCarotenoids)
      },
      {
        label: 'Flavonoides',
        value: this.extractFlavonoids(this.selectedFruit),
        score: this.calculateScore(this.extractFlavonoids(this.selectedFruit), this.extractFlavonoids)
      },
      {
        label: 'Ácido ascórbico',
        value: this.extractAscorbic(this.selectedFruit),
        score: this.calculateScore(this.extractAscorbic(this.selectedFruit), this.extractAscorbic)
      }
    ];
  }
}

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-bioactive-map-info-modal',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title style="color: #26351f; font-weight: 900; display: flex; align-items: center; gap: 0.5rem; padding: 2rem 2rem 1rem 2rem; margin: 0;">
      <mat-icon fontSet="material-symbols-outlined" style="color: #3f6528;">info</mat-icon>
      ¿Cómo interpretar los resultados?
    </h2>
    <mat-dialog-content style="padding: 0 2rem 2rem 2rem;">
      <p style="color: #58634d; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
        Recuerda que estos valores pueden variar, así que existen algunas interpretaciones, pero puedes manejarlos simplemente como <strong>Bajo</strong>, <strong>Medio</strong> y <strong>Alto</strong> según su posición en el semáforo para no perderte.
      </p>

      <div style="display: grid; gap: 1rem;">
        <div style="background: #f8fbf4; padding: 1.2rem; border-radius: 0.8rem; border-left: 4px solid #3f6528;">
          <strong style="color: #26351f; display: block; margin-bottom: 0.3rem;">Capacidad Antioxidante</strong>
          <span style="color: #58634d; font-size: 0.9rem;">Indica el poder general de la fruta para combatir el daño celular. Un valor alto sugiere que ayuda a prevenir el envejecimiento prematuro de nuestras células.</span>
        </div>
        
        <div style="background: #f8fbf4; padding: 1.2rem; border-radius: 0.8rem; border-left: 4px solid #e91e63;">
          <strong style="color: #26351f; display: block; margin-bottom: 0.3rem;">Carotenoides</strong>
          <span style="color: #58634d; font-size: 0.9rem;">Benefician principalmente la salud de los ojos y el sistema inmunológico. Entre más a la derecha esté la bolita, más rico es este nutriente (asociado a colores naranjas/rojos).</span>
        </div>
        
        <div style="background: #f8fbf4; padding: 1.2rem; border-radius: 0.8rem; border-left: 4px solid #673ab7;">
          <strong style="color: #26351f; display: block; margin-bottom: 0.3rem;">Flavonoides</strong>
          <span style="color: #58634d; font-size: 0.9rem;">Están relacionados con la salud del corazón y la mejora de la circulación. Un valor medio o alto en verde indica un perfil muy cardiosaludable.</span>
        </div>
        
        <div style="background: #f8fbf4; padding: 1.2rem; border-radius: 0.8rem; border-left: 4px solid #ff9800;">
          <strong style="color: #26351f; display: block; margin-bottom: 0.3rem;">Ácido ascórbico (Vitamina C)</strong>
          <span style="color: #58634d; font-size: 0.9rem;">Fundamental para nuestras defensas y la absorción de hierro. Un nivel en verde significa que es una fuente destacada de esta vitamina esencial.</span>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end" style="padding: 1rem 2rem 2rem 2rem;">
      <button mat-flat-button mat-dialog-close style="background: #3f6528; color: #fff; border-radius: 99px; padding: 0 1.5rem; height: 42px;">Entendido</button>
    </mat-dialog-actions>
  `
})
export class BioactiveMapInfoModalComponent { }


