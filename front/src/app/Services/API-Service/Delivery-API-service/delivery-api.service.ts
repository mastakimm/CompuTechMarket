import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DeliveryApiService {

  private apiUrl = 'https://epicareer.epidoc.eu/api';
  constructor(private http: HttpClient) { }

  get(endpoint: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${endpoint}`, { withCredentials: false, observe: 'response' });
  }

  post(endpoint: string, data?: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'accept': '*/*',
    });

    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, data, { headers, observe: 'response',withCredentials: false  });
  }
}
