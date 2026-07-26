import { Fruta } from '../../../fruit/models/Fruta.interface';

export type SensoryMetricKey =
  | 'sweetness'
  | 'acidity'
  | 'fruitiness'
  | 'color'
  | 'intensity'
  | 'acceptance';

export interface SensoryMetricConfig {
  key: SensoryMetricKey;
  label: string;
  shortLabel: string;
  explanation: string;
  color: string;
}

export interface SensoryMetric extends SensoryMetricConfig {
  value: number | null;
}

export interface SensoryProfileSelection {
  fruit: Fruta;
  metrics: SensoryMetric[];
  average: number | null;
}
