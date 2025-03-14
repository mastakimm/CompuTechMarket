import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PanierCardComponent } from "../panier-card/panier-card.component";
import { PannierService } from "../../Services/DATA-Service/pannier-service/pannier.service";
import { Observable } from 'rxjs';
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-panier-page',
  standalone: true,
  imports: [
    PanierCardComponent,
    AsyncPipe,
    NgIf,
    NgForOf
  ],
  templateUrl: './panier-page.component.html',
  styleUrls: ['./panier-page.component.css']
})
export class PanierPageComponent implements OnInit {
  items$: Observable<any[]> = this.pannierService.items$;
  total: number = 0;
  public totalArticle:number =0;

  constructor(private pannierService: PannierService, private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit() {

    this.items$.subscribe(items => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.calculateTotal(items);
      this.cdr.detectChanges();
      this.totalArticle =0;
      items.forEach(item => {
        this.totalArticle += item.quantity;
      })
    });


  }

  calculateTotal(items: any[]) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.total = items.reduce((acc, item) => {
      const prix = parseFloat(item.price);
      const quantity = parseFloat(item.quantity);
      if (!isNaN(prix) && !isNaN(quantity)) {
        return acc + (prix * quantity);
      }
      return acc;
    }, 0);

    this.total = parseFloat(this.total.toFixed(2));
  }

  trackByFn(index: number, item: any): number {
    return item.id;
  }

  redirectPaiement(){
    this.router.navigate([`info-commande`])
  }
}
