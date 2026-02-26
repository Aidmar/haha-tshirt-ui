import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CartSericve } from '../cart';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartComponent  {
  private cartService = inject(CartSericve);
  cartItems = signal<any[]>([]);

  totalPrice = computed(() => {
    return this.cartItems().reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  });

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (items) => this.cartItems.set(items),
      error: (err) => console.error('Error loading cart:', err)
    });
  }

  removeItem(id: string) {
    Swal.fire({
      title: 'REMOVE ITEM?',
      text: "Are you sure you want to delete this from your cart?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000000',
      cancelButtonColor: '#ff0000',
      confirmButtonText: 'YES, REMOVE IT',
      cancelButtonText: 'NO, KEEP IT',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.removeItem(id).subscribe({
          next: () => {
            this.loadCart();
            this.showToast();
          }
        });
      }
    });
  }

  private showToast() {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Item removed',
      showConfirmButton: false,
      timer: 1500
    });
  }
}

