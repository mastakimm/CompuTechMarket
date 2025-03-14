import { Component, Input } from '@angular/core';
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CrudComponentService } from "../../Services/DATA-Service/CRUD-product-service/crud-component.service";
import { SousCategoryCardComponent } from "../sous-category-card/sous-category-card.component";

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    SousCategoryCardComponent,
    NgIf,
    NgClass,
    NgStyle
  ],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.css'
})
export class CategoryCardComponent {
  @Input() products: any;
  hoveredItem: any = null;
  public allSubCategory: any = [];
  clicked: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private CrudComponentService: CrudComponentService,
    private router: Router
  ) {}

  onMouseEnter(SubId: number) {
    this.hoveredItem = SubId;
    this.clicked = false;
    this.GetSubComponent(SubId);
  }

  onMouseLeft() {
    this.hoveredItem = null;
    this.allSubCategory = [];
  }

  GetSubComponent(SubId: number) {
    if (SubId !== undefined) {
      this.CrudComponentService.getCategorySubCategories(SubId).subscribe(
        data => {
          this.allSubCategory = data.body;
        },
        error => {
          console.error(error);
        }
      );
    } else {
      console.error('Invalid sousCategoryId');
    }
  }
}
