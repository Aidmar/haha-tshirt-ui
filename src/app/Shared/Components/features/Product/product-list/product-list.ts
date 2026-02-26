import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ProductService } from '../Services/product-service';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {

productService = inject(ProductService);

  private productRef = this.productService.getAllProducts();

  isLoading = this.productRef.isLoading;
  error = this.productRef.error;
  response = this.productRef.value;

  deleteProduct(id: string) {
    if (confirm('Delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          console.log("Product removed from LocalStorage");
        },
        error: () => {
          console.error("Something went wrong");
        }
      });
    }
  }
}



