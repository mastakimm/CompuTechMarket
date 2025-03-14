import { Injectable } from '@angular/core';
import { ProductData } from '../../Interface/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductCacheService {
  private productsCache: ProductData[] = [];
  private cacheExpiration: number = 60000;
  private lastFetchTime: number = 0;

  setProducts(products: ProductData[]): void {
    this.productsCache = products;
    this.lastFetchTime = Date.now();
  }

  getProducts(): ProductData[] | null {
    const isCacheValid = (Date.now() - this.lastFetchTime) < this.cacheExpiration;
    return isCacheValid ? this.productsCache : null;
  }

  clearCache(): void {
    this.productsCache = [];
    this.lastFetchTime = 0;
  }
}
