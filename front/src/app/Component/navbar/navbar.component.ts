import { Component, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
import {NavigationEnd, Router, RouterLink} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {AnimationServiceService} from "../../Services/DATA-Service/animation-service/animation-service.service";
import {CRUDUsersAdminService} from "../../Services/DATA-Service/CRUD-users-admin-service/crud-users-admin.service";
import {CrudComponentService} from "../../Services/DATA-Service/CRUD-product-service/crud-component.service";
import {DeliveryService} from "../../Services/DATA-Service/Delivery-service/delivery.service";
import {Observable} from "rxjs";
import {PannierService} from "../../Services/DATA-Service/pannier-service/pannier.service";
import {filter} from "rxjs/operators";


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    NgForOf
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  searchResults: any[] = [];
  @ViewChild('searchInput') searchInput!: ElementRef;
  lastScrollTop: number = 0;
  public categories: { id: string, name: string }[] = [];
  public choosenCategorie:any;
  public actualUser:any;
  items$: Observable<any[]> = this.pannierService.items$;
  public totalArticle:number =0;
  public activeNaveBar : boolean = false;

  constructor(
    private crudProductService: CrudComponentService,
    private router: Router,
    private animationService : AnimationServiceService,
    private userService : CRUDUsersAdminService,
    private deliveryService: DeliveryService,
    private pannierService: PannierService
    ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const clickedInside = this.searchInput.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.searchResults = [];
    }
  }
  ngOnInit() {
    window.addEventListener('scroll', this.onScroll, true);

    this.crudProductService.getAllComponentsType().subscribe(
      data=>{
        this.categories = data.body.map((category: any) => ({
          id: category.id,
          name: category.name
        }));
      },
      error=>{
        console.log(error)
      }
    )

    this.userService.getAthenticateUser().subscribe(
      data=>{
        this.actualUser = data.body.displayName;
      },
      error => {
      }
    )

    this.items$.subscribe(items => {
      this.totalArticle =0;
      items.forEach(item => {
        this.totalArticle += item.quantity;
      })
    });

    //EVENT SUR CHANGEMENT D'URL
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      // @ts-ignore
      .subscribe((event: NavigationEnd) => {
        this.checkUrl();
      });

    if(this.router.url !=="/info-commande" && this.router.url !=="/paiement"){
      this.activeNaveBar = true;
    }else{
      this.activeNaveBar = false;
    }
  }

  checkUrl(){
    const chevron = document.getElementById('alerteNoir');
    const navbar = document.getElementById('navbar');
    if(this.router.url ==="/info-commande" || this.router.url ==="/paiement"){
      this.activeNaveBar = false;
    }else{
      this.activeNaveBar = true;
    }
  }

  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedCategoryId = selectElement.value;
    this.choosenCategorie=selectedCategoryId;
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll, true);
  }

  onScroll = (event: any): void => {

      const navbar = document.getElementById('navbar');
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const chevron = document.getElementById('alerteNoir');

      if (scrollTop > this.lastScrollTop && scrollTop>40) {
        // Scroll down
        navbar!.classList.add('hide');
        // @ts-ignore
        chevron.classList.remove('pt-20');
      } else {
        // Scroll up
        navbar!.classList.remove('hide');

        // @ts-ignore
        chevron.classList.add('pt-20');
      }
      this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  };

  connexionRedirect() {
    if(this.actualUser){
      this.router.navigate(['/mon-compte']);
    }else{
      this.router.navigate(['/login']);
    }

  }

  panierRedirect(){
    this.router.navigate(['/panier'])
  }



  redirectArticle(input: any | null , event: Event | null){
    this.searchResults = [];

    if (input) {

      const newUrl = `/categorie/${input.typeId.id}/${input.id}`;

      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([newUrl]);
      });

    } else{

      // @ts-ignore
      const inputElement = event.target as HTMLInputElement;
      let inputValue = inputElement.value;

      if(this.choosenCategorie){
        inputValue=inputValue + "&"+this.choosenCategorie;
      }

      const newUrl = `/categorie/${inputValue}`;

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
          if (this.choosenCategorie) {
            this.searchResults = data.body.filter((item: { typeId: { id: any; }; }) => item.typeId.id.toString() === this.choosenCategorie);
          } else {
            this.searchResults = data.body;
          }
        },
        error => {
          console.error('Error retrieving product:', error);
        }
      );
    } else {
      this.searchResults = [];
    }
  }

  openSideBarPannier(){
    if(this.router.url!=="/panier" && this.router.url!=="/paiement" && this.router.url!=="/info-commande" ){
        this.animationService.setSideBarAnimation();
    }
  }
}
