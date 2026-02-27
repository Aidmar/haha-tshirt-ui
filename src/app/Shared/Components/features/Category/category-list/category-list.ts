import { Component, inject } from '@angular/core';
import { CategoryService } from '../category-service';
import { RouterLink } from "@angular/router";
import { ProductService } from '../../Product/Services/product-service';

@Component({
  selector: 'app-category-list',
  imports: [RouterLink],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList {
private categoryService = inject(CategoryService);
private productService = inject(ProductService);

  private categoryRef = this.categoryService.getAllCategory();

  isLoading = this.categoryRef.isLoading;
  isError = this.categoryRef.error;
  categories = this.categoryRef.value;

  deleteCategory(id: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          console.log("Deleted successfully");
        }
      });
    }
  }
  resetAllData() {
  if (confirm('This will delete all your custom changes and restore default items. Continue?')) {
    this.productService.resetProducts();
    this.categoryService.resetCategories();
    
    // Optional: Force a page reload to ensure everything is fresh
    window.location.reload(); 
  }

  }
}
