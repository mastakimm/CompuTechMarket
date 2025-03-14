import { Component, OnInit } from '@angular/core';
import { StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { StripeService } from "../../../Services/Paiement-service/Stripe-service/stripe.service";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {CRUDUsersAdminService} from "../../../Services/DATA-Service/CRUD-users-admin-service/crud-users-admin.service";
import {PaiementService} from "../../../Services/Paiement-service/Paiement-service/paiement.service";
import {data} from "autoprefixer";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-paiement-mode-page',
  templateUrl: './paiement-mode-page.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    MatProgressSpinner
  ],
  styleUrls: ['./paiement-mode-page.component.css']
})
export class PaiementModePageComponent implements OnInit {
  private elements: StripeElements | undefined = undefined;
  private card: StripeCardElement | null = null;
  cardForm: FormGroup;
  public actualUser: any;
  public cards: any[] = [];
  currentIndex = 0;
  public isLoading: boolean = false;

  constructor(
    private stripeService: StripeService,
    private fb: FormBuilder,
    private router: Router,
    private userService: CRUDUsersAdminService,
    private paiementService: PaiementService,
    private toastr: ToastrService,
  ) {
    this.cardForm = this.fb.group({
      cardName: ['', Validators.required]
    });
  }

  async ngOnInit() {
    await this.initUser();
    if(this.actualUser){
      this.getCardPaymentsByUserId(this.actualUser.id);
    }
    const stripe = await this.stripeService.getStripe();

    if (stripe) {
      this.elements = stripe.elements();
      this.card = this.elements.create('card');
      this.card.mount('#card-element');
    } else {
      console.error('Stripe n’a pas pu être initialisé.');
    }
  }

  async onSubmit() {
    if (this.cardForm.invalid) {
      document.getElementById('card-errors')!.textContent = 'Veuillez entrer le nom sur la carte.';
      return;
    }

    if (!this.card) {
      return;
    }

    this.isLoading = true;

    const stripe = await this.stripeService.getStripe();

    if (stripe) {
      const { token, error } = await stripe.createToken(this.card, {
        name: this.cardForm.get('cardName')?.value
      });

      if (error) {
        console.error(error);
        document.getElementById('card-errors')!.textContent = error.message as string;
      } else {

        // Envoyer le token de la carte au serveur pour l'enregistrer

        const userDataCard ={
          customerId : this.actualUser.id,
          stripeCardId :  token.id,
          cvv:  this.cardForm.get('cvv')?.value,
          isActive: true
        }

        this.paiementService.creatUserCard(userDataCard).subscribe(
          data=>{
            this.isLoading = false;
            this.ngOnInit();
            this.toastr.success('Carte bancaire ajoutée avec succès !')
          },
          errorCardAdd=>{
            console.log(errorCardAdd)
          }
        )
      }
    }
  }

  async initUser() {
    try {
      const data = await this.userService.getAthenticateUser().toPromise();
      this.actualUser = data.body;
    } catch (error) {
      console.error(error);
    }
  }

  getCardPaymentsByUserId(id: string | number | null | undefined) {
    this.paiementService.getUserCard(id).subscribe(
      data => {

        this.cards = data.body;
        this.cards = this.cards.sort((a: { isActive: any; }, b: { isActive: any; }) => {
          return b.isActive - a.isActive;
        });
        this.currentIndex = 0;

      },
      error => {
        console.log(error)
      }
    );
  }

  redirectBack(){
    this.router.navigate(['/mon-compte'])
  }

  get transformStyle() {
    return `translateX(-${this.currentIndex * 100}%)`;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }

  changeActiveCard(stripeCardId : any){

      this.paiementService.changeActiveCard(this.actualUser.id, stripeCardId).subscribe(
        data =>{
          this.ngOnInit();
        },
        error => {
          console.log(error)
        }
      )
  }
}
