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

  products = this.productService.getAllProducts().value;
  categories = this.categoryService.getAllCategory().value;
  selectedCategoryId = signal<string>('all');

  specialCategories = computed(() => {
return this.categories()?.filter(cat => {
    // We cast to any here to tell TypeScript "I know what I'm doing"
    const catName = (cat.name as any)?.toString().toLowerCase() || '';
    
    return catName.includes('trending') || catName.includes('sale');
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

  getDiscount(original: any, current: number): number {
    const oldPrice = parseFloat(original);
    if (!oldPrice || oldPrice <= current) return 0;
    return Math.round(((oldPrice - current) / oldPrice) * 100);
  }

  onCategoryChange(categoryId: string | number) {
    this.selectedCategoryId.set(categoryId.toString());
  }
}