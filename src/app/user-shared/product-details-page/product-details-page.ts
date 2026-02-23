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

  constructor(private toastr : ToastrService){

  }

  router = inject(Router)

  cartService = inject(CartSericve); // 1. Inject CartService
  prodcutService = inject(ProductService);
  id = input<string>();

  getProductbyId = this.prodcutService.getProductByid(this.id);
  productRespone = this.getProductbyId.value;
  getAllProductRef = this.prodcutService.getAllProducts();
  productResponeRef = this.getAllProductRef.value;

  colorsResponse = this.prodcutService.getAllColors();
  sizesResponse = this.prodcutService.getAllSizes();

  selectedColorId = signal<string | null>(null);
  selectedSizeId = signal<string | null>(null);

  @ViewChild('qtyInput') qtyInput!: ElementRef;

  resetSelection() {
    this.selectedColorId.set(null);
    this.selectedSizeId.set(null);
  }

  uniqueColors = computed(() => {
    const variants = this.productRespone()?.variants || [];
    // This trick filters the array to only unique colorIds
    return variants.filter(
      (v, index, self) => index === self.findIndex((t) => t.colorId === v.colorId),
    );
  });

  uniqueSizes = computed(() => {
    const variants = this.productRespone()?.variants || [];
    return variants.filter(
      (v, index, self) => index === self.findIndex((t) => t.sizeId === v.sizeId),
    );
  });

  selectColor(id: string) {
    this.selectedColorId.update((current) => (current === id ? null : id));
  }

  selectSize(id: string) {
    this.selectedSizeId.update((current) => (current === id ? null : id));
  }
  // 1. All unique options (to show initially)
  allUniqueSizes = computed(() => {
    const variants = this.productRespone()?.variants || [];
    return variants.filter((v, i, a) => a.findIndex((t) => t.sizeId === v.sizeId) === i);
  });

  allUniqueColors = computed(() => {
    const variants = this.productRespone()?.variants || [];
    return variants.filter((v, i, a) => a.findIndex((t) => t.colorId === v.colorId) === i);
  });

  // 2. Filtered Options (The "Magic" Link)
  displaySizes = computed(() => {
    const variants = this.productRespone()?.variants || [];
    const colorId = this.selectedColorId();

    // If a color is picked, only show sizes available for that color
    const availableVariants = colorId ? variants.filter((v) => v.colorId === colorId) : variants;

    // De-duplicate: Ensure each size name appears only once
    return availableVariants.filter((v, i, a) => a.findIndex((t) => t.sizeId === v.sizeId) === i);
  });

  displayColors = computed(() => {
    const variants = this.productRespone()?.variants || [];
    const sizeId = this.selectedSizeId();

    // If a size is picked, only show colors available for that size
    const availableVariants = sizeId ? variants.filter((v) => v.sizeId === sizeId) : variants;

    // De-duplicate: Ensure each color hex appears only once
    return availableVariants.filter((v, i, a) => a.findIndex((t) => t.colorId === v.colorId) === i);
  });

  // onSubmit() {
  //   // When adding to cart, find the specific variant that matches both ID's
  //   const selectedVariant = this.productRespone()?.variants.find(
  //     (v) => v.colorId === this.selectedColorId() && v.sizeId === this.selectedSizeId(),
  //   );

  //   console.log('User wants to buy variant:', selectedVariant);
  // }

onSubmit(quantityValue: string) {
  const quantity = parseInt(quantityValue);
  const productId = this.productRespone()?.id;

  // 1. Find the variant based on user selection
  const selectedVariant = this.productRespone()?.variants.find(v => 
    v.colorId === this.selectedColorId() && v.sizeId === this.selectedSizeId()
  );

  // 2. Debug Log: Open your browser console (F12) and check this!
  console.log('Product ID:', productId);
  console.log('Selected Variant:', selectedVariant);

  if (!selectedVariant) {
    alert("Please select a valid Color and Size combination!");
    return;
  }

  // 3. Call the service
  this.cartService.addToCart({
    productId: productId!,
    productVariantId: selectedVariant.id, // This MUST be the ID we tested in Swagger
    quantity: quantity
  }).subscribe({
    next: (res) => {
      console.log('Response:', res);
      this.toastr.success("Added to the cart");
      this.router.navigate(['cart'])

    },
    error: (err) => {
      console.error('Submission Error:', err);
      this.toastr.error("something went wrong")
      
    }
  });
}
}

