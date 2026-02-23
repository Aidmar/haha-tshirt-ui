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

  getAllProductRef = this.productService.getAllProducts();

  isLoading = this.getAllProductRef.isLoading;
  error = this.getAllProductRef.error;
  response = this.getAllProductRef.value;

  deleteProduct(id : string)
  {
  this.productService.deleteProduct(id).subscribe({
    next : () => {
      window.location.reload()
    },
       error : () => {
        console.error("Something went wrong")
      }
  })
  }



}
