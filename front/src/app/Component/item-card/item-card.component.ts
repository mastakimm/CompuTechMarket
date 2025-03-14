import { Component, Input, OnInit } from '@angular/core';
import { NgIf, NgOptimizedImage } from "@angular/common";
import { BuyButtonComponent } from "../small components/boutons/buy-button/buy-button.component";
import { ProductDetailButtonComponent } from "../small components/boutons/product-detail-button/product-detail-button.component";
import { CrudComponentService } from "../../Services/DATA-Service/CRUD-product-service/crud-component.service";
import { ActualCatogireService } from "../../Services/DATA-Service/Breadcrumbs-Service/actual-catogire.service";
import { PromotionService } from '../../Services/DATA-Service/promotion/promotion.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [
    NgOptimizedImage,
    BuyButtonComponent,
    ProductDetailButtonComponent,
    NgIf
  ],
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css']
})
export class ItemCardComponent implements OnInit {
  @Input() product: any = {
    id: 0,
    typeId: {},
    name: '',
    manufacturer: "",
    model: '',
    price: "",
    specifications: "",
    files: [],
    quantity: 0,
    description: "",
    promotion: null,
    priceAfterPromotion: "",
    created_at: "",  // Ajoutez cette ligne pour inclure la date de création
  };

  public typeName: string = "";
  public isNew: boolean = false; // Propriété pour indiquer si le produit est nouveau

  constructor(
    private productService: CrudComponentService,
    private promotionService: PromotionService,
    private actualCategorie: ActualCatogireService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProductDetails();
    this.checkIfNewProduct();
  }

  loadProductDetails() {
    this.promotionService.getProductPromotionWithProductId(this.product.id.toString()).subscribe(
      promotionData => {
        console.log(promotionData)
        if (promotionData.body && promotionData.body.length > 0) {
          this.product.promotion = promotionData.body[0].promotions[0].promotion;
          this.product.priceAfterPromotion = this.promotionService.setNewPrice({ price: this.product.price }, this.product.promotion);
        } else {
          this.product.priceAfterPromotion = this.product.price;
        }
      },
      error => {
        console.error('Error fetching product promotion details', error);
        this.product.priceAfterPromotion = this.product.price;
      }
    );
  }

  checkIfNewProduct() {
    const createdAt = new Date(this.product.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffHours = diffTime / (1000 * 60 * 60);
    this.isNew = diffHours <= 48;
  }

  get firstFile() {
    return this.product.files.length > 0 ? this.product.files[0].file : null;
  }

  redirectArticle(id: string) {
    this.productService.getComponentById(id).subscribe(
      data => {
        this.typeName = data.body.typeId.id;
        this.actualCategorie.setActualCategorie(data.body.typeId.name);
        this.router.navigate([`categorie/${this.typeName}`, id]);
      },
      error => {
        console.log(error);
      }
    );
  }
}

