import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { CurrencyPipe } from "@angular/common";
import {CrudComponentService} from "../../../Services/DATA-Service/CRUD-product-service/crud-component.service";
import {data} from "autoprefixer";

@Component({
  selector: 'app-card-side-bar-pannier',
  templateUrl: './card-side-bar-pannier.component.html',
  standalone: true,
  imports: [
    CurrencyPipe
  ],
  styleUrls: ['./card-side-bar-pannier.component.css']
})
export class CardSideBarPannierComponent{
  @Input() item: any;
  @Output() decreaseItemQuantity = new EventEmitter<void>();
  @Output() removeItem = new EventEmitter<void>();
  @Output() addItem = new EventEmitter<void>();
  public errorMsg : string ="";

  constructor(private productService: CrudComponentService) {
  }

  onDecreaseItemQuantity() {
    this.decreaseItemQuantity.emit();
  }

  addItemQuantity(){

    this.productService.getComponentById(this.item.id).subscribe(
      data=>{
          if(data.body.quantity<1){
            this.errorMsg = "Ce produit n'est plus en stock."
            return
          }
          this.addItem.emit();
      },
      error => {
        console.log(error)
      }
    )

  }
}
