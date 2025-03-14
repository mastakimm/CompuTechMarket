import { Injectable } from '@angular/core';
import {DeliveryApiService} from "../../API-Service/Delivery-API-service/delivery-api.service";

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  constructor(private deliveryApiService: DeliveryApiService) { }

  getAllDeliveryCountries(){
    return this.deliveryApiService.get('countries');
  }

  getAllDeliveryCurrencies(){
    return this.deliveryApiService.get('currencies');
  }

  getEstimatedDeliveryPrice(data:any){
   return this.deliveryApiService.post('package/estimate', data);
  }

  sendCommand(data:any){
    return this.deliveryApiService.post('package/send/', data);
  }

  getCommandStatus(id:any){
    return this.deliveryApiService.get(`package/${id}`);
  }
}
