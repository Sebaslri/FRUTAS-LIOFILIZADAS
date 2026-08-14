import { Fruta } from '../../../shared/interfaces/Fruta.interface';

export interface ComparisonSlot {
  label: string;
  fruit: Fruta | null;
  isMix?: boolean;
  fruitImages?: string[];
}

export interface ComparisonPropertyConfig {
  key: keyof Fruta;
  label: string;
  group: string;
  unit?: string;
}

export interface ComparisonTableRow extends ComparisonPropertyConfig {
  firstValue: number | null;
  secondValue: number | null;
  firstPercentage: number | null;
  secondPercentage: number | null;
}

export interface FruitComparisonDialogData {
  firstFruit: Fruta;
  secondFruit: Fruta;
  rows: ComparisonTableRow[];
}
