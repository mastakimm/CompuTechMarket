import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {PannierService} from "../../Services/DATA-Service/pannier-service/pannier.service";
import {CRUDUsersAdminService} from "../../Services/DATA-Service/CRUD-users-admin-service/crud-users-admin.service";
import {Router} from "@angular/router";
import {CardSideBarPannierComponent} from "../../Component/panier/card-side-bar-pannier/card-side-bar-pannier.component";
import {AsyncPipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {DeliveryService} from "../../Services/DATA-Service/Delivery-service/delivery.service";
import {PromotionService} from "../../Services/DATA-Service/promotion/promotion.service";
import {data} from "autoprefixer";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";
import {PaiementService} from "../../Services/Paiement-service/Paiement-service/paiement.service";
import {StripeService} from "../../Services/Paiement-service/Stripe-service/stripe.service";
import { StripeCardElement, StripeElements } from '@stripe/stripe-js';
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-information-commande-page',
  standalone: true,
  imports: [
    CardSideBarPannierComponent,
    AsyncPipe,
    NgForOf,
    FormsModule,
    MatProgressSpinner,
    NgIf,
    JsonPipe,
    ReactiveFormsModule
  ],
  templateUrl: './information-commande-page.component.html',
  styleUrl: './information-commande-page.component.css'
})
export class InformationCommandePageComponent implements OnInit, AfterViewChecked{

  public countriesTaxes: any = [
    { country: 'France', vat: 20 },
    { country: 'Germany', vat: 19 },
    { country: 'Spain', vat: 21 },
    { country: 'Italy', vat: 22 },
    { country: 'United Kingdom', vat: 20 },
    { country: 'Portugal', vat: 23 },
    { country: 'Belgium', vat: 21 },
    { country: 'Netherlands', vat: 21 },
    { country: 'Sweden', vat: 25 },
    { country: 'Denmark', vat: 25 },
    { country: 'Finland', vat: 24 },
    { country: 'Norway', vat: 25 },
    { country: 'Switzerland', vat: 7.7 },
    { country: 'Austria', vat: 20 },
    { country: 'Greece', vat: 24 },
    { country: 'Poland', vat: 23 },
    { country: 'Hungary', vat: 27 },
    { country: 'Czech Republic', vat: 21 },
    { country: 'Slovakia', vat: 20 },
    { country: 'Ireland', vat: 23 },
    { country: 'Luxembourg', vat: 17 },
    { country: 'Bulgaria', vat: 20 },
    { country: 'Croatia', vat: 25 },
    { country: 'Romania', vat: 19 },
    { country: 'Lithuania', vat: 21 },
    { country: 'Latvia', vat: 21 },
    { country: 'Estonia', vat: 20 },
    { country: 'Slovenia', vat: 22 },
    { country: 'Cyprus', vat: 19 },
    { country: 'Malta', vat: 18 }
  ];



  public actualUser:any = null;
  public itemsCard: any[] = [];
  public displayNewAdress: boolean = false;
  public displayNewCard: boolean = false;
  public choosenAdress: any;
  public deliveryMethod: any;
  public choosenDeliveryMethod: any;
  public choosenDeliverySpeedMethod: any;
  public loading: boolean = true;
  public unconnectUserDisplay : boolean = true;
  public unconnectUser : boolean = false;
  public errorMsg : string |undefined;
  public allAdress : any;

  public newAddress: string = '';
  public newZipcode: string = '';
  public newCity: string = '';
  public newCountry: string = '';
  public billingAdress: string = '';

  public phoneNumber: string = '';
  public email: string = "";
  public firstName: string = "";
  public lastName: string = "";
  public personnaleUserInfo: any | undefined;

  public userInfoDisplay: boolean = true;

  public cardPrice: number = 0;
  public promotionPrice: number = 0;
  public totalDeliveryPrice: number = 0;
  public taxePrice: number = 0;
  public taxePurcentage: number = 0;
  public totalPrice: number = 0;
  public estimatedApiPrice: number = 0;

  public totalWeight: number = 0;
  public totalHeight: number = 0;
  public totalLength: number = 0;
  public totalWidth: number = 0;

  public allPaiementCard :any;
  public choosenPaiementCardId :any;

  payWithPaypal: boolean = false;

  private elements: StripeElements | undefined = undefined;
  private card: StripeCardElement | null = null;
  cardForm: FormGroup;

