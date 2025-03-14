import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CRUDUsersAdminService} from "../../Services/DATA-Service/CRUD-users-admin-service/crud-users-admin.service";
import {HistoryServiceService} from "../../Services/DATA-Service/history-service/history-service.service";
import {CrudComponentService} from "../../Services/DATA-Service/CRUD-product-service/crud-component.service";
import {NgForOf} from "@angular/common";
import { DatePipe } from '@angular/common';
import {MatFabAnchor} from "@angular/material/button";
import {ReviewService} from "../../Services/DATA-Service/review-service/review.service";
import { MatDialog } from '@angular/material/dialog';
import { ReviewFormComponent } from '../review-form/review-form.component';
import {ActualCatogireService} from "../../Services/DATA-Service/Breadcrumbs-Service/actual-catogire.service";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

@Component({
  selector: 'app-historique-card',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './historique-card.component.html',
  styleUrl: './historique-card.component.css',
  providers: [DatePipe]
})
export class HistoriqueCardComponent implements OnInit {
  @Input() products: any;
  public productz: any = [];
  public total: number = 0;
  public commandDate: string = '';
  public orderId: string = '';
  public loading : boolean = true;
  public factureAdresse : any;


  constructor(
    private route: ActivatedRoute,
    private componentService: CrudComponentService,
    private historyService: HistoryServiceService,
    private router: Router,
    private datePipe: DatePipe,
    private reviewService: ReviewService,
    private dialog: MatDialog,
    private actualCategorie: ActualCatogireService,
    private userService : CRUDUsersAdminService,
  ) {}

  ngOnInit(): void {
    console.log(this.products)
    this.products.forEach((product: any) => {
      this.searchProduct(product);

      this.commandDate = this.datePipe.transform(product.orderDate, 'dd MMMM yyyy', 'fr-FR') || '';
      this.orderId = product.orderId;
    });

    this.userService.getAthenticateUser().subscribe(
      data=>{
        if(this.products[0]){

          const userAdresse = data.body.userProfile

          userAdresse.map((item:{id : any, billing_address : any})=>{
            if(this.products[0].adresseId === item.id){
              this.factureAdresse = item.billing_address;
            }
          })
        }

      },
      error=>{
        console.log(error)
      }
    )
  }

  searchProduct(product: any) {
    this.componentService.getComponentById(product.productId).subscribe(
      (data) => {
        const productData = data.body;
        if (productData) {
          this.productz.push(productData);


          this.total += productData.price * product.quantity;
          this.total = Math.round(this.total * 100) / 100;
          this.loading = false;
        }
      },
      (error) => {
        this.router.navigate(['/']);
      }
    );
  }

  openReviewDialog(productId: string): void {
    const dialogRef = this.dialog.open(ReviewFormComponent, {
      width: '400px',
      data: {productId: productId}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Review submitted successfully.');
      }
    });
  }

  redirectArticle(productId:any){

    this.componentService.getComponentById(productId.toString()).subscribe(
      data=>{
        const typeName =data.body.typeId.id
        this.actualCategorie.setActualCategorie(data.body.typeId.name)
        this.router.navigate([`categorie/${typeName}`, productId])
      },
      error => {
        console.log(error)
      }
    )

  }

  generatePDF() {
    const doc = new jsPDF();
    const horsTaxePrice =  this.getHorsTaxePrice(this.total , this.products[0].tva)

    // Titre de la facture
    doc.setFontSize(18);
    doc.text('Facture Computech Market', 14, 20);

    // Informations de la commande
    doc.setFontSize(12);
    doc.text(`Commande: ${this.orderId}`, 14, 30);
    doc.text(`Date: ${this.commandDate}`, 14, 37);
    doc.text(`Adresse de facturation : ${this.factureAdresse }`,14, 44)

    let startY = 50;

    // Combine `productz` with the correct quantities from `products`
    const combinedProducts = this.productz.map((productzItem: any) => {
      // Find the corresponding product in `products` to get the correct quantity
      const correspondingProduct = this.products.find((product: any) => product.id === productzItem.id);
      const quantity = correspondingProduct ? correspondingProduct.quantity : 1; // Default to 1 if not found

      return {
        ...productzItem,
        quantity: quantity,
      };
    });

    // Tableau des produits
    autoTable(doc, {
      startY: startY,
      head: [['Produit', 'Prix', 'Quantité', 'Total HT']],
      body: combinedProducts.map((product: any) => [
        product.name,
        `${product.price}€`,
        product.quantity,
        `${product.price * product.quantity} €`
      ]),
    });

    startY += combinedProducts.length * 10 + 25;

    doc.text(`Taxes : ${this.products[0].tva}% `, 14, startY -14);
    doc.text(`Total HT: ${horsTaxePrice}€ `, 14, startY -7);

    // Total général
    doc.text(`Total TTC: ${this.total}€ `, 14, startY);

    // Téléchargement du fichier PDF
    doc.save(`Facture_${this.orderId}.pdf`);
  }

  getHorsTaxePrice(prix : any, pourcentageReduction : any) {
    const montantReduction = prix * (pourcentageReduction / 100);
    const prixFinal = prix - montantReduction;
    return prixFinal.toFixed(2);
  }

  redirectSuivi(){
    this.router.navigate([`/suivi-livraison/${this.products[0].deliveryId}`], )
  }

}
