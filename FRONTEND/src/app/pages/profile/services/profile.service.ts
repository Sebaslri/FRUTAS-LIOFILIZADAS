import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { endpoint } from '../../../shared/apis/endpoints';
import { UserProfile } from '../models/profile.model';
import { AuthService } from '../../auth-pages/services/auth.service';

export interface ProfileResponse {
  success: boolean;
  data: UserProfile;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.api}${endpoint.PROFILE}`;

  private readonly authService = inject(AuthService);

  getProfile(): Observable<ProfileResponse> {
    const user: any = this.authService.getCurrentUser();
    const userId = user ? (user.usuarioId || user.id) : '';
    return this.http.get<ProfileResponse>(`${this.apiUrl}?accion=obtener&usuarioId=${userId}`, { withCredentials: true });
  }

  updateProfile(profileData: Partial<UserProfile> | FormData): Observable<ProfileResponse> {
    const user: any = this.authService.getCurrentUser();
    const userId = user ? (user.usuarioId || user.id) : '';
    return this.http.post<ProfileResponse>(`${this.apiUrl}?accion=actualizar&usuarioId=${userId}`, profileData, { withCredentials: true });
  }
}
