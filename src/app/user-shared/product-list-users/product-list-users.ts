import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ProductService } from '../../Shared/Components/features/Product/Services/product-service';
import { CategoryService } from '../../Shared/Components/features/Category/category-service';

@Component({
  selector: 'app-product-list-users',
  imports: [RouterLink],
  templateUrl: './product-list-users.html',
  styleUrl: './product-list-users.css',
})
export class ProductListUsers {

  //  Product Service 
  productService = inject(ProductService)
  productRef = this.productService.getAllProducts();
  isLoading = this.productRef.isLoading;
  error = this.productRef.error;
  products = this.productRef.value 

  // Category service 
  categoryService = inject(CategoryService)
  categoryRef = this.categoryService.getAllCategory();
  isCategoryLoading = this.categoryRef.isLoading;
  categories = this.categoryRef.value;



selectedCategoryId = signal<string>('all');

filteredProducts = computed(() => {
    const currentCategory = this.selectedCategoryId();
    const allProducts = this.products() ?? [];

    // If 'all' is selected, return everything
    if (currentCategory === 'all') {
      return allProducts;
    }

    // Otherwise, filter by the category ID (or name, depending on your data)
    return allProducts.filter(product =>
      product.categories.some(cat => cat.id.toString() === currentCategory.toString())
    );
  });

  onCategoryChange(categoryId: string | number) {
    this.selectedCategoryId.set(categoryId.toString());
  }







// getProductsByCategory(categoryName: string) {
//   const allProducts = this.products();
//   if (!allProducts) return [];

//   return allProducts.filter(product =>
//     product.categories.some(cat => cat.name === categoryName)
//   );
// }








  

}
