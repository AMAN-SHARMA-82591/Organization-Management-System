import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, map } from 'rxjs';
import { Department } from './department.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  constructor(private http: HttpClient) {}
  error = new Subject<string>();

  createDepartment(departmentData: Department) {
    return this.http.post(`${environment.baseUrl}/department`, departmentData);
  }

  getAllDepartments(params: any) {
    return this.http.get(`${environment.baseUrl}/department`, { params });
  }

  getDepartmentDetails(id: number) {
    return this.http.get(`${environment.baseUrl}/department/${id}`);
  }

  updateDepartment(id: number, payload: Department) {
    return this.http.patch(`${environment.baseUrl}/department/${id}`, payload);
  }

  deleteDepartment(id: number) {
    return this.http.delete(`${environment.baseUrl}/department/${id}`);
  }
}
