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
    { title: 'Mayor Dulzor', text: 'Prioriza frutas con un alto nivel de dulzor en su perfil sensorial.' },
    { title: 'Mayor Acidez', text: 'Prioriza frutas con un perfil sensorial más ácido y refrescante.' },
    { title: 'Mayor Aroma Frutal', text: 'Prioriza frutas con notas aromáticas muy marcadas.' },
    { title: 'Mejor Aceptación Global', text: 'Perfil equilibrado y de alta aceptación sensorial general.' },
    { title: 'Mayor Color', text: 'Prioriza frutas con un color más llamativo y atractivo.' },
    { title: 'Mayor Intensidad', text: 'Prioriza frutas con un sabor más intenso.' }
  ];

  ngOnInit(): void {
    this.conditionService.getAll().subscribe({
      next: (conditions) => { this.conditions = conditions; },
      error: () => { this.conditions = []; this.loading = false; },
      complete: () => { this.loading = false; },
    });
  }


}
