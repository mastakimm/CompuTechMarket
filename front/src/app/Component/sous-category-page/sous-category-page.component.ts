import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CrudComponentService} from "../../Services/DATA-Service/CRUD-product-service/crud-component.service";
import {FormsModule} from "@angular/forms";
import {ItemCardComponent} from "../item-card/item-card.component";
import {MatSlider, MatSliderRangeThumb} from "@angular/material/slider";



@Component({
  selector: 'app-sous-category-page',
  standalone: true,
  imports: [
    FormsModule,
    ItemCardComponent,
    MatSlider,
    MatSliderRangeThumb
  ],
  templateUrl: './sous-category-page.component.html',
  styleUrl: './sous-category-page.component.css'
})
export class SousCategoryPageComponent  implements OnInit{

  public prixMin: number = 9999;
  public prixMax: number = 0;
  public CprixMin: number = 0 ;
  public CprixMax: number = 9999;
  public clicked: boolean = false;
  selectedOption: string = '';

  public allPieces: any = [];
  public allPiecesAfter: any = [];


  constructor(
    private route: ActivatedRoute,
    private CrudComponentService: CrudComponentService,
    private router: Router
  ) {}

  ngOnInit(): void {

    let urlParams:string | null;



    this.route.paramMap.subscribe(params => {
      urlParams = params.get('sousCategoryId');

    //@ts-ignore
    this.CrudComponentService.getComponentsBySubCategory(Number(urlParams)).subscribe(
      data => {
        this.allPieces = data.body;
        this.setMaxPrice(this.allPieces);
      },
      error => {
        console.error(error);
      }
    );
    });

  }


  onPrixMinChange(event: any) {
    // console.log(event.target.value)Nouveau prod
    this.prixMin = event.target.value;

  }

  onPrixMaxChange(event: any) {
    // console.log(event.target.value)
    this.prixMax = event.target.value;

  }

  FilterComponent(prixMin: number, prixMax: number) {



    this.allPiecesAfter = [];
    this.clicked = true;

    this.allPieces.forEach((piece: { price: number; }) => {
      if (piece.price >= prixMin && piece.price <= prixMax) {
        this.allPiecesAfter.push(piece);
      }
    });
  }

  onOptionChange() {



    if (this.selectedOption === 'desc') {
      this.DecroissantComponent(this.prixMin, this.prixMax);
    } else if (this.selectedOption === 'asc') {
      this.CroissantComponent(this.prixMin, this.prixMax);
    }

  }

  DecroissantComponent(prixMin: number, prixMax: number) {
    this.allPiecesAfter = [];
    this.clicked = true;


    this.allPiecesAfter = this.allPieces
      .filter((piece: { price: number; }) => piece.price >= prixMin && piece.price <= prixMax)
      .sort((a: { price: number; }, b: { price: number; }) => b.price - a.price);



  }

  CroissantComponent(prixMin: number, prixMax: number) {
    this.allPiecesAfter = [];
    this.clicked = true;


    this.allPiecesAfter = this.allPieces
      .filter((piece: { price: number; }) => piece.price >= prixMin && piece.price <= prixMax)
      .sort((a: { price: number; }, b: { price: number; }) => a.price - b.price);




  }

  setMaxPrice(input:any){
    input.forEach((piece: { price: number; }) => {
      if (piece.price > this.prixMax) {
        this.prixMax = Math.ceil(piece.price) ;
        this.CprixMax = this.prixMax;
      }
      if (piece.price < this.prixMin) {
        this.prixMin = Math.floor(piece.price);
        this.CprixMin = this.prixMin;
      }
    });
  }
}
