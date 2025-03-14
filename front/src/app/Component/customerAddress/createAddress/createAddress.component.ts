import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from "@angular/material/button";
import { NgClass, NgForOf, NgIf, NgStyle } from "@angular/common";
import { MatDivider } from "@angular/material/divider";
import { ToastrService } from "ngx-toastr";
import { ErrorHandlerService } from '../../../Services/Error-Handler/error-handler.service';
import {CRUDUsersAdminService} from "../../../Services/DATA-Service/CRUD-users-admin-service/crud-users-admin.service";
import {User} from "../../../Interface/user.interface";

@Component({
  selector: 'app-create-address',
  standalone: true,
  imports: [
    MatButtonModule,
    NgStyle,
    NgForOf,
    NgIf,
    NgClass,
    ReactiveFormsModule,
    MatDivider,
  ],
  templateUrl: './createAddress.component.html',
  styleUrls: ['./createAddress.component.css']
})
export class UserNewAddress implements OnInit {

  user: User = {
    id: '',
    displayName: '',
    email: '',
    password: '',
    userProfile: []
  };

  addressForm!: FormGroup;

  constructor(
    private crudUserService: CRUDUsersAdminService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private errorHandler: ErrorHandlerService,
  ) { }

  ngOnInit() {
    this.initForm();
    this.getAuthenticatedCustomer();
  }

  getAuthenticatedCustomer() {
    this.crudUserService.getAthenticateUser().subscribe(
      data => {
        if (data && data.body) {
          this.user.id = data.body.id || '';
          this.user.displayName = data.body.displayName || '';
          this.user.email = data.body.email || '';
          this.user.userProfile = data.body.userProfile || [];
        }
      },
      error => {
        this.router.navigate(['/']);
      }
    )
  }

  initForm() {
    this.addressForm = this.fb.group({
      address: ['', [Validators.required, Validators.minLength(5)]],
      zipcode: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]],
      city: ['', Validators.required],
      country: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      phone_number: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      billing_address: ['', [Validators.required, Validators.minLength(5)]],
      isActive: [false]
    });
  }

  onSubmit() {
    if (this.addressForm.invalid) {
      this.toastr.error('S\'il vous plaît remplissez tous les champs nécessaires.');
      return;
    }

    const newUserProfile = this.addressForm.value;

    // @ts-ignore
    this.crudUserService.newCustomerProfile(Number(this.user.id), newUserProfile).subscribe(
      (response) => {
        this.toastr.success('Nouvelle adresse crée avec succès!');
        this.router.navigate(['/mon-compte']);
      },
      (error) => {
        this.errorHandler.handleError(error, 'Error creating the new address.');
        console.log(error, "error creating the new address.")
      }
    );
  }

  redirectToUserProfile() {
    this.router.navigate(['/mon-compte'])
  }
}
