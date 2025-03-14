import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {AdminSearchBarProductComponent} from "../admin-search-bar-product/admin-search-bar-product.component";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource, MatTableModule
} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ProductData} from "../../../Interface/product.interface";
import {CategoryData} from "../../../Interface/category.interface";
import {CrudComponentService} from "../../../Services/DATA-Service/CRUD-product-service/crud-component.service";
import {ProductCacheService} from "../../../Services/ProductCacheService/product-cache.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {ErrorHandlerService} from "../../../Services/Error-Handler/error-handler.service";

@Component({
  selector: 'app-stock-display',
  standalone: true,
  imports: [
    AdminSearchBarProductComponent,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatPaginatorModule,
    MatSortModule,
    MatRow,
    MatRowDef,
    MatTableModule,
    NgForOf,
    NgIf,
    NgClass,
    MatHeaderCellDef,
    DatePipe,
    DecimalPipe,
    CurrencyPipe
  ],
  templateUrl: './stock-display.component.html',
  styleUrl: './stock-display.component.css'
})
export class StockDisplay implements OnInit, AfterViewInit {
  products: ProductData[] = [];
  filteredProducts: ProductData[] = [];
  displayedColumns: string[] = ['image', 'typeName', 'model',  'averagePurchasePrice', 'averageSellingPrice', 'lastDeliveryAmount', 'lastDeliveryDate', 'recommended_restock', 'quantity'];
  dataSource: MatTableDataSource<ProductData> = new MatTableDataSource<ProductData>();
  categories: CategoryData[] = [];
  selectedCategory: CategoryData | null = null;
  selectedSubCategoryId: number | null = null;
  pageSize: number = 10;
  loading: boolean = true;

  @ViewChild(MatTable) table: MatTable<ProductData> | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(
    private crudComponentService: CrudComponentService,
    private productCacheService: ProductCacheService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private errorHandler: ErrorHandlerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchAllCategoriesWithSubcategories();
    this.loadProducts();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.sort && this.paginator) {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    }, 100);
  }

  loadProducts(): void {
    const cachedProducts = this.productCacheService.getProducts();
    if (cachedProducts) {
      this.products = cachedProducts;
      this.applyFilters();
      this.loading = false;
    } else {
      this.fetchAllProducts();
    }
  }

  fetchAllProducts(): void {
    this.crudComponentService.getAllProductsWithStocks().subscribe(
      (response) => {
        this.products = response.body.map((item: any) => {
          // Find the stock entry with the most recent refillDate
          const latestStockEntry = item.stockEntries.reduce((latest: any, current: any) => {
            return new Date(current.refillDate) > new Date(latest.refillDate) ? current : latest;
          }, item.stockEntries[0]);

          const totalPurchasePrice = item.stockEntries.reduce((sum: number, entry: any) => sum + entry.purchasePrice, 0);
          const averagePurchasePrice = item.stockEntries.length > 0 ? (totalPurchasePrice / item.stockEntries.length) : null;

          const totalSellingPrice = item.stockEntries.reduce((sum: number, entry: any) => sum + entry.sellingPrice, 0);
          const averageSellingPrice = item.stockEntries.length > 0 ? (totalSellingPrice / item.stockEntries.length) : null;

          return {
            id: item.id,
            name: item.name,
            price: item.price,
            model: item.model,
            manufacturer: item.manufacturer,
            color: item.color,
            quantity: item.quantity,
            typeName: item.typeId.name,
            recommended_restock: item.recommended_restock,
            image: item.files.length > 0 ? item.files[0].file : '',
            subCategoryId: item.productSubCategory.id,
            lastDeliveryDate: latestStockEntry ? new Date(latestStockEntry.refillDate) : null,
            lastDeliveryAmount: latestStockEntry ? latestStockEntry.quantity : null,
            averagePurchasePrice: averagePurchasePrice ? averagePurchasePrice : null,
            averageSellingPrice: averageSellingPrice ? averageSellingPrice : null,
          };
        });

        this.productCacheService.setProducts(this.products);
        this.applyFilters();
        this.loading = false;

        setTimeout(() => {
          if (this.sort && this.paginator) {
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
          }
        }, 100);
      },
      (error) => {
        this.errorHandler.handleError(error, 'Erreur du chargement des produits.');
        this.loading = false;
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
        this.errorHandler.handleError(error, 'Erreur du chargement des catégories.')
        console.error('Error fetching categories', error);
      }
    );
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

    if (this.paginator) {
      this.paginator.length = this.filteredProducts.length;
      this.paginator.firstPage();
    }
  }

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
  }

  getRestockColor(quantity: number, recommendedRestock: number): string {
    if (quantity !== null && recommendedRestock !== null && recommendedRestock > 0) {
      const percentageDifference = ((quantity - recommendedRestock) / recommendedRestock) * 100;

      if (percentageDifference <= 10) {
        return '#f56565';
      } else if (percentageDifference <= 25) {
        return '#ed8936';
      } else {
        return '#48bb78';
      }
    }

    return 'transparent';
  }

  redirectNewProduct(): void {
    this.router.navigate(['/admin-panel/products/create']);
  }

  redirectToProductStock(productId: number): void {
    this.router.navigate([`/admin-panel/${productId}/stock`]);
  }
}
