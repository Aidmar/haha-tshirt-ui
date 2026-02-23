import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable, InputSignal, signal } from '@angular/core';
import { Category, createCategory, UpdateCategory } from './Model/category.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiBaseUrl = 'https://localhost:7004';

  addCategoryStatus = signal<'idle' | 'loading' | 'error' | 'success'>('idle');
  updateCategoryStatus = signal<'idle' | 'loading' | 'error' | 'success'>('idle');

  getAllCategory() {
    return httpResource<Category[]>(() => `${this.apiBaseUrl}/api/Category`);
  }

  createCategory(category: createCategory) {
    this.addCategoryStatus.set('loading');
    this.http.post<void>(`${this.apiBaseUrl}/api/Category`, category).subscribe({
      next: () => {
        this.addCategoryStatus.set('success');
      },
      error: () => {
        this.addCategoryStatus.set('error');
      },
    });
  }

  getCategoryByid(id: InputSignal<string | undefined>): HttpResourceRef<Category | undefined> {
    return httpResource<Category>(() => `${this.apiBaseUrl}/api/Category/${id()}`);
  }

  updateCategoryById(id: string, UpdateCategoryDto: UpdateCategory) {
    this.updateCategoryStatus.set('loading');
    this.http.put<void>(`${this.apiBaseUrl}/api/Category/${id}`, UpdateCategoryDto).subscribe({
      next: () => {
        this.updateCategoryStatus.set('success');
      },
      error: () => {
        this.updateCategoryStatus.set('error'); 
      },
    });
  }

  deleteCategory(id : string) : Observable<void>
  {
    return this.http.delete<void>(`${this.apiBaseUrl}/api/Category/${id}`)
  }

}
