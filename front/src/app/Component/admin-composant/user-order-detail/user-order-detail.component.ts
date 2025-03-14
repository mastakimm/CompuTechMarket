import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CRUDUsersAdminService} from "../../../Services/DATA-Service/CRUD-users-admin-service/crud-users-admin.service";
import {ToastrService} from "ngx-toastr";
import {ErrorHandlerService} from "../../../Services/Error-Handler/error-handler.service";


@Component({
  selector: 'app-user-order-detail',
  standalone: true,
  imports: [],
  templateUrl: './user-order-detail.component.html',
  styleUrl: './user-order-detail.component.css'
})
export class UserOrderDetailComponent implements OnInit{

  constructor(
    private route: ActivatedRoute,
    private crudUserService: CRUDUsersAdminService,
    private router: Router,
    private errorHandler: ErrorHandlerService,
  ) {}


  public userId: string | null = '';
  public email: string | null = '';
  public name: string | null = '';

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');});

    this.crudUserService.getUserById(this.userId).subscribe(
      data => {
        this.email = data.body.email;
        this.name = data.body.displayName;
      },
      error => {
        this.errorHandler.handleError(error, 'Erreur lors ddu chargement de l\'utilisateur.')

        console.error(error);
      }
    )
  }

  goBack(){
    this.router.navigate([`/admin-panel/users/detail/${this.userId}`]);
  }
}
