import { Component, OnInit } from '@angular/core';
import {CurrencyPipe, DatePipe, NgForOf} from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { DeliveryService } from "../../../Services/DATA-Service/Delivery-service/delivery.service";

@Component({
  selector: 'app-suivi-livraison',
  standalone: true,
  imports: [
    DatePipe,
    CurrencyPipe,
    NgForOf
  ],
  templateUrl: './suivi-livraison.component.html',
  styleUrls: ['./suivi-livraison.component.css']
})
export class SuiviLivraisonComponent implements OnInit {

  data: any = {};
  status: string = '';
  createdAt: string = '';
  from: string = '';
  to: string = '';
  package: any[] = [];
  price: any = {};
  estimatedTravelTime: string = '';
  logs: any[] = [];
  trackingLink: string = '';
  public loading : boolean = true;

  public idDelivery: string | null | undefined;

  constructor(private router: Router, private route: ActivatedRoute, private deliveryService: DeliveryService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.idDelivery = params.get('idDelivery');
    });

    this.deliveryService.getCommandStatus(this.idDelivery).subscribe(
      response => {
        this.data = response.body.data;


        this.status = this.data.status;
        this.createdAt = this.data.createdAt;
        this.from = this.data.from;
        this.to = this.data.to;
        this.package = this.data.package;
        this.price = this.data.price;
        this.estimatedTravelTime = this.data.estimatedTravelTime;
        this.logs = this.data.logs;
        this.trackingLink = this.data.trackingLink;
        this.loading = false;
      },
      error => {
        console.log(error);
      }
    );
  }

  redirectBack() {
    this.router.navigate(['/historique']);
  }
}
