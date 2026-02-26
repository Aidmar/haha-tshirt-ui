import { Component, effect, inject, input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
export class EditProduct implements OnInit {
    private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private imageSelectorService = inject(ImageSelectorService);

  productId: string | null = null;
  categoriesRespone = this.categoryService.getAllCategory().value;
  colorsResponse = this.productService.getColors();
  sizesResponse = this.productService.getSizes();

  editProductForm = this.fb.group({
    title: ['', [Validators.required]],
    price: [0, [Validators.required]],
    imageUrl: ['', [Validators.required]],
    urlHandle: ['', [Validators.required]],
    description: ['', [Validators.required]],
    categories: [[] as string[]],
    variants: this.fb.array([])
  });

  get variants(): FormArray {
    return this.editProductForm.get('variants') as FormArray;
  }

  constructor() {
    effect(() => {
      const selectedImageUrl = this.imageSelectorService.selectedImage();
      if (selectedImageUrl) {
        this.editProductForm.patchValue({ imageUrl: selectedImageUrl });
      }
    });
  }

  ngOnInit(): void {
   this.productId = this.route.snapshot.paramMap.get('id');
    const productRef = this.productService.getProductByid(this.productId);
    const product = productRef.value();
    

if (product) {
    this.editProductForm.patchValue({
      title: product.title,
      price: product.price,
      imageUrl: product.featuredImageUrl,
      urlHandle: product.urlHandle,
      description: product.description,
      categories: product.categories.map(c => c.id)
    });


      product.variants.forEach(v => {
        this.variants.push(this.fb.group({
          colorId: [v.colorId, Validators.required],
          sizeId: [v.sizeId, Validators.required],
          quantity: [v.quantity, [Validators.required, Validators.min(0)]]
        }));
      });
    }
  }

  addVariant() {
    this.variants.push(this.fb.group({
      colorId: ['', Validators.required],
      sizeId: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]]
    }));
  }

  removeVariant(index: number) {
    this.variants.removeAt(index);
  }

  onSubmit() {
    if (this.editProductForm.valid && this.productId) {
      const rawValue = this.editProductForm.getRawValue();
      
      const updateDto: EditProductDto = {
        id: this.productId,
        title: rawValue.title ?? '',
        price: rawValue.price,
        description: rawValue.description ?? '',
        featuredImageUrl: rawValue.imageUrl ?? '',
        urlHandle: rawValue.urlHandle ?? '',
        categories: rawValue.categories ?? [],
        variants: (rawValue.variants as any[]).map(v => ({
          colorId: v.colorId,
          sizeId: v.sizeId,
          quantity: v.quantity
        }))
      };

      this.productService.updateProduct(this.productId, updateDto).subscribe({
        next: () => this.router.navigate(['/admin/product']),
        error: (err) => console.error(err)
      });
    }
  }

  openImageSelector() {
    this.imageSelectorService.displayImageSelector();
  }
}
 