  public allowedPaypal: boolean = false;
  public allowedCreditCard: boolean = false;
  public noPaymentAllowed: boolean = false;

  public stripePmToken: any | null;
  public stripeCardToken: any | null;
  public last4Digits : any | null;


  constructor(
    private pannierService: PannierService,
    private userService : CRUDUsersAdminService,
    private router: Router,
    private deliveryApi : DeliveryService,
    private paiementService : PaiementService,
    private stripeService: StripeService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    ) {
    this.cardForm = this.fb.group({
      cardName: ['', Validators.required]
    });
  }

  async ngOnInit() {
    this.itemsCard = this.pannierService.getItems();
    this.calculatePrice(this.itemsCard)
    this.initUser();
    window.scrollTo({top: 0, behavior: 'smooth'});

    const stripe = await this.stripeService.getStripe();
    if (stripe) {
      this.elements = stripe.elements();
    } else {
      console.error('Stripe n’a pas pu être initialisé.');
    }
  }

  initUser(){
    this.userService.getAthenticateUser().subscribe(
      data=>{
        this.actualUser = data.body;
        this.email = data.body.email;

        if(this.actualUser.userProfile.length > 0){

         this.actualUser.userProfile.map((item: { isActive: any; country: string | undefined; phone_number : string }) =>{

           if(item.isActive){

            //ON TRI ICI L'ORDRE POUR QUE L'ADRESSE CHOISI PAR DÉFAULT PAR
             // L'UTILISATEUR APPARAISSE EN PREMIER

            this.actualUser.userProfile = this.actualUser.userProfile.sort((a: { isActive: any; }, b: { isActive: any; }) => {
               return b.isActive - a.isActive;
             });

             this.getMethodDelivery( item.country)
             this.phoneNumber = item.phone_number;
             this.choosenAdress = item.country;
             this.allAdress = item;
             this.getEstimateDeliveryPrice();
             this.lastName = this.actualUser.userProfile[0].lastname;
             this.firstName = this.actualUser.userProfile[0].firstname;
             this.userInfoDisplay = false;

             this.saveUserInformations();
           }


         })

        }

        this.loading = false;
        this.unconnectUserDisplay = false;


        //GET USER CARD

        this.paiementService.getUserCard(this.actualUser.id).subscribe(
          data=>{

            this.allPaiementCard = data.body

            this.allPaiementCard = this.allPaiementCard.sort((a: { isActive: any; }, b: { isActive: any; }) => {
              return b.isActive - a.isActive;
            });

            this.allPaiementCard.map((item: { cardBrand: string,  }, index : any)=>{
             this.allPaiementCard[index].cardBrand = item.cardBrand.toUpperCase();
            })

            if(this.allPaiementCard){
              this.choosenPaiementCardId = this.allPaiementCard[0];
            }
          },
          error => {
            this.displayNewCard = true;
            console.log(error)
          }
        )


      },
      error => {
        if(error.error.code === "USER_NOT_FOUND"){
          this.actualUser = "none";
          this.loading = false;
          this.displayNewCard = true;
        }
      }
    )
  }

  addNewAdresse(){

    const formData = {
      address: this.newAddress,
      zipcode: this.newZipcode,
      city: this.newCity,
      country: this.capitalizeFirstLetter(this.newCountry),
      billing_address: this.billingAdress,
      phone_number: this.phoneNumber,
      firstname: this.firstName,
      lastname: this.lastName,
      isActive: false,
    };


    // Vérification si tous les champs de 'data' sont remplis
    const allFieldsFilled = Object.values(formData).every(value => value !== "");

    if (!allFieldsFilled) {
      this.errorMsg = "Veuillez remplir tous les champs"
      return;
    }

    //ON vérifie ici que le pays est livrable

    this.userService.getDeliveryByCountry(formData.country.toLowerCase()).subscribe(
      data=>{

        this.deliveryMethod = data.body.deliveryFees;
        this.choosenDeliveryMethod = data.body.deliveryFees[0];
        this.choosenDeliverySpeedMethod = data.body.deliveryFees[3];
        this.calculatePrice(this.itemsCard)

        if(this.actualUser !== "none"){

          //SI L'UTILISATEUR EST CONNECTÉ, ON ENREGISTRE L'ADRESSE EN BD

          this.userService.newCustomerProfile(this.actualUser.id, formData).subscribe(
            (response) => {
              this.displayNewAdress = false;
              this.initUser();
              this.getEstimateDeliveryPrice();
              this.choosenAdress =formData.country;
            },
            (error) => {
              console.log(error, "error updating the address.")
            }
          );

          this.checkPaymentAvailability(data.body.paymentMethods);

        }else{

          //SINON, ON L'ENREGISTRE DANS LE SERVICE POUR PLUS TARD

          this.actualUser = {
            userProfile: [formData]
          };

          this.allAdress = formData

          this.displayNewAdress = false;
          this.getMethodDelivery(formData.country)
          this.choosenAdress =formData.country;
          this.getEstimateDeliveryPrice();
        }
      },
      error=>{

        if(error.error.code === "NOT_FOUND"){

          this.errorMsg = "Oups ! Nous ne livrons pas dans ce pays. Veuillez en choisir un autre."
          this.displayNewAdress = true;
          this.actualUser = "none";
          this.totalDeliveryPrice = 0;
          this.taxePrice = 0;

          return

        }else{
          console.log(error)
        }
      }
    )
  }

