export interface EducationalGoal {
  key: string;
  label: string;
  description: string;
  metric: 'antioxidant' | 'acidity' | 'softness' | 'fruitiness' | 'bioaccessibility' | 'sensory' | 'dulzor' | 'acidez' | 'aroma' | 'aceptacion' | 'color' | 'intensidad';
}

import { Mix } from '../../../../shared/interfaces/mix.interface';

export interface ConditionMixCard {
  mixId: number;
  nombre: string;
  frutas: string;
  imagen: string | null;
  frutaIds: number[];
  availableValues: number;
  dataSummary: string;
  originalMix: Mix;
  fruitImages: string[];
}
