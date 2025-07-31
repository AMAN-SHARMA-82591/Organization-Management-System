import { Component, Input } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-select',
  templateUrl: './search-select.component.html',
})
export class SearchSelectComponent {
  @Input()
  options!: any[];

  @Input()
  onSelect!: (value: any) => void;

  showDropDown: boolean = false;
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

  onUserClick(user: any) {
    this.onSelect(user);
    this.searchText = user.firstName + ' ' + user.lastName;
  }

  handleShowDropdown() {
    this.showDropDown = !this.showDropDown;
  }
}
