import {AfterViewInit, Component, OnInit} from '@angular/core';
import { PannierService} from "../../Services/DATA-Service/pannier-service/pannier.service";
import {ItemCardComponent} from "../../Component/item-card/item-card.component";
import {
  CardSideBarPannierComponent
} from "../../Component/panier/card-side-bar-pannier/card-side-bar-pannier.component";
import {CRUDUsersAdminService} from "../../Services/DATA-Service/CRUD-users-admin-service/crud-users-admin.service";
import {Router} from "@angular/router";
import {PaiementService} from "../../Services/Paiement-service/Paiement-service/paiement.service";
import {data} from "autoprefixer";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {DeliveryService} from "../../Services/DATA-Service/Delivery-service/delivery.service";
import {HistoryServiceService} from "../../Services/DATA-Service/history-service/history.service";
import {jsPDF} from "jspdf";
import autoTable from "jspdf-autotable";
import {CrudComponentService} from "../../Services/DATA-Service/CRUD-product-service/crud-component.service";

declare var paypal: any;
@Component({
  selector: 'app-paiement-page',
  standalone: true,
  imports: [
    ItemCardComponent,
    CardSideBarPannierComponent,
    MatProgressSpinner
  ],
  templateUrl: './paiement-page.component.html',
  styleUrl: './paiement-page.component.css'
})


export class PaiementPageComponent implements OnInit, AfterViewInit {

  items: any[] = [];
  public commandInfos : any | undefined;
  public loading = false;
  private paymentId : any;
  public visiblePopup :boolean =false;
  public orderedId :any;
  public displayPaypal : boolean = false;
  public connectedUser : any;


constructor(
  private pannierService: PannierService,
  private userService : CRUDUsersAdminService,
  private router: Router,
  private paiementService : PaiementService,
  private deliveryService : DeliveryService,
  private historyService : HistoryServiceService,
  private productService : CrudComponentService
) {
}




    ngOnInit() {
      window.scrollTo({ top: 0, behavior: 'smooth' });

      this.items = this.pannierService.getItems();
      const jsonData = localStorage.getItem("command_user_info")
      // @ts-ignore
      this.commandInfos = JSON.parse(jsonData);

      this.orderedId = this.generateOrderId();

      if(this.commandInfos.paiementCard === "paypal_payment"){
        this.displayPaypal = true;
      }

      this.checkConnectedUser();
    }

  checkConnectedUser(){
    this.userService.getAthenticateUser().subscribe(
      data=>{
        this.connectedUser = data;
      },
      error => {
        this.connectedUser = false;
      }
    )
  }

    goBack(){
    this.router.navigate(['/info-commande']);
   }

  executePaiement(){

    this.loading = true;

    //SI L'UTILISATEUR EST CONNECTÉ

    if(this.connectedUser){
      this.paiementService.postPaiement(
        Math.round(this.commandInfos.totalPrice),
        "EUR",
        this.commandInfos.paiementCard.stripeCardId,
        parseInt(this.commandInfos.userId),

      ).subscribe(
        data=>{
        },
        error => {

          this.paymentId = ((error.error.text).split(' ')).slice(2).join(' ');

          if(((error.error.text).split(' ')).slice(0, 2).join(' ') === "Payment successful:"){

            //PAIEMENT VALIDÉ

            this.executeDelivery();
          }else{

            //ERREUR STRIPE
            if (error.error.text) {
              console.log(error.error.text);
              //ERREUR BACK
            } else {
              console.log(error);
            }
          }
        }
      )
    }else {

      //SI L'UTILISATEUR N'EST PAS CONNECTÉ

      this.paiementService.chargeAnonymous(
        Math.round(this.commandInfos.totalPrice),
        "EUR",
        this.commandInfos.unconnectUserPayment.pmToken,
        this.commandInfos.unconnectUserPayment.cardToken,
      ).subscribe(
        data=>{
        },
        error => {

          if(((error.error.text).split(' ')).slice(0, 2).join(' ') === "Payment successful:"){

            //PAIEMENT VALIDÉ

            this.loading = false;
            this.showPopup()
          }else{

            //ERREUR STRIPE
            if (error.error.text) {
              console.log(error.error.text);
              //ERREUR BACK
            } else {
              console.log(error);
            }
          }
        }
      )

    }


  }

