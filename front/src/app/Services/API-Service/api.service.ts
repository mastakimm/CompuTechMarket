import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  get(endpoint: string, body?: any): Observable<any> {
    const options = {
      withCredentials: true,
      observe: 'response' as const,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: body ? JSON.stringify(body) : null,
    };

    return this.http.request('GET', `${this.apiUrl}/${endpoint}`, options);
  }

  delete(endpoint: string, data?: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'accept': '*/*',
    });

    const options = {
      headers: headers,
      withCredentials: true,
      observe: 'response' as 'response',
      body: data
    };

    return this.http.delete(`${this.apiUrl}/${endpoint}`, options);
  }


  post(endpoint: string, data?: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'accept': '*/*',
    });

    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, data, { headers, observe: 'response',withCredentials: true  });
  }

  postFormData(endpoint: string, data?: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data',
      'Accept': 'multipart/form-data',
      'accept': '*/*',
    });

    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, data, { headers, observe: 'response',withCredentials: true  });
  }

  patch(endpoint: string, data?: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'accept': '*/*',
    });

    return this.http.patch<any>(`${this.apiUrl}/${endpoint}`, data, { headers, observe: 'response',withCredentials: true  });
  }

  put(endpoint: string, data?: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'accept': '*/*',
    });

    return this.http.put<any>(`${this.apiUrl}/${endpoint}`, data, { headers, observe: 'response',withCredentials: true  });
  }
}
