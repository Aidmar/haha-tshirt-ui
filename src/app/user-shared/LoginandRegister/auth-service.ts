import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';

import { BehaviorSubject, Observable, of, tap, throwError } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest, User } from './model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
private userSubject = new BehaviorSubject<string | undefined>(undefined);
  user$ = this.userSubject.asObservable();

  private rolesSubject = new BehaviorSubject<string[]>([]);
  userRoles$ = this.rolesSubject.asObservable();


  login(model: any): Observable<any> {
    if (model.email === 'admin@gmail.com' && model.password === 'admin123') {

      return of({
        jwtToken: 'fake-admin-token',
        email: 'admin@gmail.com',
        roles: ['Writer'] 
      });
    } else if (model.email === 'user@gmail.com' && model.password === 'user123') {
   
      return of({
        jwtToken: 'fake-user-token',
        email: 'user@gmail.com',
        roles: ['Reader']
      });
    } else {
      return throwError(() => new Error('Invalid credentials'));
    }
  }

  setUser(token: string): void {
    localStorage.setItem('auth-token', token);
    

    if (token === 'fake-admin-token') {
      this.userSubject.next('Admin User');
      this.rolesSubject.next(['Writer']);
    } else {
      this.userSubject.next('Regular User');
      this.rolesSubject.next(['Reader']);
    }
  }

  logout(): void {
    localStorage.removeItem('auth-token');
    this.userSubject.next(undefined);
    this.rolesSubject.next([]);
  }

  loadUserFromStorage(): void {
    const token = localStorage.getItem('auth-token');
    if (token) {
      this.setUser(token);
    }
  }
}


