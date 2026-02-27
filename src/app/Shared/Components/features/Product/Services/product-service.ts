import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { computed, inject, Injectable, InputSignal, signal } from '@angular/core';
import {
  addProductDto,
  Color,
  EditProductDto,
  product,
  ProductVariant,
  Size,
} from '../Model/product.model';
import { Observable, of } from 'rxjs';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { CategoryService } from '../../Category/category-service';

const PROTECTED_PRODUCT_IDS = ['p1', 'p2', 'p3', 'p4','p5','p6','p7','p8','p9'];

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private categoryService = inject(CategoryService);

  productList = signal<product[]>([]);
  addProductStatus = signal<'idle' | 'loading' | 'error' | 'success'>('idle');

  private colors = signal<Color[]>([
    { id: 'c1', name: 'Black', hexCode: '#000000' },
    { id: 'c2', name: 'White', hexCode: '#FFFFFF' },
    { id: 'c3', name: 'Red', hexCode: '#FF0000' },
  ]);

  private sizes = signal<Size[]>([
    { id: 's1', name: 'S' },
    { id: 's2', name: 'M' },
    { id: 's3', name: 'L' },
    { id: 's4', name: 'XL' },
  ]);

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const saved = localStorage.getItem('demo_products');
    const parsed = saved ? JSON.parse(saved) : [];

    if (parsed.length > 0) {
      this.productList.set(parsed);
    } else {
      const seedProducts: product[] = [
        {
          id: 'p1',
          title: 'Black-Hat',
          price: 35,
          description: 'A nice funny black-hat',
          // Update the path below to match your filename in assets
          featuredImageUrl: 'assets/blackhat.png',
          urlHandle: 'black-hat',
          categories: [{ id: '5', name: 'Hat', urlHandle: 'Hat' }],
          variants: [
            {
              id: 'v1',
              colorId: 'c1',
              colorName: 'Black',
              colorHex: '#000000',
              sizeId: 's2',
              sizeName: 'M',
              quantity: 10,
            },
          ],
        },
        {
          id: 'p2',
          title: 'Red-Hat',
          price: 55,
          originalPrice: 75,
          description: 'A nice funny red-hat',
          featuredImageUrl: 'assets/redhat.png',

          urlHandle: 'red-hat',
          categories: [{ id: '5', name: 'Hat', urlHandle: 'Hat' }],
          variants: [
            {
              id: 'v2',
              colorId: 'c1',
              colorName: 'red',
              colorHex: '#8b0000',
              sizeId: 's3',
              sizeName: 'L',
              quantity: 5,
            },
          ],
        },
        {
          id: 'p3',
          title: 'White-Hat',
          price: 55,
          originalPrice: 75,
          description: 'A nice funny white-hat',
          featuredImageUrl: 'assets/whitehat.png',

          urlHandle: 'white-hat',
          categories: [{ id: '5', name: 'Hat', urlHandle: 'Hat' }],
          variants: [
            {
              id: 'v3',
              colorId: 'c1',
              colorName: 'white',
              colorHex: '#ffffff',
              sizeId: 's3',
              sizeName: 'L',
              quantity: 5,
            },
          ],
        },
        {
          id: 'p5',
          title: 'Black-Tshirt',
          price: 25,
          originalPrice: 35,
          description: 'A nice funny black-Tshirt',
          featuredImageUrl: 'assets/blacktshirt.png',

          urlHandle: 'Black-Tshirt',
          categories: [{ id: '3', name: 'T-shirt', urlHandle: 'T-shirt' }],
          variants: [
            {
              id: 'v4',
              colorId: 'c1',
              colorName: 'black',
              colorHex: '#000000',
              sizeId: 's3',
              sizeName: 'L',
              quantity: 5,
            },
          ],
        },
        {
          id: 'p5',
          title: 'white-Tshirt',
          price: 25,
          originalPrice: 35,
          description: 'A nice funny white-Tshirt',
          featuredImageUrl: 'assets/whitetshirt.png',

          urlHandle: 'Black-Tshirt',
          categories: [{ id: '3', name: 'T-shirt', urlHandle: 'T-shirt' }],
          variants: [
            {
              id: 'v6',
              colorId: 'c1',
              colorName: 'black',
              colorHex: '#000000',
              sizeId: 's3',
              sizeName: 'L',
              quantity: 5,
            },
          ],
        },
        {
          id: 'p6',
          title: 'red-Tshirt',
          price: 25,
          originalPrice: 35,
          description: 'A nice funny red-Tshirt',
          featuredImageUrl: 'assets/redtshirt.png',

          urlHandle: 'Black-Tshirt',
          categories: [{ id: '3', name: 'T-shirt', urlHandle: 'T-shirt' }],
          variants: [
            {
              id: 'v5',
              colorId: 'c1',
              colorName: 'red',
              colorHex: '#ff0000',
              sizeId: 's3',
              sizeName: 'L',
              quantity: 5,
            },
          ],
        },
        {
          id: 'p7',
          title: 'black-Hoodie',
          price: 25,
          originalPrice: 35,
          description: 'A nice funny black-Hoodie',
          featuredImageUrl: 'assets/blackhoodie.png',

          urlHandle: 'Black-Hoodie',
          categories: [{ id: '4', name: 'Hoddies', urlHandle: 'Hoddies' }],
          variants: [
            {
              id: 'v5',
              colorId: 'c1',
              colorName: 'black',
              colorHex: '#000000',
              sizeId: 's3',
              sizeName: 'L',
              quantity: 5,
            },
          ],
        },
                {
          id: 'p8',
          title: 'red-Hoodie',
          price: 25,
          originalPrice: 35,
          description: 'A nice funny red-Hoodie',
          featuredImageUrl: 'assets/redhoodie.png',

          urlHandle: 'red-Hoodie',
          categories: [{ id: '4', name: 'Hoddies', urlHandle: 'Hoddies' }],
          variants: [
            {
              id: 'v5',
              colorId: 'c1',
              colorName: 'red',
              colorHex: '#ff0000',
              sizeId: 's3',
              sizeName: 'L',
              quantity: 5,
            },
          ],
        },
         {
          id: 'p8',
          title: 'white-Hoodie',
          price: 25,
          originalPrice: 35,
          description: 'A nice funny white-Hoodie',
          featuredImageUrl: 'assets/whitehoodie.png',

          urlHandle: 'red-Hoodie',
          categories: [{ id: '4', name: 'Hoddies', urlHandle: 'Hoddies' }],
          variants: [
            {
              id: 'v5',
              colorId: 'c1',
              colorName: 'white',
              colorHex: '#ffffff',
              sizeId: 's3',
              sizeName: 'L',
              quantity: 5,
            },
          ],
        },
      ];
      this.productList.set(seedProducts);
      this.saveToStorage();
    }
  }

  private saveToStorage() {
    localStorage.setItem('demo_products', JSON.stringify(this.productList()));
  }

  getAllProducts() {
    return {
      value: computed(() => this.productList()),
      isLoading: signal(false),
      error: signal(null),
    };
  }

  getProductByid(id: string | null | undefined | InputSignal<string | undefined>) {
    return {
      value: computed(() => {
        const currentId = typeof id === 'function' ? id() : id;
        if (!currentId) return undefined;
        return this.productList().find((p) => p.id === currentId);
      }),
      isLoading: signal(false),
      error: signal(null),
    };
  }

  createProduct(data: addProductDto): Observable<product> {
    this.addProductStatus.set('loading');

    const allCategories = this.categoryService.getAllCategory().value();
    const mappedCategories = allCategories.filter((c) => data.categories.includes(c.id));

    const mappedVariants: ProductVariant[] = data.variants.map((v) => {
      const color = this.colors().find((c) => c.id === v.colorId);
      const size = this.sizes().find((s) => s.id === v.sizeId);
      return {
        id: Math.random().toString(36).substr(2, 9),
        colorId: v.colorId,
        colorName: color?.name || 'Unknown',
        colorHex: color?.hexCode || '#ccc',
        sizeId: v.sizeId,
        sizeName: size?.name || 'Unknown',
        quantity: v.quantity,
      };
    });

    const newProduct: product = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      categories: mappedCategories,
      variants: mappedVariants,
    };

    setTimeout(() => {
      this.productList.update((list) => [newProduct, ...list]);
      this.saveToStorage();
      this.addProductStatus.set('success');
    }, 800);

    return of(newProduct);
  }

  updateProduct(id: string, updateDto: EditProductDto): Observable<product> {
    // GUARD: Use the globally defined constant
    if (PROTECTED_PRODUCT_IDS.includes(id)) {
      alert('System products cannot be modified.');
      return of(this.productList().find((p) => p.id === id)!);
    }

    this.addProductStatus.set('loading');

    return new Observable<product>((observer) => {
      setTimeout(() => {
        const allCategories = this.categoryService.getAllCategory().value();
        const mappedCategories = allCategories.filter((c) => updateDto.categories.includes(c.id));

        const mappedVariants: ProductVariant[] = updateDto.variants.map((v) => {
          const color = this.colors().find((c) => c.id === v.colorId);
          const size = this.sizes().find((s) => s.id === v.sizeId);
          return {
            id: Math.random().toString(36).substr(2, 9),
            colorId: v.colorId,
            colorName: color?.name || 'Unknown',
            colorHex: color?.hexCode || '#ccc',
            sizeId: v.sizeId,
            sizeName: size?.name || 'Unknown',
            quantity: v.quantity,
          };
        });

        this.productList.update((list) =>
          list.map((p) =>
            p.id === id
              ? {
                  ...p,
                  title: updateDto.title,
                  price: updateDto.price ?? 0,
                  originalPrice: updateDto.originalPrice,
                  description: updateDto.description,
                  featuredImageUrl: updateDto.featuredImageUrl,
                  urlHandle: updateDto.urlHandle,
                  categories: mappedCategories,
                  variants: mappedVariants,
                }
              : p,
          ),
        );

        this.saveToStorage();
        this.addProductStatus.set('success');
        observer.next(this.productList().find((p) => p.id === id)!);
        observer.complete();
      }, 800);
    });
  }

  deleteProduct(id: string): Observable<void> {
    if (PROTECTED_PRODUCT_IDS.includes(id)) {
      return of(undefined);
    }

    this.productList.update((list) => list.filter((p) => p.id !== id));
    this.saveToStorage();
    return of(undefined);
  }

  getColors() {
    return this.colors;
  }
  getSizes() {
    return this.sizes;
  }

  resetProducts() {
  localStorage.removeItem('demo_products');
  this.loadFromStorage(); // Reloads the seed data into the signal
}
}
