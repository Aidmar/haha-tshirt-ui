import { Component, inject } from '@angular/core';
import { CategoryService } from '../category-service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-category-list',
  imports: [RouterLink],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList {
  private categoryService = inject(CategoryService);

  private getAllCategoryRef = this.categoryService.getAllCategory();

  isLoading = this.getAllCategoryRef.isLoading;
  isError = this.getAllCategoryRef.error;
  categories = this.getAllCategoryRef.value;


  deleteCategory(id : string)
  {
    this.categoryService.deleteCategory(id).subscribe({
      next  : ()=> {
        window.location.reload();
      },
      error : () => {
        console.error("Something went wrong")
      }
  
    })
  }
}
