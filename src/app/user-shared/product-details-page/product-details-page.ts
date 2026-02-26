import { Component, computed, ElementRef, inject, input, signal, ViewChild } from '@angular/core';
import { ProductService } from '../../Shared/Components/features/Product/Services/product-service';
import { CartSericve } from '../Carts/cart';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';



@Component({
  selector: 'app-product-details-page',
  imports: [],
  templateUrl: './product-details-page.html',
  styleUrl: './product-details-page.css',
})
export class ProductDetailsPage {
  
private toastr = inject(ToastrService);
  private router = inject(Router);
  private cartService = inject(CartSericve);
  private productService = inject(ProductService);


  id = input<string>();


  getProductbyId = this.productService.getProductByid(this.id);
  productRespone = this.getProductbyId.value;

  selectedColorId = signal<string | null>(null);
  selectedSizeId = signal<string | null>(null);



  displaySizes = computed(() => {
    const variants = this.productRespone()?.variants || [];
    const colorId = this.selectedColorId();
    const availableVariants = colorId ? variants.filter(v => v.colorId === colorId) : variants;
    return availableVariants.filter((v, i, a) => a.findIndex(t => t.sizeId === v.sizeId) === i);
  });

  displayColors = computed(() => {
    const variants = this.productRespone()?.variants || [];
    const sizeId = this.selectedSizeId();
    const availableVariants = sizeId ? variants.filter(v => v.sizeId === sizeId) : variants;
    return availableVariants.filter((v, i, a) => a.findIndex(t => t.colorId === v.colorId) === i);
  });

  selectColor(id: string) {
    this.selectedColorId.update(current => current === id ? null : id);
  }

  selectSize(id: string) {
    this.selectedSizeId.update(current => current === id ? null : id);
  }

  resetSelection() {
    this.selectedColorId.set(null);
    this.selectedSizeId.set(null);
  }

  onSubmit(quantityValue: string) {
    const quantity = parseInt(quantityValue);
    const product = this.productRespone();

    const selectedVariant = product?.variants.find(v => 
      v.colorId === this.selectedColorId() && v.sizeId === this.selectedSizeId()
    );

    if (!selectedVariant || !product) {
      this.toastr.warning("Please select a Color and Size");
      return;
    }

    this.cartService.addToCart({
      productId: product.id,
      productVariantId: selectedVariant.id,
      quantity: quantity
    }).subscribe({
      next: () => {
        this.toastr.success("Added to cart!");
        this.router.navigate(['/cart']);
      },
      error: () => this.toastr.error("Could not add to cart")
    });
  }
}
 
