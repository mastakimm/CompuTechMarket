import {Component, Input, OnInit} from '@angular/core';
import {ItemCardComponent} from "../../item-card/item-card.component";
import {CatalogueButtonComponent} from "../boutons/catalogue-button/catalogue-button.component";
import {CrudComponentService} from "../../../Services/DATA-Service/CRUD-product-service/crud-component.service";
import {NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {SkeletonItemCardComponent} from "../skeleton-item-card/skeleton-item-card.component";

@Component({
  selector: 'app-carroussel-accueil',
  standalone: true,
  imports: [ItemCardComponent, CatalogueButtonComponent, NgIf, NgForOf, SkeletonItemCardComponent],
  templateUrl: './carroussel-accueil.component.html',
  styleUrl: './carroussel-accueil.component.css'
})
export class CarrousselAccueilComponent implements OnInit{

  public allPieces: any = [];
  @Input() categoryId: number = 0;
  public skeletonIterations : any = Array(5);
  loading: boolean = true;
  trackByFn(index: number, item: any): any {
    return item.id;
  }

  constructor(private crudService: CrudComponentService, private router: Router,) {}

  ngOnInit() {
    this.crudService.getComponentByType(this.categoryId).subscribe(
      data => {
        this.allPieces = data.body;
        this.loading=false;
      },
      error => {
        console.log(error)
      }
    );
  }

  voirPlusRedirect(input:any){
    this.router.navigate([`categorie/${input.id}`])
  }

}
