import { Mix } from '../../../shared/interfaces/mix.interface';
import { Fruta } from '../../../shared/interfaces/Fruta.interface';

export type FunctionalInfusionSource = Fruta | (Mix & { fruitImages?: string[] });

export interface Table1Row {
  key: string;
  label: string;
  unit: string;
  ff: number | null;
  fl: number | null;
}

export interface Table2Row {
  key: string;
  label: string;
  unit: string;
  antes: number | null;
  despues: number | null;
  retencion: number | null;
}
