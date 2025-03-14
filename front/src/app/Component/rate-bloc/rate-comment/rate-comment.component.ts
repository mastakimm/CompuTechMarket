import { Component, OnInit } from '@angular/core';
import { ReviewService } from "../../../Services/DATA-Service/review-service/review.service";
import { ActivatedRoute } from "@angular/router";
import {NgForOf, NgSwitch, NgSwitchCase} from "@angular/common";

@Component({
  selector: 'app-rate-comment',
  templateUrl: './rate-comment.component.html',
  standalone: true,
  imports: [
    NgSwitch,
    NgForOf,
    NgSwitchCase
  ],
  styleUrls: ['./rate-comment.component.css']
})
export class RateCommentComponent implements OnInit {

  public productId: string | null = '';
  public reviews: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('productId');
      if (this.productId) {
        this.loadReviews(this.productId);
      }
    });
  }

  loadReviews(productId: string) {
    this.reviewService.getProductReviewWithProductId(productId).subscribe(
      data => {
        console.log(data);
        this.reviews = data.body;
      },
      error => {
        console.error("Error fetching reviews:", error);
      }
    );
  }

  getStarArray(stars: number): any[] {
    const fullStars = Math.floor(stars);
    const halfStar = stars % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return [
      ...Array(fullStars).fill('full'),
      ...(halfStar ? ['half'] : []),
      ...Array(emptyStars).fill('empty')
    ];
  }
}
