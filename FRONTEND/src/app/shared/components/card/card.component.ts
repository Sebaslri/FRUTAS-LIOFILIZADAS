import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Fruta } from '../../../pages/fruit/models/Fruta.interface';
import { FRUIT_COLORS } from '../../functions/variables.interface';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input({ required: true }) fruit!: Fruta;
  @Output() detailsRequested = new EventEmitter<Fruta>();

  protected requestDetails(): void {
    this.detailsRequested.emit(this.fruit);    
  }

  protected get accentColor(): string {
    return FRUIT_COLORS[this.fruit.nombreComun] ?? '#77a642';
  }
}
