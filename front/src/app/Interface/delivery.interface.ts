import {ProductData} from "./product.interface";

export interface DeliveryData {
  id: number;
  quantity: number;
  supplier: string;
  refillDate: Date;
  purchasePrice: number;
  product: ProductData;
}
