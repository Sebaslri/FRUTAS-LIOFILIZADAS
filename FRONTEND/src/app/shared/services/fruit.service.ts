import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Fruta } from '../interfaces/Fruta.interface';
import { map, Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';
import { endpoint } from '../apis/endpoints';
import { BaseResponse } from '../interfaces/BaseResponse.intrerface';

@Injectable({
  providedIn: 'root',
})
export class FruitService {

  private readonly _http = inject(HttpClient);


  getAll(): Observable<Fruta[]> {
    const requestUrl = `${env.api}${endpoint.LIST_FRUITS}`;

    return this._http.get<BaseResponse>(requestUrl).pipe(
      map((resp: BaseResponse): Fruta[] => {
        if (resp.isSuccess) {
          return resp.data as Fruta[];
        }

        return [];
      })
    );

  }

  fruitById(fruitId: number): Observable<Fruta> {
    const requestUrl = `${env.api}${endpoint.FRUIT_BY_ID}${fruitId}`;

    return this._http.get<BaseResponse>(requestUrl).pipe(
      map((resp: BaseResponse) => {
        if (!resp.isSuccess) {
          throw new Error(resp.message ?? 'No se pudo obtener la fruta.');
        }

        return resp.data as Fruta;
      }),
    );
  }
}
