import { Injectable } from '@angular/core';
import {ApiService} from "../../API-Service/api.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HistoryServiceService {

  constructor(private apiService: ApiService) { }

  getUserHistory(id: string | null){
    return this.apiService.get(`historic/user/${id}`);
  }
  getCommandById(id: string | null){
    return this.apiService.get(`historic/command/${id}`);
  }
  getAllCommands(){
    return this.apiService.get('historic/all');
  }
  creatHistory(data: any): Observable<any> {
    return this.apiService.post('historic/create-historic', data);
  }

}
