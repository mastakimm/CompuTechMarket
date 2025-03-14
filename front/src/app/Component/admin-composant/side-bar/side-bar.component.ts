import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ApiService } from "../../../Services/API-Service/api.service";
import {NgClass, NgIf} from "@angular/common";
import { LogoutSvgComponent } from "../../../../assets/admin/logout-svg/logout-svg.component";

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
    LogoutSvgComponent,
    NgIf
  ],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent {
  sidebarOpen = false;

  constructor(private apiService: ApiService, private router: Router, private route: ActivatedRoute) {}

  logout() {
    this.apiService.post('auth/logout').subscribe(
      data => {
        this.router.navigate(['/']);
      },
      error => {
        console.log("Error: " + JSON.stringify(error));
      }
    );
  }

  isRouteActive(routes: string[]): boolean {
    return routes.some(route => this.router.url.includes(route));
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }
}
