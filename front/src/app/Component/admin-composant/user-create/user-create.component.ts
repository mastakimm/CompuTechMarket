import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgForOf, NgIf } from "@angular/common";
import { Router } from "@angular/router";
import { MatInput } from "@angular/material/input";
import { CRUDUsersAdminService } from "../../../Services/DATA-Service/CRUD-users-admin-service/crud-users-admin.service";
import {ToastrService} from "ngx-toastr";
import {ErrorHandlerService} from "../../../Services/Error-Handler/error-handler.service";

@Component({
  selector: 'app-new-user-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    MatInput,
    NgIf
  ],
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent {
  productForm: FormGroup;
  public errorMsg: string = "";
  public emailRegex:RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  public passwordRegex:RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


  constructor(
    private fb: FormBuilder,
    private CrudUserService: CRUDUsersAdminService,
    private router: Router,
    private toastr: ToastrService,
    private errorHandler: ErrorHandlerService,
  ) {
    this.productForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required],
    });
  }

  createUser() {
    const { username, email, password, passwordConfirmation } = this.productForm.value;


    if (!this.passwordRegex.test(<string>password) && password?.length >= 8) {
      this.errorMsg = "Mot de passe invalid.";
      return;
    }

    if (!this.emailRegex.test(<string>email)) {
      this.errorMsg = "Adresse email invalide.";
      return;
    }

    if (password !== passwordConfirmation) {
      this.errorMsg = "Les mots de passe ne correspondent pas.";
      return;
    }


    const data = {
      displayName: username,
      email: email,
      password: password,
    };


    this.CrudUserService.creatUser(data).subscribe(
      (response: any) => {
        this.router.navigate(['/admin-panel/users/']);
        this.toastr.success('Utilisateur créé avec succès !')
      },
      (error: any) => {
        this.errorHandler.handleError(error, 'Erreur lors de la suppression du produit.');

        console.error('Error adding user', error);
      }
    );
  }
}
