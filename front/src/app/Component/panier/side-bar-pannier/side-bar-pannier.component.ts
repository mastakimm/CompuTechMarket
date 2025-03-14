import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CardSideBarPannierComponent } from "../card-side-bar-pannier/card-side-bar-pannier.component";
import { AsyncPipe, CurrencyPipe, NgClass, NgForOf } from "@angular/common";
import { AnimationServiceService } from "../../../Services/DATA-Service/animation-service/animation-service.service";
import { Router } from "@angular/router";
import { PannierService } from "../../../Services/DATA-Service/pannier-service/pannier.service";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-side-bar-pannier',
  standalone: true,
  imports: [
    CardSideBarPannierComponent,
    NgForOf,
    NgClass,
    CurrencyPipe,
    AsyncPipe,
  ],
  templateUrl: './side-bar-pannier.component.html',
  styleUrls: ['./side-bar-pannier.component.css']
})
export class SideBarPannierComponent implements OnInit {

  public sidebarVisible: boolean = false;
  items$: Observable<any[]>;
  total: number = 0;

  constructor(
    protected sideBarAnimation: AnimationServiceService,
    private router: Router,
    private pannierService: PannierService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {
    this.items$ = this.pannierService.items$;
  }

  ngOnInit() {
    this.sidebarVisible = this.sideBarAnimation.getSideBarAnimation();
    this.items$.subscribe(items => {
      this.calculateTotal(items);
      this.cdr.detectChanges();
    });
  }

  calculateTotal(items: any[]) {
    this.total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  redirectPannier() {
    this.router.navigate([`/panier`]);
    this.sideBarAnimation.setSideBarAnimation();
  }

  redirectCommander(){
    this.router.navigate([`/info-commande`]);
    this.sideBarAnimation.setSideBarAnimation();
  }

  toggleSidebar() {
    this.sideBarAnimation.setSideBarAnimation();
  }


  decreaseItemQuantity(item: any) {
    this.pannierService.decreaseItemQuantity(item);
  }

  removeItem(item: any) {
    this.pannierService.removeItem(item);
  }

  addItem(item: any) {
    this.pannierService.addItem(item);
  }
}
