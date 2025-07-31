import { Component } from '@angular/core';

@Component({
  selector: 'app-self-service',
  templateUrl: './self-service.component.html',
  styleUrls: ['./self-service.component.css'],
})
export class SelfServiceComponent {
  tabsData = [
    { name: 'Profile', path: './profile' },
    { name: 'Team', path: './team' },
    { name: 'Calendar', path: './calendar' },
    { name: 'Leave Request', path: './leave_request' },
  ];
  isModalOpen: boolean = false;

  constructor() {}
  handleModal(modal: boolean) {
    this.isModalOpen = modal;
  }
}
