import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewService } from '../../Services/DATA-Service/review-service/review.service';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import {NgForOf, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {CRUDUsersAdminService} from "../../Services/DATA-Service/CRUD-users-admin-service/crud-users-admin.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgForOf
  ],
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent implements OnInit{
  reviewForm: FormGroup;
  rating: number = 0;
  tempRating: number = 0;
  userId: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<ReviewFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private snackBar: MatSnackBar,
    private crudUserService: CRUDUsersAdminService,
    private toastr: ToastrService,

  ) {
    this.reviewForm = this.fb.group({
      stars: [null, Validators.required],
      review: ['', Validators.required]
    });
  }
ngOnInit() {
    this.getAuthenticatedCustomer();
}
  getAuthenticatedCustomer() {
    this.crudUserService.getAthenticateUser().subscribe(
      data => {
        console.log(data)
        this.userId = data.body.id
      },
      error => {
        console.log(error)
      }
    )
  }

  setRating(star: number): void {
    this.rating = star;
    this.reviewForm.controls['stars'].setValue(star);
  }

  onMouseEnter(star: number): void {
    this.tempRating = star;
  }

  onMouseLeave(): void {
    this.tempRating = 0;
  }

  getStarType(star: number): string {
    if (this.tempRating >= star || this.rating >= star) {
      return 'full';
    } else {
      return 'empty';
    }
  }

  onSubmit(): void {
    if (this.reviewForm.valid) {
      const reviewData = {
        productId: this.data.productId,
        customerId: this.userId,
        stars: this.reviewForm.value.stars,
        review: this.reviewForm.value.review
      };
      this.reviewService.createReview(reviewData).subscribe(
        response => {
          console.log('Review submitted successfully', response);
          this.dialogRef.close(true);
          this.toastr.success('Avis ajouté avec succès !')
        },
        error => {
          console.error('Error submitting review', error);
        }
      );
    }
  }
  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
  onCancel(): void {
    this.dialogRef.close();
  }
}
