import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';
import { endpoint } from '../apis/endpoints';
import { BaseResponse } from '../interfaces/BaseResponse.intrerface';
import { Mix } from '../interfaces/mix.interface';

@Injectable({ providedIn: 'root' })
export class MixService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Mix[]> {
    return this.http.get<BaseResponse>(`${env.api}${endpoint.LIST_MIXES}`).pipe(
      map((response) => (response.isSuccess ? (response.data as Mix[]) : [])),
    );
  }
}
