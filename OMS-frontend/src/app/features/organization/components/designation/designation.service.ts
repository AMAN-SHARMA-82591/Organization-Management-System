import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, map } from 'rxjs';
import { Designation } from './designation.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DesignationService {
  constructor(private http: HttpClient) {}
  error = new Subject<string>();

  createDesignation(designationData: Designation) {
    return this.http.post(
      `${environment.baseUrl}/designation`,
      designationData
    );
  }

  getAlldesignations(params: any) {
    return this.http.get(`${environment.baseUrl}/designation`, { params });
  }

  getDesignationDetails(id: number) {
    return this.http.get(`${environment.baseUrl}/designation/${id}`);
  }

  updateDesignation(id: number, payload: Designation) {
    return this.http.patch(`${environment.baseUrl}/designation/${id}`, payload);
  }

  deleteDesignation(id: number) {
    return this.http.delete(`${environment.baseUrl}/designation/${id}`);
  }
}
