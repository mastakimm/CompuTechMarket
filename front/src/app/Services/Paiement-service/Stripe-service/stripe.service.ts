import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import {Observable} from "rxjs";
import {ApiService} from "../../API-Service/api.service";

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripePromise: Promise<Stripe | null>;

  constructor(private apiService: ApiService ) {
    this.stripePromise = loadStripe('pk_test_51PpV0mP7ggaRZ7hidyLqWdJ7o9aAhKPCb0ROoKIFh0WsA32ysgyOiAJ3Mw2fIs5f3arW0oi4t4fNmXo5DvlUaRg900owo056mX');
  }

  getStripe(): Promise<Stripe | null> {
    return this.stripePromise;
  }
}
