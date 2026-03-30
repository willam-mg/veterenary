import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, finalize, map, Observable, of, tap } from 'rxjs';

import { apiConfig } from '../config/api.config';
import { ApiEnvelope, AuthPayload, User } from '../../models/types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenKey = 'vet-demo-token';

  readonly currentUser = signal<User | null>(null);
  readonly bootstrapped = signal(false);

  bootstrap(): void {
    const token = this.getToken();

    if (!token) {
      this.bootstrapped.set(true);
      return;
    }

    this.http
      .get<ApiEnvelope<User>>(`${apiConfig.baseUrl}/auth/me`)
      .pipe(
        tap((response) => this.currentUser.set(response.data)),
        catchError(() => {
          this.clearSession();
          return of(null);
        }),
        finalize(() => this.bootstrapped.set(true)),
      )
      .subscribe();
  }

  login(payload: { email: string; password: string }): Observable<User> {
    return this.http
      .post<ApiEnvelope<AuthPayload>>(`${apiConfig.baseUrl}/auth/login`, payload)
      .pipe(map((response) => this.applySession(response.data)));
  }

  register(payload: {
    name: string;
    email: string;
    phone: string;
    role: string;
    password: string;
    password_confirmation: string;
  }): Observable<User> {
    return this.http
      .post<ApiEnvelope<AuthPayload>>(`${apiConfig.baseUrl}/auth/register`, payload)
      .pipe(map((response) => this.applySession(response.data)));
  }

  logout(): void {
    this.http
      .post<ApiEnvelope<null>>(`${apiConfig.baseUrl}/auth/logout`, {})
      .pipe(
        catchError(() => of(null)),
        finalize(() => {
          this.clearSession();
          void this.router.navigate(['/login']);
        }),
      )
      .subscribe();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private applySession(payload: AuthPayload): User {
    localStorage.setItem(this.tokenKey, payload.token);
    this.currentUser.set(payload.user);

    return payload.user;
  }

  private clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUser.set(null);
  }
}
