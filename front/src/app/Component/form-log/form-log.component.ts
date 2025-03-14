import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../Services/API-Service/api.service';
import { Router } from '@angular/router';
import { UserInfoService } from "../../Services/DATA-Service/user-data-service/user-info.service";
import {CRUDUsersAdminService} from "../../Services/DATA-Service/CRUD-users-admin-service/crud-users-admin.service";
import {SuccessDialogComponent} from "../dialogs/success-dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-form-log',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatProgressSpinner,
  ],
  templateUrl: './form-log.component.html',
  styleUrls: ['./form-log.component.css']
})
export class FormLogComponent implements OnInit{
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';
  loading: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private userDataService: UserInfoService,
    private userService : CRUDUsersAdminService,
    private dialog: MatDialog
  ) { }

  public errorMsg: string = "";
  public emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  public passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  logForm = new FormGroup({
    email: new FormControl(""),
    password: new FormControl(""),
  });

  registerForm = new FormGroup({
    email: new FormControl(""),
    username: new FormControl(""),
    password: new FormControl(""),
    confirmPassword: new FormControl(""),
    acceptCGU: new FormControl(false, [Validators.requiredTrue])
  });

  forgetForm = new FormGroup({
    email: new FormControl(""),
  });

  ngOnInit() {
    this.userService.getAthenticateUser().subscribe(
      data=>{
        if(data){
          this.router.navigate(['/'])
        }
      },
      error=>{
        console.log(error);
      }
    )
  }

  sendFormLogin() {
    const email = this.logForm.value.email;
    const password = this.logForm.value.password;

    if (!this.emailRegex.test(<string>email)) {
      this.errorMsg = "Veuillez entrer un mail valide";
      return;
    }

    this.loading = true;

    const data = { email: email, password: password };

    this.apiService.post('auth/login', data).subscribe(
      data => {
        window.location.reload()
      },
      error => {
        const errorResponse = error.error.code;

        if (errorResponse === "EMAIL_NOT_VERIFIED") {
          const dataOTP = { email: email };
          this.apiService.post('auth/resend-otp', dataOTP).subscribe(
            data => {
              this.userDataService.setUserData(email);
              this.router.navigate(['/authentification']);
            },
            error => {
              console.log(error);
            }
          );
        } else if (errorResponse === "BAD_CREDENTIALS") {
          this.errorMsg = "Email ou mot de passe incorrect";
        } else {
          this.errorMsg = "Erreur réseau, veuillez réessayer";
          console.log("Error: " + JSON.stringify(error));
        }
      }
    );
  }

  sendFormRegister() {
    if (!this.registerForm.valid) {
      this.errorMsg = "Veuillez remplir correctement tous les champs requis";
      return;
    }
    const email = this.registerForm.value.email;
    const username = this.registerForm.value.username;
    const password = this.registerForm.value.password;

    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.errorMsg = "Les mots de passe ne correspondent pas";
      return;
    }

    if (!this.emailRegex.test(<string>email)) {
      this.errorMsg = "Adresse email invalide";
      return;
    }

    // @ts-ignore
    if (!this.passwordRegex.test(<string>password)) {
      this.errorMsg = "Mot de passe incorrect";
      return;
    }
    this.loading = true;
    const data = { email: email, password: password, displayName: username };
    this.apiService.post('auth/register', data).subscribe(
      data => {
        this.loading = false;
        this.router.navigate(['/authentification']);
        this.userDataService.setUserData(email);
      },
      error => {
        const errorResponse = error.error.code;

        if (errorResponse === "EMAIL_ALREADY_EXISTS") {
          this.errorMsg = "Cet email est déja enregistré";
        } else if (errorResponse === "VALIDATION_FAILED") {
          const metadata = error.error.metadata;
          if (metadata.password) {
            this.errorMsg = `erreur de mot de passe: ${metadata.password}`;
          } else {
            this.errorMsg = "Validation échoué, veuillez vérifier vos identifiants";
          }
        } else {

          this.errorMsg = "Erreur Réseau, Veuillez réessayer";
          console.log("Error: " + JSON.stringify(error));
        }
      }
    );
  }

  // Password visibility toggle methods
  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
  }

  // Handle form switch
  changeForm(input: any) {
    if (input === 1) {
      document.getElementsByClassName("formRegister")[0].classList.remove("hidden");
      document.getElementsByClassName("formLogin")[0].classList.add("hidden");
    } else {
      document.getElementsByClassName("formRegister")[0].classList.add("hidden");
      document.getElementsByClassName("formLogin")[0].classList.remove("hidden");
    }
  }

  forgetPasswordClick() {
    document.getElementsByClassName("formRegister")[0].classList.add("hidden");
    document.getElementsByClassName("formLogin")[0].classList.add("hidden");
    document.getElementsByClassName("formForget")[0].classList.remove("hidden");
  }

  sendFormForget() {
    const data = { email: this.forgetForm.value.email };
    this.apiService.post('auth/reset-password', data).subscribe(
      data => {
        this.dialog.open(SuccessDialogComponent, {
          data: {
            message: 'Email envoyé avec succès!'
          }
        });
      },
      error => {
        console.log("Error: " + JSON.stringify(error));
      }
    );
  }
}
