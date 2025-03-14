import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-sous-category-card',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './sous-category-card.component.html',
  styleUrl: './sous-category-card.component.css'
})
export class SousCategoryCardComponent {
  @Input() products: any;

  hoveredItem: any = null;
}
