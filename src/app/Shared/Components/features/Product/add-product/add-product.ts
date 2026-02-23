import { Component, effect, inject, input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { addProductDto } from '../Model/product.model';
import { ProductService } from '../Services/product-service';
import { CategoryService } from '../../Category/category-service';
import { ImageSelectorService } from '../../image-selector/image-selector-service';
import { ImageSelector } from '../../image-selector/image-selector';
import { CommonModule } from '@angular/common'; // Required for @for and pipes

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ImageSelector, CommonModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})
export class AddProduct {
  private fb = inject(FormBuilder);
  productService = inject(ProductService);
  categoryService = inject(CategoryService);
  imageSelectorService = inject(ImageSelectorService);
  router = inject(Router);

  // 1. CHANGED: Using .value for Category because it's still a Resource
  categoriesResouceRef = this.categoryService.getAllCategory();
  categoriesRespone = this.categoriesResouceRef.value;

  // 2. CHANGED: Remove .value here. 
  // Since we use toSignal() in the service, these are now Signals directly.
  colorsResponse = this.productService.getAllColors(); 
  sizesResponse = this.productService.getAllSizes();
  
  openImageSelector() {
    this.imageSelectorService.displayImageSelector();
  }

  id = input<string>();

  // ... rest of the form definition stays exactly the same ...

  addProductForm = this.fb.group({
    ProductTitle: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    Price: ['', [Validators.required]],
    imageUrl: ['', [Validators.required]],
    urlHandle: ['', [Validators.required]],
    description: ['', [Validators.required]],
    categories: [[] as string[]],
    variants: this.fb.array([])
  });

  get variants(): FormArray {
    return this.addProductForm.get('variants') as FormArray;
  }

  // ... constructor and other methods stay exactly the same ...

  constructor() {
    effect(() => {
      // 1. Listen for the selected image signal from the service
      const selectedImageUrl = this.imageSelectorService.selectedImage();
      
      // 2. If a URL exists, update the form control
      if (selectedImageUrl) {
        this.addProductForm.patchValue({
          imageUrl: selectedImageUrl,
        });
      }
    });
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
    if (this.addProductForm.invalid) {
      return;
    }


    interface VariantFormValue {
  colorId: string;
  sizeId: string;
  quantity: number;
}

    const formRawValue = this.addProductForm.getRawValue();
    const variants = (formRawValue.variants as unknown as VariantFormValue[]) ?? [];

const requestProduct: addProductDto = {
  title: formRawValue.ProductTitle ?? '',
  price: parseFloat(formRawValue.Price ?? '0'),
  description: formRawValue.description ?? '',
  featuredImageUrl: formRawValue.imageUrl ?? '',
  urlHandle: formRawValue.urlHandle ?? '',
  categories: formRawValue.categories ?? [],
  variants: variants.map(v => ({
    colorId: v.colorId,
    sizeId: v.sizeId,
    quantity: v.quantity
  }))
};

    this.productService.createProduct(requestProduct).subscribe({
      next: (response) => {
        this.router.navigate(['/admin/product']);
      },
      error: (err) => {
        console.error('Something went wrong', err);
      },
    });
  }
}