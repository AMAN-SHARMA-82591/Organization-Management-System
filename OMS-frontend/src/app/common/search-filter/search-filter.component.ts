import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'search-filter',
  templateUrl: './search-filter.component.html',
})
export class SearchFilterComponent {
  public consoleMessages: string[] = [];
  public searchText: string = '';
  searchTextUpdate = new Subject<any>();
  @Input()
  handleChange!: (value: string) => void;
  @Input() placeholder: string = 'Search';

  constructor() {
    // Debounce search.
    this.searchTextUpdate
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.handleChange(value);
      });
  }
}
