import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTable, MatTableModule} from '@angular/material/table';
import { CrudComponentService } from '../../../../Services/DATA-Service/CRUD-product-service/crud-component.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductData } from '../../../../Interface/product.interface';
import { CategoryData } from '../../../../Interface/category.interface'
import {MatButtonModule} from "@angular/material/button";
import {AdminSearchBarProductComponent} from "../../admin-search-bar-product/admin-search-bar-product.component";
import {DatePipe, NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {PaginationComponent} from "../../../pagination/pagination/pagination.component";
import {elementAt} from "rxjs";
import {PromotionService} from "../../../../Services/DATA-Service/promotion/promotion.service";

@Component({
  selector: 'app-product-display',
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    AdminSearchBarProductComponent,
    NgStyle,
    NgForOf,
    NgIf,
    NgClass,
    PaginationComponent,
    DatePipe
  ],
  templateUrl: './list-product-promotion.component.html',
  styleUrls: ['./list-product-promotion.component.css'],
  animations: []
})
export class ListProductPromotionComponent implements OnInit {
  products: ProductData[] = [];
  displayedColumns: string[] = ['typeName', 'image', 'name', 'model', 'price', 'start', 'end'];
  categories: CategoryData[] = [];
  selectedCategory: CategoryData | null = null;
  selectedSubCategoryId: number | null = null;

  @ViewChild(MatTable) table: MatTable<ProductData> | undefined;

  constructor(
    private crudComponentService: CrudComponentService,
    private crudComponentPromotion : PromotionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.fetchAllCategoriesWithSubcategories();
    this.fetchAllProducts();
  }
  fetchAllProducts(): void {
    this.crudComponentPromotion.getAllProductPromotion().subscribe(
      (response) => {
        this.products = response.body
          .map((item: any) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            model: item.model,
            manufacturer: item.manufacturer,
            quantity: item.quantity,
            typeName: item.typeId.name,
            image: item.files.length > 0 ? item.files[0].file : '',
            promotion: item.promotions ? item.promotions[0]['promotion'] : null,
            started_at: item.promotions ? new Date(item.promotions[0]['started_at']).toISOString() : null,
            end_at: item.promotions ? new Date(item.promotions[0]['end_at']).toISOString() : null
          }))
          .filter((product: { promotion: null; }) => product.promotion !== null);


        if (this.table) {
          this.table.renderRows();
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }


  fetchAllCategoriesWithSubcategories(): void {
    this.crudComponentService.getAllComponentsType().subscribe(
      (response) => {
        this.categories = response.body.map((category: any) => ({
          id: category.id,
          name: category.name,
          subCategories: category.subCategories.map((subCategory: any) => ({
            id: subCategory.id,
            nom: subCategory.name
          }))
        }));
      },
      (error) => {
        console.error('Error fetching categories', error);
      }
    );
  }

  onCategoryClick(category: CategoryData): void {
    if (this.selectedCategory?.id === category.id) {
      this.selectedCategory = null;
      this.selectedSubCategoryId = null;
      this.fetchAllProducts();
    } else {
      this.selectedCategory = category;
      this.selectedSubCategoryId = null;
      this.fetchProductsByCategory(category.id);
    }
  }

  onSubCategoryClick(subCategoryId: number): void {
    if (this.selectedSubCategoryId === subCategoryId) {
      this.selectedSubCategoryId = null;
      this.fetchProductsByCategory(this.selectedCategory!.id);
    } else {
      this.selectedSubCategoryId = subCategoryId;
      this.fetchProductsBySubCategory(subCategoryId);
    }
  }

  fetchProductsByCategory(categoryId: number): void {
    this.crudComponentService.getComponentByType(categoryId).subscribe(
      (response) => {
        this.products = response.body.map((product: any) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          model: product.model,
          manufacturer: product.manufacturer,
          quantity: product.quantity,
          typeName: product.typeId.name,
          image: product.files.length > 0 ? product.files[0].file : ''
        }));

        this.table?.renderRows();
      },
      (error) => {
        console.error('Error fetching products by category', error);
      }
    );
  }

  fetchProductsBySubCategory(subCategoryId: number): void {
    this.crudComponentService.getComponentsBySubCategory(subCategoryId).subscribe(
      (response) => {
        this.products = response.body.map((product: any) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          model: product.model,
          manufacturer: product.manufacturer,
          quantity: product.quantity,
          typeName: product.typeId.name,
          image: product.files.length > 0 ? product.files[0].file : ''
        }));

        this.table?.renderRows();
      },
      (error) => {
        console.error('Error fetching products by sub-category', error);
      }
    );
  }

  redirectToProductDetail(productId: number): void {
    this.router.navigate([`/admin-panel/promotion/create/${productId}`]);
  }

  redirectNewProduct() {
    this.router.navigate([`/admin-panel/products/create`]);
  }
  redirectToCreatePromotion(){
    this.router.navigate([`/admin-panel/promotion/create`]);
  }

  protected readonly elementAt = elementAt;
}
