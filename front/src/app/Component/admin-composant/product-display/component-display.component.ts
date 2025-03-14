import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable,
  MatTableDataSource, MatTableModule
} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import { CrudComponentService } from '../../../Services/DATA-Service/CRUD-product-service/crud-component.service';
import { Router } from '@angular/router';
import { ProductData } from '../../../Interface/product.interface';
import { CategoryData } from '../../../Interface/category.interface';
import { ErrorHandlerService } from "../../../Services/Error-Handler/error-handler.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {AdminSearchBarProductComponent} from "../admin-search-bar-product/admin-search-bar-product.component";

@Component({
  selector: 'app-product-display',
  templateUrl: './component-display.component.html',
  styleUrls: ['./component-display.component.css'],
  imports: [
    NgIf,
    MatCell,
    MatHeaderCell,
    MatColumnDef,
    MatCellDef,
    MatHeaderCellDef,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    AdminSearchBarProductComponent,
    NgClass,
    NgForOf,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
  ],
  standalone: true
})
export class ComponentDisplayComponent implements OnInit, AfterViewInit {
  products: ProductData[] = [];
  filteredProducts: ProductData[] = [];
  dataSource: MatTableDataSource<ProductData> = new MatTableDataSource<ProductData>();
  displayedColumns: string[] = ['image', 'typeName', 'name', 'model', 'color', 'manufacturer', 'price'];
  categories: CategoryData[] = [];
  selectedCategory: CategoryData | null = null;
  selectedSubCategoryId: number | null = null;
  pageSize: number = 10;
  loading: boolean = true;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(
    private crudComponentService: CrudComponentService,
    private router: Router,
    private errorHandler: ErrorHandlerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchAllCategoriesWithSubcategories();
    this.loadProducts();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.dataSource && this.sort && this.paginator) {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        this.paginator.pageSize = this.pageSize;
        this.paginator.pageSizeOptions = [5, 10, 20];
      }
    }, 100);

    setTimeout(() => {
      if (this.paginator) {
        this.paginator.pageSize = this.pageSize;
      }
    }, 100);
  }

  loadProducts(): void {
    this.crudComponentService.getAllComponents().subscribe(
      (response) => {
        this.products = response.body.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          model: item.model,
          manufacturer: item.manufacturer,
          color: item.color,
          quantity: item.quantity,
          typeName: item.typeId.name,
          image: item.files.length > 0 ? item.files[0].file : '',
          subCategoryId: item.productSubCategory.id,
        }));
        this.dataSource = new MatTableDataSource(this.products);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        setTimeout(() => {
          if (this.paginator) {
            this.paginator.pageSize = this.pageSize;
            console.log('PageSize après assignation:', this.paginator.pageSize);
          } else {
            console.log('Paginator non initialisé');
          }
        }, 100);

        this.applyFilters();
        this.loading = false;
      },
      (error) => {
        this.errorHandler.handleError(error, 'Erreur du chargement des produits.');
        this.loading = false;

        this.cdr.detectChanges();
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
            nom: subCategory.name,
          })),
        }));
      },
      (error) => {
        this.errorHandler.handleError(error, 'Erreur du chargement des catégories.');
      }
    );
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter((product) => {
      if (this.selectedCategory && product.typeName !== this.selectedCategory.name) {
        return false;
      }
      if (this.selectedSubCategoryId && product.subCategoryId !== this.selectedSubCategoryId) {
        return false;
      }
      return true;
    });

    this.dataSource.data = this.filteredProducts;
  }

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.dataSource.paginator = this.paginator;
  }

  onCategoryClick(category: CategoryData): void {
    if (this.selectedCategory?.id === category.id) {
      this.selectedCategory = null;
      this.selectedSubCategoryId = null;
    } else {
      this.selectedCategory = category;
      this.selectedSubCategoryId = null;
    }
    this.applyFilters();
  }

  onSubCategoryClick(subCategoryId: number): void {
    if (this.selectedSubCategoryId === subCategoryId) {
      this.selectedSubCategoryId = null;
    } else {
      this.selectedSubCategoryId = subCategoryId;
    }
    this.applyFilters();
  }

  redirectToProductDetail(productId: number): void {
    this.router.navigate([`/admin-panel/products/${productId}`]);
  }

  redirectNewProduct(): void {
    this.router.navigate([`/admin-panel/products/create`]);
  }
}
