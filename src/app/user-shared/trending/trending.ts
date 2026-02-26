import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { ProductService } from '../../Shared/Components/features/Product/Services/product-service';
import { CategoryService } from '../../Shared/Components/features/Category/category-service';


@Component({
  selector: 'app-trending',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './trending.html',
  styleUrl: './trending.css',
})
export class Trending {
productService = inject(ProductService);
  categoryService = inject(CategoryService);

  products = this.productService.productList; // Using the signal directly from service
  categories = this.categoryService.getAllCategory().value;
  selectedCategoryId = signal<string>('all');


  specialCategories = computed(() => {
    return this.categories()?.filter(cat => {
      const name = cat.name?.toLowerCase() || '';
      return name.includes('trending') || name.includes('sale');
    }) ?? [];
  });

  filteredProducts = computed(() => {
    const allProds = this.products() ?? [];
    const specialCats = this.specialCategories();
    const selected = this.selectedCategoryId();


    if (selected === 'all') {
      return allProds.filter(product =>
        product.categories.some(pc => specialCats.some(sc => sc.id === pc.id))
      );
    }

   
    return allProds.filter(product =>
      product.categories.some(cat => cat.id.toString() === selected)
    );
  });


  getDiscount(original: number | undefined, current: number): number {
    if (!original || original <= current) return 0;
    return Math.round(((original - current) / original) * 100);
  }

  onCategoryChange(categoryId: string | number) {
    this.selectedCategoryId.set(categoryId.toString());
  }
}