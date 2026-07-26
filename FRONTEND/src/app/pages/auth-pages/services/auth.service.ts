import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { endpoint, httpOptions } from '../../../shared/apis/endpoints';
import { Login } from '../models/login.interface';
import { AuthResponse, Register } from '../models/register.interface';
import { AlertService } from '../../../shared/services/alert.service';

const SESSION_KEY = 'frutasapp.user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private _alert = inject(AlertService);
  private currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  private getUserFromStorage() {
    const user = localStorage.getItem(SESSION_KEY);
    return user ? JSON.parse(user) : null;
  }

  updateCurrentUser(user: any) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  login(payload: Login): Observable<AuthResponse> {
    const requestURL = `${env.api}${endpoint.LOGIN}`
    return this.http.post<AuthResponse>(requestURL, payload, httpOptions).pipe(
      tap((response) => {
        if (response.success && response.user) {
          this.updateCurrentUser(response.user);
        }
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(`${env.api}${endpoint.REGISTER}`, data).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.updateCurrentUser(response.data);
        }
      })
    );
  }

  logout(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${env.api}${endpoint.LOGOUT}`, {}, httpOptions).pipe(
      tap(() => this.clearSession())
    );
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(SESSION_KEY) !== null;
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
    this.currentUserSubject.next(null);
  }
}