  executeDelivery(){
    const deliveryData ={
      "from": "France",
      "to": this.capitalizeFirstLetter(this.commandInfos.adress.country) ,
      "package": [
        {
          "content": "Informatique component",
          "weight": this.commandInfos.packageSize.weight,
          "width": this.commandInfos.packageSize.width,
          "height": this.commandInfos.packageSize.height,
          "length": this.commandInfos.packageSize.length
        }
      ],
      "currency": "EUR"
    }

    this.deliveryService.sendCommand(deliveryData).subscribe(
      data=>{
        this.insertHistory(data.body.id);
      },
      error => {
        console.log(error);
      }
    )
  }

  insertHistory(deliveryId :string){

  this.items.map((item: { quantity: any; id:any})=>{
    const historyData ={
      "quantity": item.quantity,
      "orderDate": this.getCurrentDateTime(),
      "deliveryId": deliveryId,
      "orderId": this.orderedId,
      "customerId": this.commandInfos.userId,
      "productId": item.id,
      "stripeChargeId": this.paymentId,
      "adresseId": this.commandInfos.adress.id,
      "tva": this.commandInfos.taxePurcentage
    }

    this.historyService.creatHistory(historyData).subscribe(
      data=>{
        this.showPopup()
      },
      error => {
        console.log(error);
      }
    )
  })
  }

  generateOrderId(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < 10; i++) {
      randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const timestamp = Date.now().toString(36); // Utilise l'heure actuelle pour plus de complexité
    const randomSegment = Math.random().toString(36).substring(2, 8); // Génère une chaîne aléatoire

    return `ORD-${randomString}-${timestamp}-${randomSegment}`;
  }

  getCurrentDateTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const milliseconds = now.getMilliseconds().toString().padStart(3, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  capitalizeFirstLetter(string: string): string {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  showPopup() {
  this.loading = false;
    this.visiblePopup = true;
  }

  //VIDER LE PANNIER ET VALIDER LE STOCK
  closePopup() {

    const allCard = this.pannierService.getItems()
    let deleteStockId: any[] = [];

    //BOUCLE SUR CHAQUE ITEM POUR VALIDER LE STOCK
    allCard.map((item:{quantity :any, stockId : any })=>{
        item.stockId.map((id: any)=>{

          deleteStockId.push(id);
        })
    })

    this.productService.validateDecreaseStock(deleteStockId).subscribe(
      data=>{
      },
      error => {
        console.log(error)
      }
    )

    this.pannierService.clearCart()
    localStorage.removeItem("command_user_info");

    if(this.connectedUser){
      this.router.navigate(['/historique']);
    }else{
      this.router.navigate(['/']);
    }
    this.visiblePopup = false;
  }


  //PAIEMENT PAYPAL
  ngAfterViewInit(): void {

    if(this.displayPaypal){
      paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: Math.round(this.commandInfos.totalPrice)
              }
            }]
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            alert('Transaction completed by ' + details.payer.name.given_name);

            // Logique supplémentaire après l'approbation
          });
        },
        onError: (err: any) => {
          console.error(err);
          alert('Une erreur est survenue lors du paiement. Veuillez réessayer.');
        }
      }).render('#paypal-button-container');
    }

  }

  generatePDF() {
    const doc = new jsPDF();
    const horsTaxePrice =  this.getHorsTaxePrice(this.commandInfos.totalPrice , this.commandInfos.taxePurcentage)

    // Titre de la facture
    doc.setFontSize(18);
    doc.text('Facture Computech Market', 14, 20);

    // Informations de la commande
    doc.setFontSize(12);
    doc.text(`Commande: ${this.orderedId}`, 14, 30);
    doc.text(`Date: ${this.getCurrentDateTime()}`, 14, 37);
    doc.text(`Adresse de facturation : ${this.commandInfos.adress.billing_address }`,14, 44)

    let startY = 50;

    // Tableau des produits
    autoTable(doc, {
      startY: startY,
      head: [['Produit', 'Prix', 'Quantité', 'Total HT']],
      body: this.items.map((product: any) => [
        product.name,
        `${product.price}€`,
        product.quantity,
        `${product.price * product.quantity} €`
      ]),
    });

    startY += this.items.length * 10 + 25;

    doc.text(`Taxes : ${this.commandInfos.taxePurcentage}% `, 14, startY -14);
    doc.text(`Total HT: ${horsTaxePrice}€ `, 14, startY -7);

    // Total général
    doc.text(`Total TTC: ${this.commandInfos.totalPrice}€ `, 14, startY);

    // Téléchargement du fichier PDF
    doc.save(`Facture_${this.orderedId}.pdf`);
  }

  getHorsTaxePrice(prix : any, pourcentageReduction : any) {
    const montantReduction = prix * (pourcentageReduction / 100);
    const prixFinal = prix - montantReduction;
    return prixFinal.toFixed(2);
  }

}
