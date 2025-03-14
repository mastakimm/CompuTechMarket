import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgForOf, NgIf } from "@angular/common";
import { Router } from "@angular/router";
import { MatInput } from "@angular/material/input";
import {ToastrService} from "ngx-toastr";
import {ErrorHandlerService} from "../../../Services/Error-Handler/error-handler.service";
import {CrudComponentService} from "../../../Services/DATA-Service/CRUD-product-service/crud-component.service";

@Component({
  selector: 'app-deliverable-country-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    MatInput,
    NgIf
  ],
  templateUrl: './deliverable-country-create.component.html',
  styleUrls: ['./deliverable-country-create.component.css']
})
export class DeliverableCountryCreateComponent {
  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private crudComponentService: CrudComponentService,
    private router: Router,
    private toastr: ToastrService,
    private errorHandler: ErrorHandlerService,
  ) {
    this.productForm = this.fb.group({
      countryName: ['', Validators.required]
    });
  }

  createDeliverableCountry() {
    const { countryName } = this.productForm.value;

    const data = {
      countryName: countryName.toLowerCase()
    };

    this.crudComponentService.createDeliverableCountry(data).subscribe(
      (response: any) => {
        this.router.navigate(['/admin-panel/delivery-fees']);
        this.toastr.success('Pays livrable créé avec succès !')
      },
      (error: any) => {
        this.errorHandler.handleError(error, 'Erreur lors de la création du pays livrable.');

        console.error('Error adding country', error);
      }
    );
  }
}
