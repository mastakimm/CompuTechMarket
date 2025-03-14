import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from "../../Component/navbar/navbar.component";
import {FormLogComponent} from "../../Component/form-log/form-log.component";
import {RateBlocComponent} from "../../Component/rate-bloc/rate-bloc.component";
import {DetailProductPageComponent} from "../Component-Page/detail-product-page/detail-product-page.component";
import {RouterOutlet} from "@angular/router";
import {FooterComponent} from "../../Component/footer/footer.component";
import {BreadcrumbsComponent} from "../../Component/breadcrumbs/breadcrumbs.component";
import {SideBarPannierComponent} from "../../Component/panier/side-bar-pannier/side-bar-pannier.component";
import {
  CardSideBarPannierComponent
} from "../../Component/panier/card-side-bar-pannier/card-side-bar-pannier.component";

@Component({
  selector: 'app-les2block-page',
  standalone: true,
  imports: [NavbarComponent, FormLogComponent, RateBlocComponent, DetailProductPageComponent, RouterOutlet, FooterComponent, BreadcrumbsComponent, SideBarPannierComponent, CardSideBarPannierComponent],
  template: `
    <div class="flex flex-col items-center ">
      <div id="navbar" class="w-full">
        <app-navbar class="w-full "></app-navbar>
        <app-breadcrumbs class="w-11/12"/>
      </div>
     <app-side-bar-pannier />

      <div class="w-[100%]  pt-16 bg-gray-100">
        <router-outlet></router-outlet>
      </div>
    <app-footer class="w-full"></app-footer>
    </div>
  `,
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {



}
