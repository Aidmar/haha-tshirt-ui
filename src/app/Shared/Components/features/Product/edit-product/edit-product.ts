import { Component, effect, inject, input } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../Services/product-service';
import { CategoryService } from '../../Category/category-service';
import { EditProductDto } from '../Model/product.model';
import { ImageSelectorService } from '../../image-selector/image-selector-service';
import { ImageSelector } from "../../image-selector/image-selector";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ImageSelector, CommonModule],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css',
})
export class EditProduct {
  id = input<string>();
  private fb = inject(FormBuilder);
  router = inject(Router);
  productService = inject(ProductService);
  categoryService = inject(CategoryService);
  imageSelectorService = inject(ImageSelectorService);

  // Resources / Signals
  categoriesResouceRef = this.categoryService.getAllCategory();
  categoriesRespone = this.categoriesResouceRef.value;

  colorsResponse = this.productService.getAllColors(); 
  sizesResponse = this.productService.getAllSizes();

  private productRef = this.productService.getProductByid(this.id);
  productResponse = this.productRef.value;

  // Form definition
  editProductForm = this.fb.group({
    productTitle: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    price: [0, [Validators.required, Validators.min(0)]],
    imageUrl: ['', [Validators.required]],
    urlHandle: ['', [Validators.required]],
    description: ['', [Validators.required]],
    categories: [[] as string[]],
    variants: this.fb.array([]) // FormArray for variants
  });

  get variants(): FormArray {
    return this.editProductForm.get('variants') as FormArray;
  }

  constructor() {
    // 1. Effect for Image Selection
    effect(() => {
      const selectedImageUrl = this.imageSelectorService.selectedImage();
      if (selectedImageUrl) {
        this.editProductForm.patchValue({ imageUrl: selectedImageUrl });
      }
    });

    // 2. Effect for Patching Existing Data
effect(() => {
  const product = this.productResponse();
  if (product) {
    // 1. Patch basic info
    this.editProductForm.patchValue({
      productTitle: product.title,
      price: product.price,
      imageUrl: product.featuredImageUrl,
      urlHandle: product.urlHandle,
      description: product.description,
      categories: product.categories.map(c => c.id)
    });

    // 2. Clear and Re-fill Variants
    const variantArray = this.variants; // uses the getter
    variantArray.clear(); // Important! Removes old controls

    if (product.variants && product.variants.length > 0) {
      product.variants.forEach(v => {
        variantArray.push(this.fb.group({
          colorId: [v.colorId, Validators.required],
          sizeId: [v.sizeId, Validators.required],
          quantity: [v.quantity, [Validators.required, Validators.min(0)]]
        }));
      });
    }
  }
});
  }

  openImageSelector() {
    this.imageSelectorService.displayImageSelector();
  }

  addVariant() {
    const variantGroup = this.fb.group({
      colorId: ['', Validators.required],
      sizeId: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]]
    });
    this.variants.push(variantGroup);
  }

  removeVariant(index: number) {
    this.variants.removeAt(index);
  }

onSubmit() {
  const productId = this.id();
  if (this.editProductForm.invalid || !productId) {
    // DIAGNOSTIC LOGS
    console.log("Is Form Invalid?", this.editProductForm.invalid);
    console.log("Is ID Missing?", !productId);
    
    // Find exactly which control is failing
    Object.keys(this.editProductForm.controls).forEach(key => {
      const controlErrors = this.editProductForm.get(key)?.errors;
      if (controlErrors != null) {
        console.error('Field ' + key + ' is invalid:', controlErrors);
      }
    });
    
    // Check variants specifically
    this.variants.controls.forEach((group, index) => {
       if (group.invalid) console.error(`Variant at index ${index} is invalid`, group.value);
    });
    
    return;
  }
  
  // 1. Basic Validation
  if (this.editProductForm.invalid || !productId) {
    console.error("Form is invalid or ID is missing");
    return;
  }

  // 2. Use getRawValue() to get data from disabled fields or nested arrays
  const formValue = this.editProductForm.getRawValue();

  // 3. Construct the DTO carefully
  const updateProductRequestDto: EditProductDto = {
    id: productId,
    title: formValue.productTitle ?? '',
    price: formValue.price ?? 0,
    description: formValue.description ?? '',
    featuredImageUrl: formValue.imageUrl ?? '',
    urlHandle: formValue.urlHandle ?? '',
    categories: formValue.categories ?? [],
    // This is the part that usually fails:
    variants: (formValue.variants as any[]).map(v => ({
      colorId: v.colorId,
      sizeId: v.sizeId,
      quantity: v.quantity
    }))
  };

  console.log('Sending to Backend:', updateProductRequestDto); // Check this in F12 console!

  this.productService.editProduct(productId, updateProductRequestDto).subscribe({
    next: () => {
      this.router.navigate(['/admin/product']);
    },
    error: (err) => {
      console.error('Update failed', err);
    },
  });
}
}