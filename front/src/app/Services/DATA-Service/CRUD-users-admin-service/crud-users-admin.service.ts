import { Injectable } from '@angular/core';
import {ApiService} from "../../API-Service/api.service";
import {Observable} from "rxjs";
import {User} from "../../../Interface/user.interface";
import {data} from "autoprefixer";

@Injectable({
  providedIn: 'root'
})


export class CRUDUsersAdminService {

  constructor(private apiService: ApiService) { }

  public response = "";

  getAllUsers(): Observable<any> {
   return this.apiService.get('customer');
  }

  creatUser(data: any): Observable<any> {
    return this.apiService.post('admin/customer/create', data);
  }

  getUserById(id: string | null){
    return this.apiService.get(`customer/${id}`);
  }

  updateCurrentUser(user: User): Observable<any> {
    return this.apiService.patch(`customer/update`, user);
  }

  updateUser(id: string | null, updatedUser: any){

  this.apiService.patch(`admin/customer/update/${id}`, updatedUser).subscribe(data => {
      console.log(data)
    },
    error => {
      console.error(error);
    });
  }

  getAllRoles() {
    return this.apiService.get("admin/customer/roles")
  }

  deletUser(id: string | null){
    return this.apiService.delete(`customer/${id}`);
  }

  getAthenticateUser(){
    return this.apiService.get('customer/');
  }

  unlogUser(){
    return this.apiService.post('auth/kill');
  }


  /*        Customer Profile        */
  getCustomerProfilesByCustomerId(customerId: number | null){
    return this.apiService.get(`userProfile/customer/${customerId}`);
  }

  getCustomerProfileById(userProfileId: string) {
    return this.apiService.get(`userProfile/${userProfileId}`)
  }

  newCustomerProfile(customerId: number | null, userProfileData: any){
    return this.apiService.post(`userProfile/${customerId}`, userProfileData);
  }

  updateCustomerProfile(customerId: number | null | undefined, customerProfileId: number | null | undefined, userProfileData: any){
    return this.apiService.put(`userProfile/${customerId}/${customerProfileId}`, userProfileData);
  }

  deleteCustomerProfile(userProfileId: number | null) {
    return this.apiService.delete(`userProfile/${userProfileId}`);
  }

  getDeliveryByCountry(name:string){
    return this.apiService.get(`admin/country/name/${name}`)
  }
}
