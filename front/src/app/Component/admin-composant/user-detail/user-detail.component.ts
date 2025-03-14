import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CRUDUsersAdminService} from "../../../Services/DATA-Service/CRUD-users-admin-service/crud-users-admin.service";
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {MatDivider} from "@angular/material/divider";
import {ToastrService} from "ngx-toastr";
import {ErrorHandlerService} from "../../../Services/Error-Handler/error-handler.service";
import {ConfirmationDialogComponent} from "../../dialogs/confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {data} from "autoprefixer";
import {Observable} from "rxjs";

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    MatDivider,
    NgForOf
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent implements OnInit {
  userId: string | null = '';
  public email: string | null = '';
  public name: string | null = '';
  public showButtonSave: boolean = false;
  public errorMsg: string | null = null;
  public roles: any[] = [];
  public selectedRole: string | null = null;


  public emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  constructor(
    private route: ActivatedRoute,
    private crudUserService: CRUDUsersAdminService,
    private router: Router,
    private toastr: ToastrService,
    private errorHandler: ErrorHandlerService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
    });

    this.getUserById()
    this.getAllRoles();
  }

  getUserById() {
    this.crudUserService.getUserById(this.userId).subscribe(
      data => {
        this.email = data.body.email;
        this.name = data.body.displayName;

        if (data.body.roles && data.body.roles.length > 0) {
          this.selectedRole = data.body.roles[0].name;
        }
      },
      error => {
        this.errorHandler.handleError(error, 'Erreur lors du chargement de l\'utilisateur.');

        console.error(error);
      }
    );
  }

  onEditClickUnlock() {
    this.showButtonSave = true;

    const inputs = document.querySelectorAll('input');
    const selects = document.querySelectorAll('select');

    inputs.forEach(input => {
      input.classList.remove('cursor-not-allowed');
      input.classList.add('placeholder-black');
      input.style.background = "white";
      input.style.color = "black";
      input.disabled = false;
    });

    selects.forEach(select => {
      select.classList.remove('cursor-not-allowed');
      select.style.background = "white";
      select.style.color = "black";
      select.disabled = false;
    });
  }

  onCancelEdit() {
    this.showButtonSave = false;

    const inputs = document.querySelectorAll('input');
    const selects = document.querySelectorAll('select');

    inputs.forEach(input => {
      input.classList.add('cursor-not-allowed');
      input.classList.remove('placeholder-black');
      input.style.background = "rgb(243, 244, 246)";
      input.style.color = "rgb(75, 85, 99)";
      input.disabled = true;
    });

    selects.forEach(select => {
      select.classList.add('cursor-not-allowed');
      select.style.background = "rgb(243, 244, 246)";
      select.style.color = "rgb(75, 85, 99)";
      select.disabled = true;
    });

    this.showButtonSave = false;
  }

  updateUserInfo() {
    this.showButtonSave = false;
    const inputs = document.querySelectorAll('input');

    if (!this.emailRegex.test(<string>this.email)) {
      this.errorMsg = "Adresse email invalide.";
      return;
    }

    const updatedUser = {
      email: this.email,
      name: this.name,
      role: [
          { name: this.selectedRole }
        ]
    };

    this.crudUserService.updateUser(this.userId, updatedUser);
  }

  deleteUser() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      height: '300px',
      data: {
        title: 'Confirmation de suppression',
        message: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.crudUserService.deletUser(this.userId).subscribe(
          data => {
            this.router.navigate([`/admin-panel/users`]);

            this.toastr.success('Utilisateur supprimé avec succès!')
          },
          error => {
            this.errorHandler.handleError('Erreur lors de la suppression de l\'utilisateur.');
          }
        );
      }
    })
  }

  getAllRoles() {
    this.crudUserService.getAllRoles().subscribe(
      data => {
        this.roles = data.body.filter((role: any) => role.name);
        console.log(this.roles +  "ROLES")
      },
      error => {
        this.errorHandler.handleError(error, 'Erreur lors du chargement de l\'utilisateur.');

        console.error(error);
      }
    );
  }

  redirectToOrder() {
    this.router.navigate([`/admin-panel/users/detail/${this.userId}/order`]);
  }
}
