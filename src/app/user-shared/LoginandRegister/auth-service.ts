import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';

import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest, User } from './model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = 'https://localhost:7004'; // Update with your actual port

  // Signal to store user state - global across the whole app
  user = signal<User | undefined>(undefined);

  user$ = new BehaviorSubject<string | undefined>(undefined);

  constructor() {
    this.getUserFromStorage();
  }
  // Save token and update the user stream
  setUser(token: string): void {
    localStorage.setItem('auth-token', token);
    this.getUserFromStorage();
  }

  userRoles$ = new BehaviorSubject<string[]>([]);

getUserFromStorage(): void {
  const token = localStorage.getItem('auth-token');
  
  if (token) {
    try {
      const decodedToken: any = jwtDecode(token);
      
      // 1. Extract Name (using the long schema key found in your console)
      const name = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 
                   decodedToken.unique_name || 
                   decodedToken.email;

      this.user$.next(name);

      // 2. Extract Roles (using the role schema key found in your console)
      // Note: .NET can send a single string or an array if there are multiple roles
      let roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      
      if (roles) {
        // If it's a string, wrap it in an array; if it's already an array, keep it
        const rolesArray = Array.isArray(roles) ? roles : [roles];
        this.userRoles$.next(rolesArray);
      } else {
        this.userRoles$.next([]);
      }

      console.log('User identified:', name, 'with roles:', roles);

    } catch (err) {
      console.error("Token decoding failed:", err);
      this.clearUserState();
    }
  } else {
    this.clearUserState();
  }
}

// Helper to reset everything on logout or error
private clearUserState(): void {
  this.user$.next(undefined);
  this.userRoles$.next([]);
}



  logout(): void {
    localStorage.removeItem('auth-token');
    this.user$.next(undefined);
  }

   register(data: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/api/Auth/Resgister`, data);
  }

login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/api/Auth/Login`, data);
  }



}