import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, map } from 'rxjs';
import { Roles } from './roles.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private http: HttpClient) {}
  error = new Subject<string>();

  createRole(roleData: Roles) {
    return this.http.post(`${environment.baseUrl}/role`, roleData);
  }

  getAllRoles(params: any) {
    return this.http.get(`${environment.baseUrl}/role`, { params });
  }

  getAllFeature() {
    return this.http.get(`${environment.baseUrl}/feature`);
  }

  getRoleDetails(id: number) {
    return this.http.get(`${environment.baseUrl}/role/${id}`);
  }

  updateRole(id: number, payload: Roles) {
    return this.http.patch(`${environment.baseUrl}/role/${id}`, payload);
  }

  deleteRole(id: number) {
    return this.http.delete(`${environment.baseUrl}/role/${id}`);
  }
}
