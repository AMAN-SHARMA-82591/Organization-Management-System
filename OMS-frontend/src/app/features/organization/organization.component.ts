import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
})
export class OrganizationComponent implements OnInit {
  organizationForm!: FormGroup;
  tabsData = [
    { name: 'Department', path: './department', key: 'department' },
    { name: 'Designation', path: './designation', key: 'designation' },
    { name: 'Roles & Features', path: './roles', key: 'roles' },
    { name: 'Employee', path: './users', key: 'users' },
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const access = this.authService.getUserAccesses();

    console.log(access);
    
    this.tabsData = this.tabsData.filter(({ key }) => access.includes(key));
  }
}
