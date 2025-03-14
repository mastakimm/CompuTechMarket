import { Component } from '@angular/core';
import {BuyButtonComponent} from "../boutons/buy-button/buy-button.component";
import {ProductDetailButtonComponent} from "../boutons/product-detail-button/product-detail-button.component";

@Component({
  selector: 'app-skeleton-item-card',
  standalone: true,
  imports: [
    BuyButtonComponent,
    ProductDetailButtonComponent
  ],
  templateUrl: './skeleton-item-card.component.html',
  styleUrl: './skeleton-item-card.component.css'
})
export class SkeletonItemCardComponent {

}
