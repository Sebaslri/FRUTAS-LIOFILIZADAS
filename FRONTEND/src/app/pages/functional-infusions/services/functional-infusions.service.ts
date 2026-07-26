import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { MixService } from '../../../shared/services/mix.service';
import { FruitComparisonService } from '../../fruit-comparison/services/fruit-comparison.service';
import { Fruta } from '../../fruit/models/Fruta.interface';
import { FunctionalInfusionSource } from '../models/functional-infusions.model';

@Injectable({
  providedIn: 'root'
})
export class FunctionalInfusionsService {
  private readonly mixService = inject(MixService);
  private readonly fruitService = inject(FruitComparisonService);

  getSources(): Observable<{ fruits: Fruta[], mixes: FunctionalInfusionSource[] }> {
    return forkJoin({
      fruits: this.fruitService.getFruits(),
      mixes: this.mixService.getAll()
    }).pipe(
      map(({ fruits, mixes }) => {
        const enhancedMixes = mixes.map(mix => {
          const fruitImages = mix.frutaIds.map(id => {
            const fruit = fruits.find(f => f.frutaId === id);
            return fruit?.imagen || '/images/fruit-hero.png';
          });
          return { ...mix, fruitImages };
        });
        
        return { fruits, mixes: enhancedMixes };
      })
    );
  }
}
