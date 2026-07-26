import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { endpoint } from '../../../shared/apis/endpoints';
import { BaseResponse } from '../../../shared/interfaces/BaseResponse.intrerface';
import { Fruta } from '../../fruit/models/Fruta.interface';

@Injectable({ providedIn: 'root' })
export class FruitComparisonService {
  private readonly http = inject(HttpClient);

  getFruits(): Observable<Fruta[]> {
    return this.http.get<BaseResponse>(`${env.api}${endpoint.BIOACTIVE_MAP}`).pipe(
      map((response) => (response.isSuccess ? (response.data as Fruta[]) : [])),
    );
  }
}
