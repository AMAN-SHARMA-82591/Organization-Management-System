import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from './employee.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  createEmployee(empData: Employee) {
    return this.http.post(`${environment.baseUrl}/users`, empData);
  }

  getAllEmployees(params: any) {
    return this.http.get(`${environment.baseUrl}/users`, { params });
  }

  getAllDepartments() {
    return this.http.get(`${environment.baseUrl}/department`);
  }

  getAllRoles() {
    return this.http.get(`${environment.baseUrl}/role`);
  }

  getAllDesignation() {
    return this.http.get(`${environment.baseUrl}/designation`);
  }

  getEmployeeDetails(id: number) {
    return this.http.get(`${environment.baseUrl}/users/${id}`);
  }

  updateEmployee(id: number, payload: Employee) {
    return this.http.patch(`${environment.baseUrl}/users/${id}`, payload);
  }

  deleteEmployee(id: number) {
    return this.http.delete(`${environment.baseUrl}/users/${id}`);
  }

  assignRm(payload: any) {
    return this.http.patch(
      `${environment.baseUrl}/users/assign-reporting-manager`,
      payload
    );
  }
}