  continueWithoutConnect(){
    this.unconnectUserDisplay = false;
    this.unconnectUser = true;
  }

  redirectLog(){
    this.router.navigate(['/login']);
  }

  setActualAdress(event: Event){

    this.resetData();
    const selectElement = event.target as HTMLSelectElement;
    const dataString = selectElement.value;
    const dataJson = JSON.parse(dataString);
    this.choosenAdress = dataJson.country;
    this.allAdress = dataJson;
    this.getMethodDelivery(this.choosenAdress)
    this.getEstimateDeliveryPrice()
  }

  getMethodDelivery(adress: string | undefined){

    if(adress){

      this.userService.getDeliveryByCountry(adress.toLowerCase()).subscribe(
        data=>{

          this.deliveryMethod = data.body.deliveryFees;
          this.choosenDeliveryMethod = data.body.deliveryFees[0];
          this.choosenDeliverySpeedMethod = data.body.deliveryFees[3];
          this.calculatePrice(this.itemsCard)

          this.checkPaymentAvailability(data.body.paymentMethods);
        },
        // @ts-ignore
        error=>{

          if(error.error.code === "NOT_FOUND"){
            this.errorMsg = "Oups ! Nous ne livrons pas dans ce pays. Veuillez en choisir un autre."
            this.displayNewAdress = true;
            this.actualUser = "none";
            this.estimatedApiPrice = 0;
          }else{
            console.log(error)
          }
        }
      )
    }

  }

  chooseDeliveryMethod(event: Event){
    this.resetData();
    const selectElement = event.target as HTMLSelectElement;
    const dataString = selectElement.value;
    const dataJson = JSON.parse(dataString);
    this.choosenDeliveryMethod = dataJson;
    this.calculatePrice(this.itemsCard)
  }

  chooseDeliverySpeed(event: Event){
    this.resetData();
    const selectElement = event.target as HTMLSelectElement;
    const dataString = selectElement.value;
    const dataJson = JSON.parse(dataString);
    this.choosenDeliverySpeedMethod = dataJson;
    this.calculatePrice(this.itemsCard)
  }

  redirectPanier(){
    this.router.navigate(['/panier'])
  }

  calculatePrice(card:any){

    this.resetData();

    card.map((item: { price: number, id: string, quantity : number })=>{

        this.cardPrice = parseFloat((this.cardPrice + item.price*item.quantity).toFixed(2));
    })



    if(this.actualUser){

      this.totalDeliveryPrice = this.estimatedApiPrice;

      if( this.choosenDeliveryMethod ){
        this.deliveryMethod.map((item: { deliveryMethod: any; feePercentage: number; })=>{

          if(item.deliveryMethod === this.choosenDeliveryMethod.deliveryMethod || item.deliveryMethod === this.choosenDeliveryMethod){
            this.totalDeliveryPrice = this.totalDeliveryPrice + ( this.totalDeliveryPrice * (item.feePercentage / 100));
            this.totalDeliveryPrice = parseFloat(this.totalDeliveryPrice.toFixed(2))
          }
        })
      }

      if( this.choosenDeliverySpeedMethod ){
        this.deliveryMethod.map((item: { deliverySpeed: any; feePercentage: number; })=>{

          if(item.deliverySpeed === this.choosenDeliverySpeedMethod.deliverySpeed || item.deliverySpeed === this.choosenDeliverySpeedMethod){
            this.totalDeliveryPrice = this.totalDeliveryPrice + ( this.totalDeliveryPrice * (item.feePercentage / 100));
            this.totalDeliveryPrice = parseFloat(this.totalDeliveryPrice.toFixed(2))
          }
        })
      }


      this.countriesTaxes.map((item: { country: any; vat:any })=>{
        if(this.capitalizeFirstLetter(this.choosenAdress) ===  item.country){
          this.taxePurcentage = item.vat;
          this.taxePrice = parseFloat((this.cardPrice * (item.vat / 100)).toFixed(2))
        }
      })
    }

    this.totalPrice = parseFloat((this.cardPrice + this.totalDeliveryPrice + this.taxePrice).toFixed(2)) ;

  }

