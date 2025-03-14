import { Component, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import {NgClass, NgForOf, NgIf, NgStyle, TitleCasePipe} from "@angular/common";
import { CrudComponentService } from "../../../../Services/DATA-Service/CRUD-product-service/crud-component.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ErrorHandlerService } from "../../../../Services/Error-Handler/error-handler.service";

@Component({
  selector: 'app-payment-methods-management',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    TitleCasePipe,
    NgClass,
    NgStyle
  ],
  templateUrl: './payment-methods-management.component.html',
  styleUrl: './payment-methods-management.component.css'
})
export class PaymentMethodsManagementComponent implements OnInit {
  countries: Array<{ id: number, name: string }> = [];
  selectedCountryId: number | null = null;
  selectedCountryPaymentMethods: any;

  alwaysVisiblePaymentMethods = [
    { id: null, name: 'PayPal', authorized: false },
    { id: null, name: 'Carte Bleue', authorized: false }
  ];

  constructor(
    private crudComponentService: CrudComponentService,
    private router: Router,
    private toastr: ToastrService,
    private errorHandler: ErrorHandlerService,
  ) {}

  ngOnInit() {
    this.getDeliverableCountries();
    this.resetPaymentMethodAuthorization();
  }

  resetPaymentMethodAuthorization() {
    this.alwaysVisiblePaymentMethods.forEach(method => {
      method.authorized = false;
      method.id = null;
    });
  }

  getDeliverableCountries() {
    this.crudComponentService.getDeliverableCountries().subscribe(
      (response: any) => {
        this.countries = response.body;
      },
      (error: any) => {
        this.toastr.error('Erreur lors du chargement des pays.');
        console.log('Error fetching countries.', error);
      }
    );
  }

  onCountrySelect(event: any) {
    const selectedCountryId = event.target.value;
    if (selectedCountryId) {
      this.selectedCountryId = selectedCountryId;
      this.getCountryPaymentMethods(this.selectedCountryId);
    }
  }

  getCountryPaymentMethods(countryId: number | null) {
    this.crudComponentService.getCountryPaymentMethods(countryId).subscribe(
      (response: any) => {
        this.selectedCountryPaymentMethods = response.body.paymentMethods;

        this.alwaysVisiblePaymentMethods.forEach(method => {
          const matchedMethod = this.selectedCountryPaymentMethods.find(
            (pm: any) => pm.name.toLowerCase() === method.name.toLowerCase()
          );

          if (matchedMethod) {
            method.authorized = true;
            method.id = matchedMethod.id;
          } else {
            method.authorized = false;
            method.id = null;
          }
        });

        console.log('Country payment methods:', this.selectedCountryPaymentMethods);
        console.log('Always visible payment methods after matching:', this.alwaysVisiblePaymentMethods);
      },
      (error: any) => {
        this.toastr.error('Erreur lors du chargement des méthodes de paiement.');
        console.log('Error fetching payment methods for country:', countryId, error);
      }
    );
  }

  redirectNewCountry() {
    this.router.navigate(['admin-panel/deliverable-country/create']);
  }

  authorizePaymentMethod(paymentMethodName: string) {
    console.log('Attempting to authorize payment method:', paymentMethodName);

    const paymentMethod = this.alwaysVisiblePaymentMethods.find(
      (pm) => pm.name.toLowerCase() === paymentMethodName.toLowerCase()
    );

    if (!paymentMethod) {
      console.log('Payment method not found in alwaysVisiblePaymentMethods:', paymentMethodName);
      return;
    }

    if (paymentMethod.id === null) {
      this.crudComponentService.getPaymentMethodIdByName(paymentMethodName).subscribe(
        (response: any) => {
          console.log(response.body + "HEROOR")
          paymentMethod.id = response.body.id;

          if (this.selectedCountryId && paymentMethod.id !== null) {
            this.crudComponentService.authorizePaymentMethod(this.selectedCountryId, paymentMethod.id).subscribe(
              (response: any) => {
                this.toastr.success("Méthode de paiement autorisée avec succès!");
                this.getCountryPaymentMethods(this.selectedCountryId);
              },
              (error: any) => {
                this.toastr.error("Erreur lors de l'autorisation de la méthode de paiement.");
                console.log('Error authorizing payment method:', error);
              }
            );
          } else {
            console.log('Cannot authorize payment method:', paymentMethodName, 'Country ID or Payment Method ID is missing.');
          }
        },
        (error: any) => {
          this.toastr.error("Erreur lors de la récupération de l'ID de la méthode de paiement.");
          console.log('Error fetching payment method ID:', error);
        }
      );
    } else {
      if (this.selectedCountryId && paymentMethod.id !== null) {
        this.crudComponentService.authorizePaymentMethod(this.selectedCountryId, paymentMethod.id).subscribe(
          (response: any) => {
            this.toastr.success("Méthode de paiement autorisée avec succès!");
            this.getCountryPaymentMethods(this.selectedCountryId); // Refresh the payment methods list
          },
          (error: any) => {
            this.toastr.error("Erreur lors de l'autorisation de la méthode de paiement.");
            console.log('Error authorizing payment method:', error);
          }
        );
      } else {
        console.log('Cannot authorize payment method:', paymentMethodName, 'Country ID or Payment Method ID is missing.');
      }
    }
  }
  deletePaymentMethod(paymentMethodName: string) {
    console.log('Attempting to deauthorize payment method:', paymentMethodName);

    const paymentMethod = this.alwaysVisiblePaymentMethods.find(
      (pm) => pm.name.toLowerCase() === paymentMethodName.toLowerCase()
    );

    if (!paymentMethod) {
      console.log('Payment method not found in alwaysVisiblePaymentMethods:', paymentMethodName);
      return;
    }

    if (this.selectedCountryId && paymentMethod.id !== null) {
      this.crudComponentService.deletePaymentMethod(this.selectedCountryId, paymentMethod.id).subscribe(
        (response: any) => {
          this.toastr.success("Méthode de paiement désactivée avec succès!");
          this.getCountryPaymentMethods(this.selectedCountryId);
        },
        (error: any) => {
          this.toastr.error('Erreur lors de la désactivation de la méthode de paiement.');
          console.log('Error deauthorizing payment method:', error);
        }
      );
    } else {
      console.log('Cannot deauthorize payment method:', paymentMethodName, 'Country ID or Payment Method ID is missing.');
    }
  }
}
