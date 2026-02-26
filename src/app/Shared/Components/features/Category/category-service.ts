import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category, createCategory, UpdateCategory } from './Model/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoryList = signal<Category[]>([]);
  addCategoryStatus = signal<'idle' | 'loading' | 'error' | 'success'>('idle');
  updateCategoryStatus = signal<'idle' | 'loading' | 'error' | 'success'>('idle');

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const saved = localStorage.getItem('demo_categories');
    if (saved) {
      this.categoryList.set(JSON.parse(saved));
    } else {
      const seedData: Category[] = [
        { id: '1', name: 'Trending', urlHandle: 'trending' },
        { id: '2', name: 'Sale', urlHandle: 'sale' }
      ];
      this.categoryList.set(seedData);
      this.saveToStorage();
    }
  }

  private saveToStorage() {
    localStorage.setItem('demo_categories', JSON.stringify(this.categoryList()));
  }

  getAllCategory() {
    return {
      value: computed(() => this.categoryList()),
      isLoading: signal(false),
      error: signal(null)
    };
  }


  getCategoryById(id: string | null): Category | undefined {
    return this.categoryList().find(c => c.id === id);
  }

  
  updateCategoryById(id: string, updateDto: UpdateCategory) {
    this.updateCategoryStatus.set('loading');

    setTimeout(() => {
      this.categoryList.update(list => 
        list.map(cat => cat.id === id ? { ...cat, name: updateDto.name, urlHandle: updateDto.urlHandle } : cat)
      );
      this.saveToStorage();
      this.updateCategoryStatus.set('success');
    }, 800);
  }

  createCategory(category: createCategory) {
    this.addCategoryStatus.set('loading');
    const newCategory: Category = {
      id: Math.floor(Math.random() * 1000).toString(),
      name: category.name,
      urlHandle: category.urlHandle
    };
    setTimeout(() => {
      this.categoryList.update(list => [...list, newCategory]);
      this.saveToStorage();
      this.addCategoryStatus.set('success');
    }, 800);
  }

  deleteCategory(id: string): Observable<void> {
    this.categoryList.update(list => list.filter(cat => cat.id !== id));
    this.saveToStorage();
    return of(undefined);
  }

  
}