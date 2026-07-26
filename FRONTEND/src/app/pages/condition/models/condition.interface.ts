import { Fruta } from '../../fruit/models/Fruta.interface';

export interface ConditionItem {
  condicionId: number;
  nombre: string;
  descripcion: string;
}

export type ConditionFruit = Fruta;
