import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsumerEducationService } from '../../services/consumer-education.service';
import { EducationCapsule } from '../../models/education-capsule.interface';
import { CustomTitleService } from '../../../../shared/services/custom-title.service';
import { MaterialModule } from '../../../../shared/material.module';
import { fadeInRight400ms, scaleIn400ms, stagger40ms } from '../../../../shared/animations/page.animations';
@Component({
  selector: 'app-consumer-education',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './consumer-education.component.html',
  styleUrls: ['./consumer-education.component.css'],
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms]
})
export class ConsumerEducationComponent implements OnInit {
  protected readonly icon = 'school';
  private readonly educationService = inject(ConsumerEducationService);
  private readonly customTitle = inject(CustomTitleService);

  constructor() {
    setTimeout(() => this.customTitle.set('Educación al Consumidor'));
  }

  capsules: EducationCapsule[] = [];
  activeCapsuleId: string | null = null;

  ngOnInit(): void {
    this.capsules = this.educationService.getCapsules();
  }

  toggleCapsule(id: string) {
    if (this.activeCapsuleId === id) {
      this.activeCapsuleId = null;
    } else {
      this.activeCapsuleId = id;
    }
  }


}
