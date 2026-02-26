import { Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { createCategory } from '../Model/category.model';
import { CategoryService } from '../category-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-category.html',
  styleUrl: './add-category.css',
})
export class AddCategory {

  public categoryService = inject(CategoryService);
  private router = inject(Router);

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


  get categoryNameformControl() {
    return this.addCategoryForm.controls.categoryName;
  }
  get urlHandleformControl() {
    return this.addCategoryForm.controls.urlHandle;
  }

  constructor() {

    effect(() => {
      const status = this.categoryService.addCategoryStatus();
      if (status === 'success') {
        this.categoryService.addCategoryStatus.set('idle'); 
        this.router.navigate(['admin/category']);
      }
    });
  }

  onSubmit() {
    if (this.addCategoryForm.valid) {
      const formValue = this.addCategoryForm.getRawValue();

      const dto: createCategory = {
        name: formValue.categoryName,
        urlHandle: formValue.urlHandle,
      };

      
      this.categoryService.createCategory(dto);
    }
  }
}