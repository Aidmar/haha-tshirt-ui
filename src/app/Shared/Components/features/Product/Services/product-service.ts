import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { computed, inject, Injectable, InputSignal, signal } from '@angular/core';
import {  addProductDto, Color, EditProductDto, product, ProductVariant, Size } from '../Model/product.model';
import { Observable, of } from 'rxjs';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { CategoryService } from '../../Category/category-service';


@Injectable({
  providedIn: 'root',
})
export class ProductService {
 private categoryService = inject(CategoryService);
   productList = signal<product[]>([]);

  
  

  private colors = signal<Color[]>([
    { id: 'c1', name: 'Black', hexCode: '#000000' },
    { id: 'c2', name: 'White', hexCode: '#FFFFFF' },
    { id: 'c3', name: 'Red', hexCode: '#FF0000' }
  ]);

  private sizes = signal<Size[]>([
    { id: 's1', name: 'S' },
    { id: 's2', name: 'M' },
    { id: 's3', name: 'L' },
    { id: 's4', name: 'XL' }
  ]);

  addProductStatus = signal<'idle' | 'loading' | 'error' | 'success'>('idle');

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const saved = localStorage.getItem('demo_products');
    if (saved) {
      this.productList.set(JSON.parse(saved));
    }
  }

  private saveToStorage() {
    localStorage.setItem('demo_products', JSON.stringify(this.productList()));
  }

getProductByid(id: string | null | undefined | InputSignal<string | undefined>) {
  return {
    value: computed(() => {
     
      const currentId = typeof id === 'function' ? id() : id;
      
      if (!currentId) return undefined;
      
      return this.productList().find(p => p.id === currentId);
    }),
    isLoading: signal(false),
    error: signal(null)
  };
}
updateProduct(id: string, updateDto: EditProductDto): Observable<product> {
  this.addProductStatus.set('loading'); // Reuse loading signal

  return new Observable<product>(observer => {
    setTimeout(() => {
    
      const allCategories = this.categoryService.getAllCategory().value();
      const mappedCategories = allCategories.filter(c => updateDto.categories.includes(c.id));

   
      const mappedVariants: ProductVariant[] = updateDto.variants.map(v => {
        const color = this.colors().find(c => c.id === v.colorId);
        const size = this.sizes().find(s => s.id === v.sizeId);
        return {
          id: Math.random().toString(36).substr(2, 9),
          colorId: v.colorId,
          colorName: color?.name || 'Unknown',
          colorHex: color?.hexCode || '#ccc',
          sizeId: v.sizeId,
          sizeName: size?.name || 'Unknown',
          quantity: v.quantity
        };
      });

   
      this.productList.update(list => 
        list.map(p => p.id === id ? { 
          ...p, 
          title: updateDto.title,
          price: updateDto.price ?? 0,
          description: updateDto.description,
          featuredImageUrl: updateDto.featuredImageUrl,
          urlHandle: updateDto.urlHandle,
          categories: mappedCategories,
          variants: mappedVariants
        } : p)
      );

      this.saveToStorage();
      this.addProductStatus.set('success');
      observer.next(this.productList().find(p => p.id === id)!);
      observer.complete();
    }, 800);
  });
}

  getAllProducts() {
    return {
      value: computed(() => this.productList()),
      isLoading: signal(false),
      error: signal(null)
    };
  }

  createProduct(data: addProductDto): Observable<product> {
    this.addProductStatus.set('loading');
    
    
    const allCategories = this.categoryService.getAllCategory().value();
    const mappedCategories = allCategories.filter(c => data.categories.includes(c.id));

    // Map Variant IDs to Names/Hex
    const mappedVariants: ProductVariant[] = data.variants.map(v => {
      const color = this.colors().find(c => c.id === v.colorId);
      const size = this.sizes().find(s => s.id === v.sizeId);
      return {
        id: Math.random().toString(36).substr(2, 9),
        colorId: v.colorId,
        colorName: color?.name || 'Unknown',
        colorHex: color?.hexCode || '#ccc',
        sizeId: v.sizeId,
        sizeName: size?.name || 'Unknown',
        quantity: v.quantity
      };
    });

    const newProduct: product = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      categories: mappedCategories,
      variants: mappedVariants
    };

    setTimeout(() => {
      this.productList.update(list => [newProduct, ...list]);
      this.saveToStorage();
      this.addProductStatus.set('success');
    }, 800);

    return of(newProduct);
  }

  deleteProduct(id: string): Observable<void> {
    this.productList.update(list => list.filter(p => p.id !== id));
    this.saveToStorage();
    return of(undefined);
  }

  // Helpers for Dropdowns
  getColors() { return this.colors; }
  getSizes() { return this.sizes; }

}