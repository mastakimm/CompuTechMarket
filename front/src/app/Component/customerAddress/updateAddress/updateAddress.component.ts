import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { MatButtonModule } from "@angular/material/button";
import { NgClass, NgForOf, NgIf, NgStyle } from "@angular/common";
import { MatDivider } from "@angular/material/divider";
import { ToastrService } from "ngx-toastr";
import { ErrorHandlerService } from '../../../Services/Error-Handler/error-handler.service';
import {CRUDUsersAdminService} from "../../../Services/DATA-Service/CRUD-users-admin-service/crud-users-admin.service";
import {User} from "../../../Interface/user.interface";
import {data} from "autoprefixer";

@Component({
  selector: 'app-update-address',
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
  templateUrl: './updateAddress.component.html',
  styleUrls: ['./updateAddress.component.css']
})
export class UserUpdateAddress implements OnInit {

  userProfileId: string | null | undefined;
  userProfile: any | undefined;

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
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private errorHandler: ErrorHandlerService,
  ) { }

  ngOnInit() {
    this.initForm();
    this.getAuthenticatedCustomer();

    this.userProfileId = this.route.snapshot.paramMap.get('id');

    if (this.userProfileId) {
      this.loadUserProfile(this.userProfileId);
    }
  }

  loadUserProfile(userProfileId: string): void {
    this.crudUserService.getCustomerProfileById(userProfileId).subscribe(
      data => {
        this.userProfile = data.body;
        console.log(data)

        if (this.userProfile) {
          this.addressForm.patchValue({
            address: this.userProfile.address,
            billing_address: this.userProfile.billing_address,
            zipcode: this.userProfile.zipcode,
            city: this.userProfile.city,
            country: this.userProfile.country,
            firstname: this.userProfile.firstname,
            lastname: this.userProfile.lastname,
            phone_number: this.userProfile.phone_number,
            isActive: this.userProfile.isActive || false
          });
        }
      },
      error => {
        this.errorHandler.handleError(error, 'Error fetching user profile.');
      }
    )
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
      billing_address: ['', [Validators.required, Validators.minLength(5)]],
      phone_number: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      isActive: [false]
    });
  }

  onSubmit() {
    console.log("toto")
    if (this.addressForm.invalid) {
      this.toastr.error('S\'il vous plaît remplissez tous les champs nécessaires.');
      return;
    }

    const updatedUserProfile = this.addressForm.value;

    const userIdNumber = parseInt(this.user.id) ;
    let userProfileIdNumber;

    if (typeof this.userProfileId === "string") {
       userProfileIdNumber = parseInt(this.userProfileId);
    }

    this.crudUserService.updateCustomerProfile(userIdNumber, userProfileIdNumber, updatedUserProfile).subscribe(
      (response) => {
        this.toastr.success('Adresse mise à jour avec succès!');
        this.router.navigate(['/mon-compte']);
        console.log(response)
      },
      (error) => {
        this.errorHandler.handleError(error, 'Error updating the address.');
        console.log(error, "error updating the address.")
      }
    );
  }

  redirectToUserProfile() {
    this.router.navigate(['/mon-compte'])
  }
}
