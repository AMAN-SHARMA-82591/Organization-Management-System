import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, filter, map, range as ranges, toArray } from 'rxjs';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
})
export class PaginationComponent implements OnInit {
  @Input()
  offset!: number;
  @Input()
  limit!: number;
  @Input()
  size!: number;
  @Input()
  range!: number;

  @Output() pageChange: EventEmitter<any>;
  currentPage: number = 1;
  totalPages: number = 0;
  pages!: Observable<number[]>;
  constructor() {
    this.pageChange = new EventEmitter<any>();
  }

  ngOnInit() {
    this.getPages(this.offset, this.limit, this.size);
  }

  ngOnChanges() {
    this.getPages(this.offset, this.limit, this.size);
  }

  getCurrentPage(offset: number, limit: number): number {
    return Math.floor(offset / limit);
  }

  getTotalPages(limit: number, size: number): number {
    return Math.ceil(Math.max(size, 1) / Math.max(limit, 1));
  }

  getPages(offset: number, limit: number, size: number) {
    
    this.totalPages = this.getTotalPages(limit, size);
    this.pages = ranges(-this.range, this.range * 2 + 1).pipe(
      map((res) => this.currentPage + res),
      filter((res) => this.isValidPageNumber(res, this.totalPages)),
      toArray()
    );
  }

  isValidPageNumber(page: number, totalPages: number): boolean {
    return page > 0 && page <= totalPages;
  }

  selectPage(page: number, event: any) {
    event.preventDefault();
    this.currentPage = page
    this.pageChange.emit(page);
  }

  cancelEvent(event: { preventDefault: () => void }) {
    event.preventDefault();
  }
}
