import { Fruta } from '../../../../shared/interfaces/Fruta.interface';

export type FruitMetricKey = keyof Fruta;

export interface MetricItem {
  label: string;
  key: FruitMetricKey;
  suffix?: string;
}

export interface ProfileSection {
  key: string;
  label: string;
  shortLabel: string;
  icon: string;
  description: string;
  metrics: MetricItem[];
  note?: string;
}
