import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { fadeInRight400ms, scaleIn400ms, stagger40ms } from '../../shared/animations/page.animations';
import { ConditionService } from './services/condition.service';
import { ConditionItem } from './models/condition.interface';
import { CustomTitleService } from '../../shared/services/custom-title.service';

@Component({
  selector: 'app-condition',
  standalone: true,
  imports: [MaterialModule, RouterLink],
  templateUrl: './condition.component.html',
  styleUrl: './condition.component.css',
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms],
})
export class Condition implements OnInit {
  private readonly conditionService = inject(ConditionService);
  private readonly customTitle = inject(CustomTitleService);

  constructor() {
    setTimeout(() => this.customTitle.set('Condiciones de Salud'));
  }

  protected readonly icon = 'medical_information';
  protected conditions: ConditionItem[] = [];
  protected loading = true;

  protected readonly educationalGoals = [
    { title: 'Más antioxidante', text: 'Explora frutas con perfiles ricos en compuestos bioactivos.' },
    { title: 'Más ácida', text: 'Encuentra opciones de sabor intenso y refrescante.' },
    { title: 'Más suave', text: 'Prioriza perfiles delicados para una infusión ligera.' },
    { title: 'Más frutal', text: 'Busca aromas tropicales y notas marcadas de fruta.' },
    { title: 'Mayor bioaccesibilidad', text: 'Compara opciones para estudiar compuestos disponibles tras la digestión in vitro.' },
    { title: 'Mejor aceptación sensorial', text: 'Orienta la exploración hacia perfiles agradables y equilibrados.' },
  ];

  ngOnInit(): void {
    this.conditionService.getAll().subscribe({
      next: (conditions) => { this.conditions = conditions; },
      error: () => { this.conditions = []; this.loading = false; },
      complete: () => { this.loading = false; },
    });
  }


}
