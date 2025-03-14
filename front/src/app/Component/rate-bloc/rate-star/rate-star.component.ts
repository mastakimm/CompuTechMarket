import { Component, OnInit } from '@angular/core';
import { ProgressBarComponent } from "../rate-little-component/progress-bar/progress-bar.component";
import {NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { ReviewService } from "../../../Services/DATA-Service/review-service/review.service";

@Component({
  selector: 'app-rate-star',
  standalone: true,
  imports: [
    ProgressBarComponent,
    NgForOf,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault
  ],
  templateUrl: './rate-star.component.html',
  styleUrls: ['./rate-star.component.css']
})
export class RateStarComponent implements OnInit {
  public reviews: { stars: number }[] = [];

  productId: string | null = '';
  averageRating: number = 0;
  totalReviews: number = 0;
  starDistribution: number[] = [0, 0, 0, 0, 0];

  constructor(
    private route: ActivatedRoute,
    private reviewService: ReviewService,
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
        this.calculateRatings();
      },
      error => {
        console.error("Error fetching reviews:", error);
      }
    );
  }

  calculateRatings() {
    if (this.reviews.length === 0) {
      return;
    }

    this.totalReviews = this.reviews.length;
    let totalStars = 0;

    this.starDistribution = [0, 0, 0, 0, 0];

    this.reviews.forEach(review => {
      totalStars += review.stars;
      const stars = Math.floor(review.stars);
      this.starDistribution[stars]++;
    });

    this.averageRating = totalStars / this.totalReviews;
  }
  getStarType(star: number): string {
    if (this.averageRating >= star) {
      return 'full';
    } else if (this.averageRating + 0.5 >= star) {
      return 'half';
    } else {
      return 'empty';
    }
  }


  getStarPercentage(stars: number): number {
    return (this.starDistribution[stars - 1] / this.totalReviews) * 100;
  }
}
