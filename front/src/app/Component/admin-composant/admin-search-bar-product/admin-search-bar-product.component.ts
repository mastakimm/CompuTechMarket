import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {ApiService} from "../../../Services/API-Service/api.service";
import {Router} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {CrudComponentService} from "../../../Services/DATA-Service/CRUD-product-service/crud-component.service";

@Component({
  selector: 'app-admin-search-bar-product',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './admin-search-bar-product.component.html',
  styleUrl: './admin-search-bar-product.component.css'
})
export class AdminSearchBarProductComponent {
  searchResults: any[] = [];
  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(private apiService: ApiService, private crudProductService: CrudComponentService,  private router: Router) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const clickedInside = this.searchInput.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.searchResults = [];
    }
  }

  redirectArticle(input: any | null , event: Event | null){
    this.searchResults = [];

    let newUrl = '';

    if (input) {
      newUrl = `/admin-panel/products/${input}`;

      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([newUrl]);
      });
    } else if (event) {
      const inputElement = event.target as HTMLInputElement;
      const inputValue = inputElement.value;

      newUrl = `/admin-panel/products/${inputValue}`;

      if (this.router.url.includes('admin-panel/stock')) {
        newUrl = `/admin-panel/${inputValue}/stock`;
      }

      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([newUrl]);
      });
    }
  }

  searchByName(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    if (inputValue) {
      this.crudProductService.getComponentByName(inputValue).subscribe(
        data => {
          this.searchResults = data.body;
        },
        error => {
          console.error('Error retrieving product:', error);
        }
      );
    } else {
      this.searchResults = [];
    }
  }
}
