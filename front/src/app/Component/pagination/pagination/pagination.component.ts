import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  standalone: true,
  imports: [
    NgClass
  ],
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnChanges {
  @Input() totalItems!: number; // Total number of items
  @Input() itemsPerPage = 10; // Number of items per page
  @Input() currentPage = 1; // Current page number
  @Output() pageChange = new EventEmitter<number>(); // Event emitted when page changes

  totalPages = 1; // Total number of pages
  pages: number[] = []; // Array of page numbers

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalItems'] || changes['itemsPerPage']) {
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageChange.emit(this.currentPage);
    }
  }
}
