import { Injectable } from '@angular/core';
import {ApiService} from "../../API-Service/api.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PaiementService {

  constructor(private apiService: ApiService) { }

  creatUserCard(data: any): Observable<any> {
    return this.apiService.post('card-payments/add', data);
  }

  getUserCard(customerId: any): Observable<any> {
    return this.apiService.get(`card-payments/card-info/${customerId}`);
  }

  changeActiveCard(customerId : any, stripeId :any): Observable<any> {
    return this.apiService.put(`card-payments/set-active?customerId=${customerId}&stripeCardId=${stripeId}`);
  }

  postPaiement(amount: any, currency: any, paymentMethodId: any, customerId: any ): Observable<any> {
    return this.apiService.post(
      `payments/charge?amount=${amount}&currency=${currency}&paymentMethodId=${paymentMethodId}&customerId=${customerId}`);
  }

  handleAnonymousPayment(stripeId :any, email :any): Observable<any> {
    return this.apiService.post(`card-payments/anonymous-payment?stripeToken=${stripeId}&email=${email}`);
  }

  chargeAnonymous(amount: any, currency: any, paymentMethodId: any, customerId :any): Observable<any> {
    return this.apiService.post(
      `payments/charge/anonymous?amount=${amount}&currency=${currency}&paymentMethodId=${paymentMethodId}&customerId=${customerId}`,
      { amount, currency, paymentMethodId }
    );
  }
}
