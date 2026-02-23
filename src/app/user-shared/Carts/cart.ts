import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartSericve {

  constructor(private http: HttpClient) {}

   private baseUrl = 'https://localhost:7004'; 

  addToCart(request: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/Cart/add`, request);
  }

  getCart(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/Cart`);
  }

  removeItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/Cart/${id}`);
  }
  
}
