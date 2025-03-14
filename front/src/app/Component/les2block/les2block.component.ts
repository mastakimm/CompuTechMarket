import { Component, OnInit } from '@angular/core';
import { CrudComponentService } from "../../Services/DATA-Service/CRUD-product-service/crud-component.service";
import {BuyButtonComponent} from "../small components/boutons/buy-button/buy-button.component";
import {NgIf, NgStyle} from "@angular/common";
import {
  ProductDetailButtonComponent
} from "../small components/boutons/product-detail-button/product-detail-button.component";
import {Router, RouterLink} from "@angular/router";
import {SkeletonLes2BlockComponent} from "../small components/skeleton-les2-block/skeleton-les2-block.component";
import {PromotionService} from "../../Services/DATA-Service/promotion/promotion.service";

@Component({
  selector: 'app-les2block',
  templateUrl: './les2block.component.html',
  standalone: true,
  imports: [
    BuyButtonComponent,
    NgIf,
    NgStyle,
    RouterLink,
    ProductDetailButtonComponent,
    SkeletonLes2BlockComponent
  ],
  styleUrls: ['./les2block.component.css']
})
export class Les2blockComponent implements OnInit {

  public popularProducts: any[] = [];
  public days: number = 0;
  public hours: number = 3;
  public minutes: number = 24;
  public seconds: number = 60;
  private endDate: Date | undefined;

  public firstMostViewed: number = 0;
  public secondMostViewed: number = 1;
  loading: boolean = true;

  public promoProduct : any;


  constructor(
    private crudProduit: CrudComponentService,
    private router: Router,
    private promoService : PromotionService
  ) {}

  ngOnInit() {

    this.getMostPopularProduct();
    this.getMostPromoProduct()

    // Initialiser le compteur
    setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  getMostPopularProduct(){
    this.crudProduit.getTwoPopularProducts().subscribe(
      data => {

        this.popularProducts = data.body;
        this.checkAvaibality(this.popularProducts[0][this.firstMostViewed],this.popularProducts[0][this.secondMostViewed])
        this.loading = false;
      },
      error => {
        console.log(error);
      }
    );
  }


  getMostPromoProduct() {
    this.promoService.getAllProductPromotion().subscribe(
      data => {
        if (data.body && Array.isArray(data.body)) {
          const today = new Date().getTime();

          const mostPromoProduct = data.body.reduce((maxProduct: any, currentProduct: any) => {
            const validPromotions = currentProduct.promotions.filter((promo: { started_at: string | number | Date; }) => new Date(promo.started_at).getTime() <= today);

            if (validPromotions.length > 0) {
              const maxPromotion = validPromotions.reduce((maxPromo: number, promo: { promotion: number; }) =>
                promo.promotion > maxPromo ? promo.promotion : maxPromo, 0);

              return maxPromotion > (maxProduct.maxPromotion || 0) ?
                { product: currentProduct, maxPromotion } :
                maxProduct;
            }

            return maxProduct;
          }, {});

          this.promoProduct = mostPromoProduct.product;

          if (this.promoProduct && this.promoProduct.promotions[0]) {
            this.endDate = new Date(this.promoProduct.promotions[0].end_at);
          }
        }
      },
      error => {
        console.log(error);
      }
    );
  }


  updateCountdown() {
    const currentTime = new Date().getTime();
    let endTime;
    if(this.endDate){
      // @ts-ignore
      endTime = this.endDate.getTime();
    }

    // @ts-ignore
    const timeDifference = endTime - currentTime;

    if (timeDifference > 0) {
      this.days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    } else {
      this.days = 0;
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
    }
  }
  formatNumber(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  redirectVenteFlash(){
    this.router.navigate([`/categorie/${this.promoProduct.typeId.id}/${this.promoProduct.id}`]);
  }
  redirectToProduct() {
    this.router.navigate([`/categorie/${this.popularProducts[0][this.firstMostViewed].product.typeId.id}/${this.popularProducts[0][this.firstMostViewed].product.id}`]);

  }

  redirectCategories(){
    this.router.navigate([`/categorie`]);
  }


  /*        HERE REMOVE firstProduct.product.quantity ===0      */
  checkAvaibality(firstProduct:any, secondProduct:any) {
    if(firstProduct.quantity ===0){
      this.firstMostViewed++;
      this.checkAvaibality(this.popularProducts[0][this.firstMostViewed],this.popularProducts[0][this.secondMostViewed])
    }

    if (secondProduct.quantity ===0){
      this.secondMostViewed++;
      this.checkAvaibality(this.popularProducts[0][this.firstMostViewed],this.popularProducts[0][this.secondMostViewed])
    }
  }
}
