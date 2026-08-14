export type MapState = 'antes' | 'despues';

export interface StateFilter {
  key: MapState;
  label: string;
}

export interface ProvincePoint {
  lat: number;
  lng: number;
}
