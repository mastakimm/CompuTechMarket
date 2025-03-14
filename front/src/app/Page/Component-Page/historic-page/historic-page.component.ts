import {Component, OnInit} from '@angular/core';
import {HistoriqueCardComponent} from "../../../Component/historique-card/historique-card.component";
import {ActivatedRoute, Router} from "@angular/router";
import {UserInfoService} from "../../../Services/DATA-Service/user-data-service/user-info.service";
import {CRUDUsersAdminService} from "../../../Services/DATA-Service/CRUD-users-admin-service/crud-users-admin.service";
import {HistoryServiceService} from "../../../Services/DATA-Service/history-service/history-service.service";
import {empty, isEmpty} from "rxjs";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-historic-page',
  standalone: true,
  imports: [
    HistoriqueCardComponent,
    NgForOf,

  ],
  templateUrl: './historic-page.component.html',
  styleUrl: './historic-page.component.css'
})
export class HistoricPageComponent implements OnInit{
  public allHistory: any = [[]];
  public userid: any ;

  constructor(
    private route: ActivatedRoute,
    private userService: CRUDUsersAdminService,
    private historyService: HistoryServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserId()
  }

  getUserId(){
    this.userService.getAthenticateUser().subscribe(
      data => {
        this.userid = data.body.id
        this.getHistory(this.userid)
      },
      error => {
        this.router.navigate(['/']);
      }
    )

  }


  getHistory(id: string | null){
    this.historyService.getUserHistory(id).subscribe(
      data => {
        this.filterCommand(data.body)
      },
      error => {
        console.log(error)
      }
    )
  }


  filterCommand(his: any[]) {

    this.allHistory = [];
    let commandIndex = 0;

    for (let i = 0; i < his.length; i++) {
      let order = his[i].orderId;


      if (i === 0 || order !== his[i - 1].orderId) {

        this.allHistory.push([]);
        commandIndex = this.allHistory.length - 1;
      }


      this.allHistory[commandIndex].push(his[i]);
      this.allHistory.reverse()
    }
  }

  redirectBack(){
    this.router.navigate([`/mon-compte`] )
  }
}
