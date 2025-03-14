import { Injectable } from '@angular/core';
import {ApiService} from "../../API-Service/api.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private apiService: ApiService) { }

  createReview(data: any): Observable<any> {
    return this.apiService.post('review/add', data);
  }
  getProductReviewWithProductId(id: string | null | undefined ): Observable<any> {
    return this.apiService.get(`review/${id}`);
  }

}
