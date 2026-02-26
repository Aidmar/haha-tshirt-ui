import { Component, effect, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../category-service';
import { UpdateCategory } from '../Model/category.model';
import { ImageSelector } from "../../image-selector/image-selector";

@Component({
  selector: 'app-edit-category',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-category.html',
  styleUrl: './edit-category.css',
})
export class EditCategory {
  id = input<string>();
  categoryService = inject(CategoryService);
  
  router = inject(Router);


  editCategoryForm = new FormGroup({
    categoryName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),

    urlHandle: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
  });




  constructor()
  {
    effect(()=> {
      if(this.categoryService.updateCategoryStatus()==='success')
      {
        this.categoryService.updateCategoryStatus.set('idle')
        this.router.navigate(['admin/category'])
      }
      if(this.categoryService.updateCategoryStatus() === 'error')
      {
        console.error('add Category has failed')
      }
    })
  }


  get categoryNameformControl() {
    return this.editCategoryForm.controls.categoryName;
  }

  get urlHandleformControl() {
    return this.editCategoryForm.controls.urlHandle;
  }

  onSubmit() {

    const id = this.id();

    if(!this.editCategoryForm.valid || !id )
    {
      return ;
    }

    const formrawValue = this.editCategoryForm.getRawValue();
    const updateCategoryDto : UpdateCategory = {
      name : formrawValue.categoryName,
      urlHandle : formrawValue.urlHandle
    }


    this.categoryService.updateCategoryById(id , updateCategoryDto);


  }
}
