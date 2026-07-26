import { Fruta } from '../../../fruit/models/Fruta.interface';
import { Mix } from '../../../../shared/interfaces/mix.interface';

export type PreparationSource = Fruta | (Mix & { fruitImages?: string[] });

export interface PreparationMetric {
  key: 'cap_ant_infusion' | 'cap_ant_digerido' | 'bioacc_carotenoides' | 'bioacc_flavonoides' | 'bioacc_acAsc';
  label: string;
  description: string;
}

export interface PreparationResult extends PreparationMetric {
  value: number | null;
  percentage: number;
}