  resetData(){
   this.cardPrice= 0;
   this.promotionPrice = 0;
   this.totalDeliveryPrice = 0;
   this.taxePrice = 0;
   this.taxePurcentage = 0;
   this.totalPrice = 0;
   this.newAddress = '';
   this.newZipcode = '';
   this.newCity = '';
   this.newCountry = '';
   this.billingAdress = '';
    this.totalHeight = 0;
    this.totalWeight = 0;
    this.totalLength = 0;
    this.totalWidth = 0;
  }

  getEstimateDeliveryPrice(){

    const destinationCountry = this.capitalizeFirstLetter(this.choosenAdress)

    this.getTotalSizePackage()

    if(destinationCountry){
      const data ={
        "from": "France",
        "to": destinationCountry,
        "package": [
          {
            content: "Informatique",
            weight: this.totalWeight,
            width: this.totalWidth,
            height: this.totalHeight,
            length: this.totalLength
          }
        ],
        "currency": "EUR"
      }

      this.deliveryApi.getEstimatedDeliveryPrice(data).subscribe(
        data=>{
          this.estimatedApiPrice = data.body.data.price.total;
          this.calculatePrice(this.itemsCard)
        },
        error=>{
          this.estimatedApiPrice = 0;
          this.calculatePrice(this.itemsCard)
          console.log( error)
        }
      )
    }

  }

