import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { ConditionFruitDetailModalComponent } from '../condition-fruit-detail-modal/condition-fruit-detail-modal.component';
import { ConditionService } from '../../services/condition.service';
import { ConditionItem } from '../../models/condition.interface';
import { Fruta } from '../../../fruit/models/Fruta.interface';
import { EducationalGoal } from './configuration.interface';
import { ConditionMixCard } from './configuration.interface';
import { MixService } from '../../../../shared/services/mix.service';
import { Mix } from '../../../../shared/interfaces/mix.interface';
import { FruitService } from '../../../fruit/service/fruit.service';
import { fadeInRight400ms, scaleIn400ms, stagger40ms } from '../../../../shared/animations/page.animations';

@Component({
  selector: 'app-condition-results',
  standalone: true,
  imports: [CardComponent, RouterLink],
  animations: [fadeInRight400ms, scaleIn400ms, stagger40ms],
  templateUrl: './condition-results.component.html',
  styleUrl: './condition-results.component.css',
})
export class ConditionResultsComponent implements OnInit {
  protected condition: ConditionItem | undefined;
  protected fruits: Fruta[] = [];
  protected selectedGoal = 'all';
  protected mixes: ConditionMixCard[] = [];
  protected loading = true;
  private loadedMixes: Mix[] = [];
  private allFruits: Fruta[] = [];

  protected readonly goals: EducationalGoal[] = [
    {
      key: 'sabor',
      label: 'Mayor Dulzor',
      description: 'Perfil aromático y tropical, con notas de fruta más marcadas.',
      metric: 'fruitiness',
    },
    {
      key: 'bioaccesibilidad',
      label: 'Mayor aprovechamiento después de la digestión',
      description: 'Perfil orientado a compuestos que pueden quedar disponibles después de la digestión in vitro.',
      metric: 'bioaccessibility',
    },
    {
      key: 'sensorial',
      label: 'Mejor aceptación sensorial',
      description: 'Perfil equilibrado, pensado para explorar una experiencia agradable al paladar.',
      metric: 'sensory',
    },
  ];

  private readonly route = inject(ActivatedRoute);
  private readonly conditionService = inject(ConditionService);
  private readonly dialog = inject(MatDialog);
  private readonly mixService = inject(MixService);
  private readonly fruitService = inject(FruitService);

  ngOnInit(): void {
    const conditionId = Number(this.route.snapshot.paramMap.get('id'));

    let completed = 0;
    const finish = () => {
      completed += 1;
      if (completed === 4) {
        this.loading = false;
        this.mixes = this.mixCardsFor(this.loadedMixes);
      }
    };

    this.conditionService.getAll().subscribe({
      next: (conditions) => { this.condition = conditions.find((item) => item.condicionId === conditionId); },
      error: () => finish(),
      complete: finish,
    });

    this.conditionService.getFruitsByCondition(conditionId).subscribe({
      next: (fruits) => {
        this.fruits = fruits;
      },
      error: () => finish(),
      complete: finish,
    });

    this.mixService.getAll().subscribe({
      next: (mixes) => {
        this.loadedMixes = mixes;
      },
      error: () => finish(),
      complete: finish,
    });

    this.fruitService.getAll().subscribe({
      next: (fruits) => {
        this.allFruits = fruits;
      },
      error: () => finish(),
      complete: finish,
    });
  }

  private mixCardsFor(mixes: Mix[]): ConditionMixCard[] {
    const selectedIds = new Set(this.fruits.map((fruit) => fruit.frutaId));
    return mixes
      .filter((mix) => mix.frutaIds.some((id) => selectedIds.has(id)))
      .map((mix) => {
        const fruitImages = mix.frutaIds.map((id) => {
          const fruit = this.allFruits.find((f) => f.frutaId === id);
          return fruit?.imagen || '/images/fruit-hero.png';
        });

        return {
          mixId: mix.mixId,
          nombre: mix.nombre,
          frutas: mix.frutas,
          imagen: mix.imagen,
          frutaIds: mix.frutaIds,
          availableValues: [mix.gradosBrix, mix.acidez, mix.cap_ant_infusion, mix.cap_ant_digerido]
            .filter((value) => value !== null && value !== undefined).length,
          dataSummary: this.mixDataSummary(mix),
          originalMix: mix,
          fruitImages: fruitImages,
        };
      });
  }

  private mixDataSummary(mix: Mix): string {
    const values = [
      mix.gradosBrix !== null && mix.gradosBrix !== undefined ? `°Brix ${this.formatNumber(mix.gradosBrix)}` : null,
      mix.acidez !== null && mix.acidez !== undefined ? `Acidez ${this.formatNumber(mix.acidez)}` : null,
      mix.cap_ant_infusion !== null && mix.cap_ant_infusion !== undefined ? `Infusión ${this.formatNumber(mix.cap_ant_infusion)}` : null,
    ].filter((value): value is string => value !== null);
    return values.length ? values.join(' · ') : 'Datos del estudio en proceso de ampliación';
  }

