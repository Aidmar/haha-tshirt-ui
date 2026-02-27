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
    const parsed = saved ? JSON.parse(saved) : [];

    if (parsed.length>0) {
this.categoryList.set(parsed);
    } else {
      const seedData: Category[] = [
        { id: '1', name: 'Trending', urlHandle: 'trending' },
        { id: '2', name: 'Sale', urlHandle: 'sale' },
        { id: '3', name: 'T-shirt', urlHandle: 'T-shirt' },
        { id: '4', name: 'Hoddies', urlHandle: 'Hoddies' },
        { id: '5', name: 'Hat', urlHandle: 'Hat' },
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
    // PROTECT SYSTEM CATEGORIES (1 and 2)
    if (id === '1' || id === '2' || id === '3' || id === '4' || id === '5' ) {
      return of(undefined);
    }

    this.categoryList.update(list => list.filter(cat => cat.id !== id));
    this.saveToStorage();
    return of(undefined);
  }

  resetCategories() {
  localStorage.removeItem('demo_categories');
  this.loadFromStorage(); // Reloads the seed data into the signal
}


}