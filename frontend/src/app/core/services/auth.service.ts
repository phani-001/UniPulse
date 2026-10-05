import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, ApiResponse, AuthResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'up_token';
  private readonly USER_KEY = 'up_user';

  // Signals for reactive state
  private _user = signal<User | null>(this.loadUser());
  private _token = signal<string | null>(this.loadToken());

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());
  readonly token = this._token.asReadonly();

  constructor(private http: HttpClient, private router: Router) {}

  login(registrationNumber: string, password: string): Observable<AuthResponse> {
    return this.http.post<{ success: boolean; data: AuthResponse }>(
      `${environment.apiUrl}/auth/login`,
      { registrationNumber, password }
    ).pipe(
      map(res => res.data),
      tap(data => {
        this.setSession(data.token, data.user);
      })
    );
  }

  register(userData: {
    registrationNumber: string;
    name: string;
    email?: string;
    password: string;
    branch?: string;
    year?: number;
  }): Observable<AuthResponse> {
    return this.http.post<{ success: boolean; data: AuthResponse }>(
      `${environment.apiUrl}/auth/register`,
      userData
    ).pipe(
      map(res => res.data),
      tap(data => {
        this.setSession(data.token, data.user);
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/change-password`, {
      currentPassword,
      newPassword
    }).pipe(
      tap(res => {
        if (res.data?.token) {
          const user = this._user();
          if (user) {
            const updatedUser = { ...user, isFirstLogin: false };
            this.setSession(res.data.token, updatedUser);
          }
        }
      })
    );
  }

  refreshUser(): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${environment.apiUrl}/auth/me`)
      .pipe(
        map(res => res.data),
        tap(user => {
          this._user.set(user);
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._user.set(null);
    this._token.set(null);
    this.router.navigate(['/auth/login']);
  }

  private setSession(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this._token.set(token);
    this._user.set(user);
  }

  private loadToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem(this.USER_KEY);
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  }
}
