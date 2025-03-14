import { Component } from '@angular/core';
import {RateStarComponent} from "./rate-star/rate-star.component";
import {RateCommentComponent} from "./rate-comment/rate-comment.component";

@Component({
  selector: 'app-rate-bloc',
  standalone: true,
  imports: [
    RateStarComponent,
    RateCommentComponent
  ],
  templateUrl: './rate-bloc.component.html',
  styleUrl: './rate-bloc.component.css'
})
export class RateBlocComponent {

}
