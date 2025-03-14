import { Component } from '@angular/core';
import {NavbarComponent} from "../../../Component/navbar/navbar.component";
import {RateBlocComponent} from "../../../Component/rate-bloc/rate-bloc.component";
import {ProductDetailComponent} from "../../../Component/product-detail/product-detail.component";


@Component({
  selector: 'app-detail-product-page',
  standalone: true,
  imports: [
    NavbarComponent,
    RateBlocComponent,
    ProductDetailComponent,
  ],
  templateUrl: './detail-product-page.component.html',
  styleUrl: './detail-product-page.component.css'
})
export class DetailProductPageComponent {

}
