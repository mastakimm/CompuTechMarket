import { Component, OnInit } from '@angular/core';
import { PromotionService } from '../../Services/DATA-Service/promotion/promotion.service';
import { ProductData } from '../../Interface/product.interface';
import {MatSlider, MatSliderRangeThumb} from "@angular/material/slider";
import {FormsModule} from "@angular/forms";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {ItemCardComponent} from "../../Component/item-card/item-card.component";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-promotion-page',
  standalone: true,
  templateUrl: './promotion-page.component.html',
  imports: [
    MatSlider,
    FormsModule,
    MatProgressSpinner,
    ItemCardComponent,
    NgIf,
    NgForOf,
    MatSliderRangeThumb
  ],
  styleUrls: ['./promotion-page.component.css']
})
export class PromotionPageComponent implements OnInit {

  products: ProductData[] = [];
  filteredProducts: ProductData[] = [];
  public prixMin: number = 9999;
  public prixMax: number = 0;
  public CprixMin: number = 0;
  public CprixMax: number = 9999;
  public selectedOption: string = '';
  public loading: boolean = true;

  constructor(private promotionService: PromotionService) {}

  ngOnInit(): void {
    this.promotionService.getAllProductPromotion().subscribe(
      (response) => {
        const today = new Date().getTime();

        this.products = response.body
          .map((item: any) => {
            const validPromotions = item.promotions
              ? item.promotions.filter((promo: any) => new Date(promo.started_at).getTime() <= today)
              : [];

            return {
              id: item.id,
              name: item.name,
              price: item.price,
              model: item.model,
              description: item.description,
              manufacturer: item.manufacturer,
              quantity: item.quantity,
              typeName: item.typeId.name,
              promotion: validPromotions.length > 0 ? validPromotions[0]['promotion'] : null,
              files: item.files ? item.files : [],
              started_at: validPromotions.length > 0 ? new Date(validPromotions[0]['started_at']).toISOString() : null,
              end_at: validPromotions.length > 0 ? new Date(validPromotions[0]['end_at']).toISOString() : null
            };
          })
          // Filtrer les produits pour ne garder que ceux avec une promotion valide
          .filter((product: { promotion: null | number; }) => product.promotion !== null);

        this.filteredProducts = this.products;
        this.setMaxPrice(this.filteredProducts);
        this.loading = false;
      },
      (error) => {
        console.error(error);
        this.loading = false;
      }
    );
  }



  onPrixMinChange(event: any) {
    this.prixMin = event.target.value;
  }

  onPrixMaxChange(event: any) {
    this.prixMax = event.target.value;
  }

  FilterComponent(prixMin: number, prixMax: number) {
    this.filteredProducts = this.products.filter(product => product.price >= prixMin && product.price <= prixMax);
  }

  onOptionChange() {
    if (this.selectedOption === 'desc') {
      this.filteredProducts.sort((a, b) => b.price - a.price);
    } else if (this.selectedOption === 'asc') {
      this.filteredProducts.sort((a, b) => a.price - b.price);
    }
  }

  setMaxPrice(products: ProductData[]) {
    products.forEach(product => {
      if (product.price > this.prixMax) {
        this.prixMax = Math.ceil(product.price);
        this.CprixMax = this.prixMax;
      }
      if (product.price < this.prixMin) {
        this.prixMin = Math.floor(product.price);
        this.CprixMin = this.prixMin;
      }
    });
  }
}
