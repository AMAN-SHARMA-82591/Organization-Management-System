import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  showSidebar = new BehaviorSubject<boolean>(true);

  constructor() {}

  toggleSidebar() {
    this.showSidebar.next(!this.showSidebar.value);
  }

  toggleResponsiveSidebar() {
    this.showSidebar.next(true);
  }
}
