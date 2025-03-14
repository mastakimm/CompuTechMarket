import { Component, ViewChild, OnInit } from '@angular/core';
import {MatTable, MatTableModule} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CrudComponentService } from '../../../Services/DATA-Service/CRUD-product-service/crud-component.service';
import {Router, RouterLink} from '@angular/router';
import { AdminSearchBarProductComponent } from "../admin-search-bar-product/admin-search-bar-product.component";
import {NgForOf, NgStyle} from "@angular/common";
import {ToastrService} from "ngx-toastr";
import {ErrorHandlerService} from "../../../Services/Error-Handler/error-handler.service";

export interface CategorieData {
  id: number;
  nom: string;
  picture?: string;
}

@Component({
  selector: 'app-category-display',
  standalone: true,
  imports: [MatButtonModule, MatTableModule, AdminSearchBarProductComponent, NgStyle, NgForOf, RouterLink],
  templateUrl: './all-categorie-page.component.html',
  styleUrls: ['./all-categorie-page.component.css']
})
export class AllCategoriePageComponent implements OnInit {
  dataSource: CategorieData[] = [];

  @ViewChild(MatTable) table: MatTable<CategorieData> | undefined;

  constructor(
    private crudComponentService: CrudComponentService,
    private router: Router,
    private toastr: ToastrService,
    private errorHandler: ErrorHandlerService,
  ) {}

  ngOnInit() {
    this.crudComponentService.getAllComponentsType().subscribe(
      data => {
        this.dataSource = data.body.map((item: any) => ({
          id: item.id,
          nom: item.name,
          picture: item.fileUpload?.file ? item.fileUpload.file : 'https://via.placeholder.com/150'
        }));
      },
      error => {
        this.errorHandler.handleError(error, 'Erreur lors du chargement des catégories.')

        console.log(error);
      }
    );
  }

  redirectNewCategorie() {
    this.router.navigate(['/admin-panel/categories/create']);
  }

  redirectToCategoryDetails(id: number): void {
    this.router.navigate([`/admin-panel/categories/${id}`]);
  }
}
