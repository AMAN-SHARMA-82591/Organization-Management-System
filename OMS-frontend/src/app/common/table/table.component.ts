import { Component, Input } from '@angular/core';

interface column {
  key: string;
  title: string;
  renderFn?: any;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
})
export class TableComponent {
  @Input() columns!: column[];
  @Input() data!: any[];
  @Input() title!: string;
  @Input() onEdit?: Function;
  @Input() onDelete?: Function;
  @Input() offset!: number;
  @Input() limit!: number;
  @Input() totalRecords!: number;

  @Input()
  onPageNumChange!: Function;

  onPageChange(pageNum: number) {
    if (this.offset !== pageNum) {
      this.onPageNumChange(pageNum);
    }
  }

  constructor() {}
}
