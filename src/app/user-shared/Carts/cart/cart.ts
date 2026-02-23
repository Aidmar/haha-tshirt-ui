import { Component, computed, OnInit, signal } from '@angular/core';
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
export class CartComponent implements OnInit {
  cartItems = signal<any[]>([]);

  totalPrice = computed(() => {
    return this.cartItems().reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  });

  constructor(private cartService: CartSericve) {} 

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (items) => {
        console.log('Items received from API:', items); 
        this.cartItems.set(items);
      },
      error: (err) => console.error('Error loading cart:', err)
    });
  }

  // removeItem(id: string) {
  //   if(confirm('Are you sure you want to remove this item?')) {
  //     this.cartService.removeItem(id).subscribe({
  //       next: () => {
  //         console.log('Item removed successfully');
  //         this.loadCart(); // This refreshes the list
  //       },
  //       error: (err) => console.error('Error removing item:', err)
  //     });
  //   }
  // }
  removeItem(id: string) {
  Swal.fire({
    title: 'REMOVE ITEM?',
    text: "Are you sure you want to delete this from your cart?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#000000', // Black
    cancelButtonColor: '#ff0000',  // Red
    confirmButtonText: 'YES, REMOVE IT',
    cancelButtonText: 'NO, KEEP IT',
    background: '#ffffff',
    customClass: {
      popup: 'my-swal-border',
      confirmButton: 'my-swal-button',
      cancelButton: 'my-swal-button'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      this.cartService.removeItem(id).subscribe({
        next: () => {
          this.loadCart();
          
          // Small Toast after successful removal
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Item removed',
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: 'my-swal-border'
            }
          });
        },
        error: (err) => console.error('Error removing item:', err)
      });
    }
  });
}
}