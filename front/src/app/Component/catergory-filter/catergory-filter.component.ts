import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { CrudComponentService } from "../../Services/DATA-Service/CRUD-product-service/crud-component.service";
import { ItemCardComponent } from "../item-card/item-card.component";
import { FormsModule } from "@angular/forms";
import {MatSliderModule} from "@angular/material/slider";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {ActualCatogireService} from "../../Services/DATA-Service/Breadcrumbs-Service/actual-catogire.service";


@Component({
  selector: 'app-catergory-filter',
  standalone: true,
  imports: [
    ItemCardComponent,
    FormsModule,
    MatSliderModule,
    MatProgressSpinner
  ],
  templateUrl: './catergory-filter.component.html',
  styleUrls: ['./catergory-filter.component.css']
})
export class CatergoryFilterComponent implements OnInit{
  product = {
    id: 0,
    name: '',
    description: '',
    manufacturer: '',
    model: '',
    price: 0,
    quantity: 0,
    type: '',
    mainImage: 'assets/logitech_left.jpeg',
    specifications: {} as { [key: string]: any },
  };

  public prixMin: number = 9999;
  public prixMax: number = 0;
  public CprixMin: number = 0 ;
  public CprixMax: number = 9999;
  public clicked: boolean = false;
  selectedOption: string = '';
  loading: boolean = true;
  public allPieces: any = [];
  public allPiecesAfter: any = [];
  public TypeId: string | null = '';
  public ProductId: string | null = '';

  constructor(
    private route: ActivatedRoute,
    private CrudComponentService: CrudComponentService,
    private router: Router,
    private actualCategorie : ActualCatogireService,
  ) {}

  ngOnInit(): void {

    let urlParams:string | null;

    this.route.paramMap.subscribe(params => {
       urlParams = params.get('categoryId');
      this.TypeId=params.get('categoryId');
      this.ProductId=params.get('categoryId');
    });

    const regex = /^(.*?)(?:&)(.*)$/;
    // @ts-ignore
    const match = urlParams.match(regex);

    if (match) {

      //
      //Recherche par nom ET catégorie apres recheche nav barre
      //

       this.ProductId = match[1];
       this.TypeId = match[2];

      this.CrudComponentService.getComponentByTypeAndName(this.TypeId, this.ProductId).subscribe(
        data => {
          this.loading = false;
          this.allPieces = data.body;
          this.setMaxPrice(this.allPieces);
        },
        error => {
          console.error(error);
        }
      );

      this.CrudComponentService.getCategoryById(parseInt(this.TypeId)).subscribe(
        data=>{
          this.actualCategorie.setActualCategorie(data.body.name)
        },
        error => {
          console.log(error)
        }
      )

    }else{

      if(!parseInt(<string>this.ProductId)){

        //
        // Recherche par nom apres recheche nav barre
        //

        this.CrudComponentService.getComponentByName((this.ProductId)).subscribe(
          data => {
            this.loading = false;
            this.allPieces = data.body;
            this.setMaxPrice(this.allPieces);
          },
          error => {
            console.error(error);
          }
        );
      }else{

        //
        // Recherche par catégorie apres clique sur la page contenant toute les catégories
        //

        // @ts-ignore
        this.CrudComponentService.getComponentByType(Number(this.TypeId)).subscribe(
          data => {
            this.loading = false;
            this.allPieces = data.body;
            this.setMaxPrice(this.allPieces);
          },
          error => {
            console.error(error);
          }
        );
      }
    }
  }

  onPrixMinChange(event: any) {
    this.prixMin = event.target.value;
  }

  onPrixMaxChange(event: any) {
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
