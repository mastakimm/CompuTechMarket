import { Injectable } from '@angular/core';
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  constructor( private cookieService: CookieService) {}

  private userEmail: string | undefined;
  public userLoged: boolean =false;
  private userDeliveryData: any;

  setUserData(data: any): void {
    this.userEmail = data;
  }

  getData(): any {
    return this.userEmail;
  }

  checkCookie(){

    const cookieTimeStamp = this.cookieService.get('expiredName');
  }

  setUserDeliveryInfo(data:any){
    this.userDeliveryData = data;
  }

  getUserDeliveryInfo(){
   return this.userDeliveryData;
  }

}