  capitalizeFirstLetter(string: string): string {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  saveUserInformations (){

    this.personnaleUserInfo = {
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
    };

    // Vérification si tous les champs de 'data' sont remplis
    const allFieldsFilled = Object.values(this.personnaleUserInfo).every(value => value !== "");

    if (!allFieldsFilled) {
      this.errorMsg = "Veuillez renseigner toutes vos informations personnelles"
      return;
    }

    this.userInfoDisplay = false;
  }

  editUserInformations(){
    this.userInfoDisplay = true;
  }


  //SUBMIT PAIEMENT CARD TO STRIPE
  ngAfterViewChecked() {
    // Mount the card element only when the displayNewCard is true and card is not already mounted
    if (this.displayNewCard && this.elements && !this.card) {
      const cardElement = document.getElementById('card-element');
      if (cardElement) {
        this.card = this.elements.create('card');
        this.card.mount(cardElement);
      }
    }
  }

  //ENREGISTREMENT DU MOYEN DE PAIEMENT
  async onSubmit() {
    if (this.cardForm.invalid) {
      document.getElementById('card-errors')!.textContent = 'Veuillez entrer le nom sur la carte.';
      return;
    }

    if (!this.card) {
      return;
    }

    this.loading = true;

    const stripe = await this.stripeService.getStripe();
    if (stripe) {
      const { token, error } = await stripe.createToken(this.card, {
        name: this.cardForm.get('cardName')?.value
      });

      if (error) {
        this.loading = false;
        this.errorMsg = "Erreur : "+ error.message;
        document.getElementById('card-errors')!.textContent = error.message as string;
      } else {

        //SI L'UTILISATEUR EST CONNECTÉ

        if (this.actualUser !== "none" && this.actualUser.userProfile && this.actualUser.userProfile[0]["id"]) {
          console.log("User is connected, processing payment for a logged-in user");

          const userDataCard = {
            customerId: this.actualUser.id,
            stripeCardId: token.id,
            cvv: this.cardForm.get('cvv')?.value,
            isActive: true
          };

          this.paiementService.creatUserCard(userDataCard).subscribe(
            (data) => {
              this.displayNewCard = false;
              this.ngOnInit();
              this.loading = false;
              this.toastr.success('Carte ajoutée avec succès !')
            },
            errorCardAdd => {
              this.errorMsg = "Erreur de l'ajout du moyen de paiement. Veuillez réessayer"
              console.log(errorCardAdd);
            }
          );
        } else {

          //SI L'UTILISATEUR N'EST PAS CONNECTÉ

          this.paiementService.handleAnonymousPayment( token.id, this.personnaleUserInfo.email).subscribe(
            (response) => {

              this.stripePmToken = response.body.paymentMethodId;
              this.stripeCardToken = response.body.customerId;
              this.last4Digits = token.card?.last4;
              this.loading = false;
              this.displayNewCard = false;
              this.allPaiementCard =[{
                cardBrand: "VISA",
                last4: token.card?.last4,
              }];
              this.toastr.success('Carte ajoutée avec succès !')
            },
            (error) => {
              this.errorMsg = "Erreur de l'ajout du moyen de paiement. Veuillez réessayer"
              this.loading = false;
            }
          );
        }
      }
    }
  }




  continueToPaiement(){

    if(
      this.personnaleUserInfo
      && this.choosenDeliverySpeedMethod.deliverySpeed
      && this.choosenDeliveryMethod.deliveryMethod
      &&  this.allAdress
      && this.personnaleUserInfo.email
      && this.personnaleUserInfo.lastName
      && this.personnaleUserInfo.firstName
      && this.personnaleUserInfo.phoneNumber
      && (this.payWithPaypal || this.choosenPaiementCardId || this.stripePmToken)
    ){

      if(this.payWithPaypal){
        this.choosenPaiementCardId = "paypal_payment";
      }

      this.getTotalSizePackage()

      const commandData ={
        adress : this.allAdress,
        deliveryMethod : this.choosenDeliveryMethod,
        billing_address: this.billingAdress,
        deliverySpeedMethod : this.choosenDeliverySpeedMethod,
        totalPrice : this.totalPrice,
        isUserConnected : this.unconnectUser,
        personnalInformation : this.personnaleUserInfo,
        paiementCard : this.choosenPaiementCardId,
        userId : this.actualUser.id,
        packageSize :  {
          content: "Informatique",
          weight: this.totalWeight,
          width: this.totalWidth,
          height: this.totalHeight,
          length: this.totalLength
        },
        taxePurcentage : this.taxePurcentage,
        unconnectUserPayment : {
          pmToken : this.stripePmToken,
          cardToken : this.stripeCardToken,
          last4Digits : this.last4Digits,
        }
      }

      localStorage.setItem("command_user_info",JSON.stringify(commandData))

      this.router.navigate(['/paiement'])
    }else{
      this.errorMsg = "Veuillez remplir les champs indiqués par un *"
    }
  }


  //PAIEMENT VIA PAYPAL CHOOSE
  setChoosenCard(event :Event){
    const selectElement = event.target as HTMLSelectElement;
    const cardId = selectElement.value;
    this.choosenPaiementCardId = this.allPaiementCard[cardId];
  }


  getTotalSizePackage(){
    this.itemsCard.map((item: { width :number, height:number, length:number, weight:number  })=>{
      this.totalHeight = this.totalHeight + item.height;
      this.totalWeight = this.totalWeight + item.weight;
      this.totalLength = this.totalLength + item.length;
      this.totalWidth = this.totalWidth + item.width;
    })
  }

  checkPaymentAvailability(paymentMethod: any){

    if(this.allPaiementCard){
      this.choosenPaiementCardId = this.allPaiementCard[0];
    }
    this.allowedPaypal = false;
    this.allowedCreditCard = false;
    this.noPaymentAllowed = false;

    if(paymentMethod.length<1){
      this.noPaymentAllowed = true;
    }else{
      paymentMethod.map((item : { name : string } )=>{
        if(item.name === "Carte Bleue"){
          this.allowedCreditCard = true;
        }else if(item.name === "PayPal"){
          this.allowedPaypal = true;
        }else{
          this.noPaymentAllowed = true;
        }
      })
    }

    if(this.allowedPaypal && !this.allowedCreditCard){
      this.choosenPaiementCardId = null;
    }

  }



}
