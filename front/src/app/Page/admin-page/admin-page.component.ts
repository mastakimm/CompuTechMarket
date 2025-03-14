import {Component, OnInit} from '@angular/core';
import { SideBarComponent} from "../../Component/admin-composant/side-bar/side-bar.component";
import {AdminSearchBarProductComponent} from "../../Component/admin-composant/admin-search-bar-product/admin-search-bar-product.component";
import {UserDisplayComponent } from "../../Component/admin-composant/user-display/user-display.component";
import { UserDetailComponent } from "../../Component/admin-composant/user-detail/user-detail.component";
import { UserOrderDetailComponent } from "../../Component/admin-composant/user-order-detail/user-order-detail.component";
import {ComponentDisplayComponent} from "../../Component/admin-composant/product-display/component-display.component";
import {Router, RouterOutlet} from "@angular/router";
import {ApiService} from "../../Services/API-Service/api.service";
import {UserInfoService} from "../../Services/DATA-Service/user-data-service/user-info.service";
import {CRUDUsersAdminService} from "../../Services/DATA-Service/CRUD-users-admin-service/crud-users-admin.service";

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [SideBarComponent, AdminSearchBarProductComponent, UserDisplayComponent, UserDetailComponent, UserOrderDetailComponent, ComponentDisplayComponent,  RouterOutlet],
  template: `
    <div class=" flex flex-row  ">
      <app-side-bar></app-side-bar>
      <div style="width: 100%;">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent implements OnInit {

  constructor( private router: Router, private userDataService : CRUDUsersAdminService) {}

  ngOnInit() {
    this.userDataService.getAthenticateUser().subscribe(
      data=>{
        console.log(data)
        if(!data.body.roles[0]){
          this.router.navigate(['/']);
          if(data.body.roles[0].name !=="admin"){
            this.router.navigate(['/']);
          }
        }

      },
      error=>{
        console.log(error);
        this.router.navigate(['/']);
      }
    )
  }
}
