import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator } from '@angular/material/paginator';
import { CRUDUsersAdminService } from "../../../Services/DATA-Service/CRUD-users-admin-service/crud-users-admin.service";
import { Router } from '@angular/router';
import { AdminSearchBarUsersComponent } from "../admin-search-bar-users/admin-search-bar-users.component";
import { ErrorHandlerService } from "../../../Services/Error-Handler/error-handler.service";
import {NgClass, NgIf} from "@angular/common";

export interface UserData {
  id: number;
  nom: string;
  email: string;
  nombre_achats: number;
}

@Component({
  selector: 'app-user-display',
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    AdminSearchBarUsersComponent,
    MatPaginator,
    NgIf,
    NgClass,
  ],
  templateUrl: './user-display.component.html',
  styleUrls: ['./user-display.component.css']
})
export class UserDisplayComponent implements OnInit {

  constructor(
    private crudUserService: CRUDUsersAdminService,
    private router: Router,
    private errorHandler: ErrorHandlerService,
  ) {}

  displayedColumns: string[] = ['name', 'email', 'nombre_achat'];
  dataSource: UserData[] = [];
  filteredUsers: UserData[] = [];
  paginatedUsers: UserData[] = [];
  pageSize: number = 10;
  currentPage: number = 0;

  @ViewChild(MatTable) table: MatTable<UserData> | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  ngOnInit() {
    this.crudUserService.getAllUsers().subscribe(
      data => {
        this.dataSource = data.body.map((user: any) => ({
          id: user.id,
          nom: user.displayName,
          email: user.email,
          nombre_achats: 1
        }));
        this.applyFilters();
      },
      error => {
        this.errorHandler.handleError(error, 'Erreur lors du chargement des utilisateurs.');
        console.error(error);
      }
    );
  }

  applyFilters(): void {
    this.filteredUsers = [...this.dataSource];
    this.currentPage = 0;
    if (this.paginator) {
      this.paginator.length = this.filteredUsers.length;
      this.paginator.firstPage();
    }
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);

    const emptyRows = this.pageSize - this.paginatedUsers.length;
    for (let i = 0; i < emptyRows; i++) {
      this.paginatedUsers.push({ id: 0, nom: '', email: '' } as UserData);
    }

    if (this.table) {
      this.table.renderRows();
    }
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  onClickedUser(row: any): void {
    this.router.navigate([`/admin-panel/users/${row.id}`]);
  }

  redirectNewUser(): void {
    this.router.navigate([`/admin-panel/users/create`]);
  }
}
