import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {CrudComponentService} from "../../Services/DATA-Service/CRUD-product-service/crud-component.service";
import {CategoryCardComponent} from "../category-card/category-card.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CategoryCardComponent,
    MatProgressSpinner,
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit{

  public allCategory: any = [];
  public allSubCategory: any = [];
  clicked: boolean = false;
  heightT: number = 25;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private CrudComponentService: CrudComponentService,
    private router: Router
  ) {}



  ngOnInit(): void {


    this.CrudComponentService.getAllComponentsType().subscribe(
      data => {
       this.allCategory = data.body;
        this.loading = false;
      },
      error => {
        console.error(error);
      }
    );


  }

  protected readonly innerHeight = innerHeight;
}
