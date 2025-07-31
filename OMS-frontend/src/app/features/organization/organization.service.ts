import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Organization } from './organization.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  constructor(private http: HttpClient) {}

  createOrganization(orgData: Organization) {
    return this.http.post(`${environment.baseUrl}/organization`, orgData);
  }

  getAllOrganizations() {
    return this.http.get(`${environment.baseUrl}/organization`);
  }

  updateOrganization(id: Number, payload: Organization) {
    return this.http.patch(
      `${environment.baseUrl}/organization/${id}`,
      payload
    );
  }

  dashboardDetails() {
    return this.http.get(`${environment.baseUrl}/dashboard`);
  }

  deleteOrganization(id: Number) {
    return this.http.delete(`${environment.baseUrl}/organization/${id}`);
  }
}
