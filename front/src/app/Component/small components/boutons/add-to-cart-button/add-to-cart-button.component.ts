import { Component, Input } from '@angular/core';
import { PannierService } from "../../../../Services/DATA-Service/pannier-service/pannier.service";
import {AnimationServiceService} from "../../../../Services/DATA-Service/animation-service/animation-service.service";

@Component({
  selector: 'app-add-to-cart-button',
  standalone: true,
  templateUrl: './add-to-cart-button.component.html',
  styleUrls: ['./add-to-cart-button.component.css']
})
export class AddToCartButtonComponent {
  @Input() productDate: any;

  constructor(private pannierService: PannierService, private animationService : AnimationServiceService) { }

  addToCart() {
    const productCopy = { ...this.productDate, quantity: 1 };
    this.pannierService.addItem(productCopy);
    if(this.animationService.setSideBarAnimation()){
      return;
    }
    this.animationService.setSideBarAnimation();
  }
}
