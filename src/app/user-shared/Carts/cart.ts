import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProductService } from '../../Shared/Components/features/Product/Services/product-service';

export interface CartItem {
  productId: string;
  productVariantId: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartSericve {
private productService = inject(ProductService);
  private cartItems = signal<{productId: string, productVariantId: string, quantity: number, id: string}[]>([]);

  constructor() {
    const saved = localStorage.getItem('demo_cart');
    if (saved) this.cartItems.set(JSON.parse(saved));
  }

  // This "hydrates" the cart with full product details
  getCart(): Observable<any[]> {
    const products = this.productService.productList();
    const currentCart = this.cartItems();

    const detailedCart = currentCart.map(cartItem => {
      const product = products.find(p => p.id === cartItem.productId);
      const variant = product?.variants.find(v => v.id === cartItem.productVariantId);

      return {
        id: cartItem.id, // The unique row ID
        quantity: cartItem.quantity,
        product: product,
        productVariant: variant
      };
    }).filter(item => item.product && item.productVariant); // Remove broken links

    return of(detailedCart);
  }

  addToCart(data: {productId: string, productVariantId: string, quantity: number}): Observable<any> {
    const current = this.cartItems();
    const existingIndex = current.findIndex(i => i.productVariantId === data.productVariantId);
    
    if (existingIndex > -1) {
      current[existingIndex].quantity += data.quantity;
      this.cartItems.set([...current]);
    } else {
      // Add unique ID for each cart row so we can track them
      const newItem = { ...data, id: Math.random().toString(36).substr(2, 9) };
      this.cartItems.update(items => [...items, newItem]);
    }

    this.saveToStorage();
    return of({ success: true });
  }

  removeItem(rowId: string): Observable<boolean> {
    this.cartItems.update(items => items.filter(i => i.id !== rowId));
    this.saveToStorage();
    return of(true);
  }

  private saveToStorage() {
    localStorage.setItem('demo_cart', JSON.stringify(this.cartItems()));
  }
}
