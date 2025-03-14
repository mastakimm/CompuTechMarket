import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import { PannierService } from "../../Services/DATA-Service/pannier-service/pannier.service";
import { NgForOf } from "@angular/common";
import {CrudComponentService} from "../../Services/DATA-Service/CRUD-product-service/crud-component.service";
import {Router} from "@angular/router";
import {data} from "autoprefixer";

@Component({
  selector: 'app-panier-card',
  standalone: true,
  templateUrl: './panier-card.component.html',
  imports: [
    NgForOf
  ],
  styleUrls: ['./panier-card.component.css']
})
export class PanierCardComponent implements OnInit {
  @Input() products: any;
  private updatedItemQuantity:any;
  public productStock: number=0;
  public errorMsg: string = "";

  constructor(private pannierService: PannierService, private productService : CrudComponentService, private router: Router,) {}

  ngOnInit() {
    this.loadProduct();
  }

  loadProduct(){
    this.errorMsg = ""
    this.productService.getComponentById(this.products.id).subscribe(
      data=>{
        this.productStock = data.body.quantity;
      },
      error=>{
        console.log(error)
      }
    )
  }

  removeItem() {
    this.errorMsg = ""
    this.pannierService.removeItem(this.products);
  }

  decreaseItemQuantity() {
    this.errorMsg = ""
    this.productStock = this.productStock + 1;
    this.pannierService.decreaseItemQuantity(this.products);
  }
  addItem() {
    this.productService.getComponentById(this.products.id).subscribe(
      data=>{
        if(data.body.quantity < 1){
          this.errorMsg = "Ce produit n'est plus en stock."
          if(this.productStock != 0){
            this.productStock = this.productStock - 1;
          }
          return;
        }
        this.pannierService.addItem(this.products);
        this.productStock = this.productStock - 1;
      },
      error => {
        console.log(error)
      }
    )
  }

  redirectProduct(){
    this.productService.getComponentById(this.products.id).subscribe(
      data=>{
        this.router.navigate([`/categorie/${data.body.typeId.id}/${this.products.id}`])
      }
    )
  }
}
