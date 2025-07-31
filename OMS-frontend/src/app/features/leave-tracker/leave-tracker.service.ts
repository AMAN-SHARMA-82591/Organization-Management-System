import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApprovedLeaveTracker, LeaveTracker } from './leave-tracker.model';

@Injectable({
  providedIn: 'root',
})
export class LeaveTrackerService {
  constructor(private http: HttpClient) {}

  getLeavesAndHolidays() {
    return this.http.get(`${environment.baseUrl}/holiday/upcoming-all`);
  }

  createLeaveRequest(leaveData: LeaveTracker) {
    return this.http.post(`${environment.baseUrl}/leave-tracker`, leaveData);
  }

  approveLeaveRequest(id: number, leaveData: ApprovedLeaveTracker) {
    return this.http.post(
      `${environment.baseUrl}/leave-tracker/${id}`,
      leaveData
    );
  }

  cancelLeaveRequest(id: number, leaveData: any) {
    return this.http.post(
      `${environment.baseUrl}/leave-tracker/cancel-leave-request/${id}`,
      leaveData
    );
  }

  rejectLeaveRequest(id: number, leaveData: any) {
    return this.http.post(
      `${environment.baseUrl}/leave-tracker/reject-leave-request/${id}`,
      leaveData
    );
  }

  getLeavesSystem() {
    return this.http.get(`${environment.baseUrl}/leave-system`);
  }

  getUserLeaves() {
    return this.http.get(`${environment.baseUrl}/leave`);
  }

  getUserLeaveRequest() {
    return this.http.get(`${environment.baseUrl}/leave-tracker`);
  }

  getRequestToRM() {
    return this.http.get(
      `${environment.baseUrl}/leave-tracker/reporting-manager`
    );
  }
}
