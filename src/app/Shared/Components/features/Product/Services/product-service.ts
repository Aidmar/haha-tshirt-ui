import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable, InputSignal, signal } from '@angular/core';
import {  addProductDto, Color, EditProductDto, product, Size } from '../Model/product.model';
import { Observable } from 'rxjs';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';


@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiBaseUrl = 'https://localhost:7004';
  addProductStatus = signal<'idle' | 'loading' | 'error' | 'success'>('idle');
  updateProductStatus = signal<'idle' | 'loading' | 'error' | 'success'>('idle');

  createProduct(data : addProductDto) : Observable<product>
  {
    return this.http.post<product>(`${this.apiBaseUrl}/api/Product`, data)
  }

  getAllProducts()
  {
      return httpResource<product[]>(()=> `${this.apiBaseUrl}/api/Product`)
  }

  getProductByid(id: InputSignal<string | undefined>): HttpResourceRef<product | undefined> {
    return httpResource<product>(() => `${this.apiBaseUrl}/api/Product/${id()}`);
  }

  deleteProduct(id : string) : Observable<product>
  {
    return this.http.delete<product>(`${this.apiBaseUrl}/api/Product/${id}`)

  }

  editProduct(id : string , body : EditProductDto ) : Observable<product>
{
 return this.http.put<product>(`${this.apiBaseUrl}/api/Product/${id}` , body);
}

// Inside product-service.ts
getAllColors() {
    return toSignal(this.http.get<Color[]>(`${this.apiBaseUrl}/api/colors`), { initialValue: [] as Color[] });
  }

  getAllSizes() {
    return toSignal(this.http.get<Size[]>(`${this.apiBaseUrl}/api/sizes`), { initialValue: [] as Size[] });
  }


}
