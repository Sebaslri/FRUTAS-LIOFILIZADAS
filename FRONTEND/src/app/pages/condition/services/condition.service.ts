import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { endpoint } from '../../../shared/apis/endpoints';
import { BaseResponse } from '../../../shared/interfaces/BaseResponse.intrerface';
import { ConditionItem } from '../models/condition.interface';
import { Fruta } from '../../fruit/models/Fruta.interface';

@Injectable({ providedIn: 'root' })
export class ConditionService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<ConditionItem[]> {
    return this.http.get<BaseResponse>(`${env.api}${endpoint.LIST_CONDITIONS}`).pipe(
      map((response) => (response.isSuccess ? (response.data as ConditionItem[]) : [])),
    );
  }

  getFruitsByCondition(conditionId: number): Observable<Fruta[]> {
    return this.http.get<BaseResponse>(`${env.api}${endpoint.FRUITS_BY_CONDITION}${conditionId}`).pipe(
      map((response) => (response.isSuccess ? (response.data as Fruta[]) : [])),
    );
  }
}
