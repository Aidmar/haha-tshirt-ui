import { Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { createCategory } from '../Model/category.model';
import { CategoryService } from '../category-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-category',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-category.html',
  styleUrl: './add-category.css',
})
export class AddCategory {
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  // this.router.navigate(['/admin/categories']);

  addCategoryForm = new FormGroup({
    categoryName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(10)],
    }),

    urlHandle: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(20)],
    }),
  });


    get categoryNameformControl ()
    {
      return this.addCategoryForm.controls.categoryName
    }

       get urlHandleformControl ()
    {
      return this.addCategoryForm.controls.urlHandle
    }

  constructor() {
    effect(() => {
      if (this.categoryService.addCategoryStatus() === 'success') {
        this.categoryService.addCategoryStatus.set('idle');
        this.router.navigate(['admin/category']);
      }
      if (this.categoryService.addCategoryStatus() === 'error') {
        console.error('Add category request failed');
      }
    });
  }



  onSubmit() {
    const addCategoryFormValue = this.addCategoryForm.getRawValue();

    const addcategoryDto: createCategory = {
      name: addCategoryFormValue.categoryName,
      urlHandle: addCategoryFormValue.urlHandle,
    };

    this.categoryService.createCategory(addcategoryDto);
  }
}
