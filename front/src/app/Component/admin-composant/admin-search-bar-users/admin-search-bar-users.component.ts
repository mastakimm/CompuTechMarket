import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {ApiService} from "../../../Services/API-Service/api.service";
import {Router} from "@angular/router";
import {CrudComponentService} from "../../../Services/DATA-Service/CRUD-product-service/crud-component.service";

@Component({
  selector: 'app-admin-search-bar-users',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './admin-search-bar-users.component.html',
  styleUrl: './admin-search-bar-users.component.css'
})
export class AdminSearchBarUsersComponent {
  searchResults: any[] = [];
  @ViewChild('searchInput') searchInput!: ElementRef;
  lastScrollTop: number = 0;

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

    if (input) {
      const newUrl = `/admin-panel/component/${input}`;

      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([newUrl]);
      });
    } else{
      // @ts-ignore
      const inputElement = event.target as HTMLInputElement;
      const inputValue = inputElement.value;

      const newUrl = `/admin-panel/component/${inputValue}`;

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
