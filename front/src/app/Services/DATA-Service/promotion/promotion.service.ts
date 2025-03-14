import {Injectable} from '@angular/core';
import { ApiService } from "../../API-Service/api.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private apiService: ApiService) { }

  public newPrice:any;

  setNewPrice(product: { price: number }, promotionValue: number): string {
    if (promotionValue !== null && promotionValue !== undefined && !isNaN(promotionValue)) {
      this.newPrice = (product.price - (product.price * promotionValue / 100)).toFixed(2);
    } else {
      this.newPrice = product.price.toFixed(2);
    }
    return this.newPrice;
  }

  createComponent(data: any): Observable<any> {
    return this.apiService.post('promotion/create', data);
  }

  updatePromotion(promotionId: string | null, data: any): Observable<any> {
    return this.apiService.put(`promotion/update/${promotionId}`, data);
  }
  getAllProductPromotion(): Observable<any> {
    return this.apiService.get('promotion/product');
  }
  getProductPromotionWithProductId(id: string | null | undefined ): Observable<any> {
    return this.apiService.get(`promotion/product/${id}`);
  }
}
