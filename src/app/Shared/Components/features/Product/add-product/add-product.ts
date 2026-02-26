import { Component, effect, inject, input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { addProductDto } from '../Model/product.model';
import { ProductService } from '../Services/product-service';
import { CategoryService } from '../../Category/category-service';
import { ImageSelectorService } from '../../image-selector/image-selector-service';
import { ImageSelector } from '../../image-selector/image-selector';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ImageSelector, CommonModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})
export class AddProduct {
  private fb = inject(FormBuilder);
  public productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private imageSelectorService = inject(ImageSelectorService);
  private router = inject(Router);

  // Signals for dropdowns
  categoriesRespone = this.categoryService.getAllCategory().value;
  colorsResponse = this.productService.getColors(); 
  sizesResponse = this.productService.getSizes();

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

  constructor() {
    effect(() => {
      const selectedImageUrl = this.imageSelectorService.selectedImage();
      if (selectedImageUrl) {
        this.addProductForm.patchValue({ imageUrl: selectedImageUrl });
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
    if (this.addProductForm.invalid) return;

    const formRawValue = this.addProductForm.getRawValue();
    
    const requestProduct: addProductDto = {
      title: formRawValue.ProductTitle ?? '',
      price: Number(formRawValue.Price),
      description: formRawValue.description ?? '',
      featuredImageUrl: formRawValue.imageUrl ?? '',
      urlHandle: formRawValue.urlHandle ?? '',
      categories: formRawValue.categories ?? [],
      variants: (formRawValue.variants as any[]).map(v => ({
        colorId: v.colorId,
        sizeId: v.sizeId,
        quantity: v.quantity
      }))
    };

    this.productService.createProduct(requestProduct).subscribe({
      next: () => this.router.navigate(['/admin/product']),
      error: (err) => console.error('Demo Error:', err)
    });
  }
}