import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../organization/components/department/department.service';
import { EmployeeService } from '../../organization/components/employee/employee.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
})
export class TeamComponent implements OnInit {
  departments: any[] = [];
  employees: any[] = [];

  constructor(
    private departmentService: DepartmentService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.fetchDepartments();
    this.fetchEmployees();
  }

  fetchEmployees() {
    this.employeeService.getAllEmployees({}).subscribe({
      next: (data: any) => {
        this.employees =
          data.data.map(
            (value: {
              id: Number;
              email: String;
              firstName: String;
              lastName: String;
              username: String;
            }) => {
              const employeeData = {
                name: `${value.firstName} ${value.lastName}`,
                username: value.username,
                email: value.email,
                employeeId: value.id,
                image: 'https://avatars.githubusercontent.com/u/12519008?v=4',
                status: 'In',
              };
              return employeeData;
            }
          ) || [];
      },
      error: (e) => console.error(e),
    });
  }

  fetchDepartments() {
    this.departmentService.getAllDepartments({}).subscribe({
      next: (data: any) => {
        this.departments =
          data.data.map((value: { name: String }) => value.name) || [];
      },
      error: (error) => console.error(error),
    });
  }
}
