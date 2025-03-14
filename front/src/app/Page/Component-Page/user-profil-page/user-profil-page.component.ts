import { Component, OnInit } from '@angular/core';
import { CRUDUsersAdminService } from "../../../Services/DATA-Service/CRUD-users-admin-service/crud-users-admin.service";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { NgClass, NgForOf } from "@angular/common";
import { MatDivider } from "@angular/material/divider";
import { MatDialog } from '@angular/material/dialog';
import { User } from "../../../Interface/user.interface";
import {SuccessDialogComponent} from "../../../Component/dialogs/success-dialog/dialog.component";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-user-profil-page',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    MatDivider,
    NgForOf
  ],
  templateUrl: './user-profil-page.component.html',
  styleUrls: ['./user-profil-page.component.css']
})
export class UserProfilPageComponent implements OnInit {

  user: User = {
    id: '',
    displayName: '',
    email: '',
    password: '',
    userProfile: []
  };

  originalUser: User = {
    id: '',
    displayName: '',
    email: '',
    password: '',
    userProfile: []
  };

  confirmPassword = '';
  isEditing = false;

  constructor(
    private userService: CRUDUsersAdminService,
    private router: Router,
    private dialog: MatDialog,
    private tostr: ToastrService,
  ) {}

  ngOnInit() {
    this.getAuthenticatedCustomer();
  }

  getAuthenticatedCustomer() {
    this.userService.getAthenticateUser().subscribe(
      data => {
        if (data && data.body) {
          this.user.id = data.body.id || '';
          this.user.displayName = data.body.displayName || '';
          this.user.email = data.body.email || '';
          this.user.userProfile = data.body.userProfile || [];

          this.originalUser = { ...this.user };
        }
      },
      error => {
        this.router.navigate(['/']);
      }
    )
  }

  editProfile() {
    if (this.isEditing) {
      if (
        this.user.displayName === this.originalUser.displayName &&
        this.user.email === this.originalUser.email &&
        this.user.password === this.originalUser.password &&
        this.user.userProfile === this.originalUser.userProfile
      ) {
        this.isEditing = false;
        return;
      }

      if (this.user.password !== this.confirmPassword) {
        alert("Les mots de passe ne correspondent pas !");
        return;
      }

      this.userService.updateCurrentUser(this.user).subscribe(
        () => {
          this.isEditing = false;

          if (this.user.password !== this.originalUser.password) {
            this.dialog.open(SuccessDialogComponent, {
              data: {
                title: "Mot de passe modifié",
                message: "Votre mot de passe a été modifié avec succès. Veuillez vous reconnecter."
              }
            }).afterClosed().subscribe(() => {
              this.unlog();
              this.router.navigate(['/login']);
            });
          } else if (this.user.email !== this.originalUser.email) {
            this.dialog.open(SuccessDialogComponent, {
              data: {
                title: "Changement d'adresse email",
                message: "Votre email a été modifié avec succès. Veuillez vérifier votre nouvelle adresse email pour un code de vérification."
              }
            }).afterClosed().subscribe(() => {
              this.router.navigate(['/authentification'], { queryParams: { email: this.user.email } });
            });
          } else {
            this.tostr.success("Profil mis à jour avec succès.");
          }
        },
        error => {
          console.error("Erreur lors de la mise à jour du profil", error);
          this.tostr.error("Erreur lors de la mise à jour du profil.");
        }
      );
    } else {
      this.isEditing = true;
    }
  }

  unlog(){
    this.userService.unlogUser().subscribe(
      data=>{
        this.router.navigate(['/']);
      },
      error=>{
        console.log(error);
        window.location.reload();
        this.router.navigate(['/']);
      }
    )
  }

  historiqueRedirect(){
    this.router.navigate(['/historique']);
  }

  paiementModeRedirect(){
    this.router.navigate(['/paiement-mode']);
  }

  redirectToCreateNewAddress() {
    this.router.navigate(['/nouvelle-adresse']);
  }

  redirectToEditAdress(adressId: string) {
    this.router.navigate([`/adresse-edition/${adressId}`]);
  }
}