  private formatNumber(value: number): string {
    return new Intl.NumberFormat('es-EC', { maximumFractionDigits: 2 }).format(Number(value));
  }

  protected get selectedGoalDetails(): EducationalGoal | undefined {
    return this.goals.find((goal) => goal.key === this.selectedGoal);
  }

  protected get visibleFruits(): Fruta[] {
    if (this.selectedGoal === 'all') {
      return this.fruits;
    }

    const goal = this.selectedGoalDetails;
    if (!goal) {
      return this.fruits;
    }

    return [...this.fruits].sort((first, second) => this.scoreFor(second, goal) - this.scoreFor(first, goal));
  }

  protected selectGoal(key: string): void {
    this.selectedGoal = this.selectedGoal === key ? 'all' : key;
  }

  private scoreFor(fruit: Fruta, goal: EducationalGoal): number {
    switch (goal.metric) {
      case 'antioxidant':
        return this.normalizedValue(fruit, 'promedioCapAntInfusion');
      case 'acidity':
        return this.normalizedValue(fruit, 'promedioAcidez');
      case 'softness':
        return 1 - this.normalizedValue(fruit, 'promedioFirmeza');
      case 'fruitiness':
        return this.normalizedValue(fruit, 'promedioGradosBrix');
      case 'bioaccessibility':
        return this.averageAvailable(
          this.normalizedValue(fruit, 'promedioBioaccCarotenoides'),
          this.normalizedValue(fruit, 'promedioBioaccFlavonoides'),
          this.normalizedValue(fruit, 'promedioBioaccAcAsc'),
        );
      case 'sensory':
        return this.normalizedValue(fruit, 'promedioIndiceMadurez');
    }
  }

  private normalizedValue(fruit: Fruta, metric: keyof Fruta): number {
    const valueOf = (item: Fruta): number => Number(item[metric] ?? 0);
    const values = this.fruits.map(valueOf).filter((value) => Number.isFinite(value) && value > 0);
    const value = valueOf(fruit);

    if (!values.length || !Number.isFinite(value) || value <= 0) {
      return 0;
    }

    const minimum = Math.min(...values);
    const maximum = Math.max(...values);

    return minimum === maximum ? 0.5 : (value - minimum) / (maximum - minimum);
  }

  private averageAvailable(...values: number[]): number {
    const available = values.filter((value) => Number.isFinite(value) && value > 0);
    return available.length ? available.reduce((sum, value) => sum + value, 0) / available.length : 0;
  }

  protected openFruitDetails(fruit: Fruta, isMix = false, fruitImages: string[] = []): void {
    this.dialog.open(ConditionFruitDetailModalComponent, {
      data: { fruit, isMix, fruitImages, selectedGoal: this.selectedGoalDetails },
      disableClose: true,
      autoFocus: false,
      panelClass: 'fruit-detail-dialog',
      backdropClass: 'fruit-detail-backdrop',
      width: 'min(940px, calc(100vw - 2rem))',
      maxWidth: '940px',
      maxHeight: '92vh',
    });
  }

  protected openMixDetails(mixCard: ConditionMixCard): void {
    const mix = mixCard.originalMix;
    const fruitMix: Fruta = {
      frutaId: mix.mixId,
      nombreComun: mix.frutas,
      nombreCientifico: 'Mix experimental',
      descripcion: 'Mezcla experimental de frutas.',
      imagen: mix.imagen,
      region: '',
      provincias: [],
      promedioAcidez: mix.acidez,
      promedioGradosBrix: mix.gradosBrix,
      promedioIndiceMadurez: mix.indiceMadurez,
      promedioCapAntInfusion: mix.cap_ant_infusion,
      promedioCapAntDigerido: mix.cap_ant_digerido,
      promedioBioaccCarotenoides: mix.bioacc_carotenoides,
      promedioBioaccFlavonoides: mix.bioacc_flavonoides,
      promedioBioaccAcAsc: mix.bioacc_acAsc,
      promedioAntocianinasFF: mix.antocianinas_FF,
      promedioAntocianinasFL: mix.antocianinas_FL,
      promedioFenolesFF: mix.fenolesTotales_FF,
      promedioFenolesFL: mix.fenolesTotales_FL,
      promedioPh: mix.pH,
      promedioColorL: mix.L,
      promedioColorA: mix.a,
      promedioColorB: mix.b,
      promedioHumedad: mix.humedad,
      promedioCenizas: mix.cenizas,
      promedioDpphFF: mix.dpph_FF,
      promedioDpphFL: mix.dpph_FL,
      promedioFrapFF: mix.frap_FF,
      promedioFrapFL: mix.frap_FL,
      promedioFlavonoidesFF: mix.flavonoides_FF,
      promedioFlavonoidesFL: mix.flavonoides_FL,
      promedioFirmeza: mix.firmeza
    };

    this.openFruitDetails(fruitMix, true, mixCard.fruitImages);
  }
}
