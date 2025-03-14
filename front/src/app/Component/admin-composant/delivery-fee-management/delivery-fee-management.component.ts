import { Component } from '@angular/core';
import {NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ErrorHandlerService } from "../../../Services/Error-Handler/error-handler.service";
import { CrudComponentService } from "../../../Services/DATA-Service/CRUD-product-service/crud-component.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-delivery-fee-management',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    TitleCasePipe,
    FormsModule
  ],
  templateUrl: './delivery-fee-management.component.html',
  styleUrls: ['./delivery-fee-management.component.css']
})
export class DeliveryFeeManagementComponent {
  countries: Array<{ id: number, name: string }> = [];
  selectedCountryId: number | null = null;
  selectedCountryFees: Array<{ deliveryMethod: string | null, deliverySpeed: string | null, feePercentage: string }> = [];

  constructor(
    private crudComponentService: CrudComponentService,
    private router: Router,
    private toastr: ToastrService,
    private errorHandler: ErrorHandlerService,
  ) {}

  ngOnInit() {
    this.getDeliverableCountries();
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
      this.getCountryDeliveryDetails(this.selectedCountryId);
    }
  }

  getCountryDeliveryDetails(countryId: number | null) {
    this.crudComponentService.getDeliverableCountryById(countryId).subscribe(
      (response: any) => {
        this.selectedCountryFees = response.body.deliveryFees;

        console.log('Country delivery details:', response);
      },
      (error: any) => {
        this.toastr.error('Erreur lors du chargement du pays.');
        console.log('Error fetching country: ' + countryId);
      }
    );
  }

  updateFee(fee: any) {

    // TODO

    console.log('Updated fee:', fee);
  }

  redirectNewCountry() {
    this.router.navigate(['admin-panel/deliverable-country/create']);
  }

  updateDeliveryMethodFee(id: number | null, fee: {
    deliveryMethod: string | null;
    deliverySpeed: string | null;
    feePercentage: string
  }) {
    console.log("COUNTRY ID: " + id)

    this.crudComponentService.updateDeliveryMethodFee(id, fee).subscribe(
      (response: any) => {
        this.toastr.success("Frais de livraison édités avec succès!")
      },
      (error: any) => {
        this.toastr.error('Erreur lors de l\'édition des frais de livraison.');
        console.log('Error updating delivery fees');
      }
    )
  }

  updateDeliverySpeedFee(id: number | null, fee: {
    deliveryMethod: string | null;
    deliverySpeed: string | null;
    feePercentage: string
  }) {
    this.crudComponentService.updateDeliverySpeedFee(id, fee).subscribe(
      (response: any) => {
        this.toastr.success("Frais de livraison édités avec succès!")

        console.log(response.body)
      },
      (error: any) => {
        this.toastr.error('Erreur lors de l\'édition des frais de livraison.');
        console.log('Error updating delivery fees');
      }
    )
  }
}
