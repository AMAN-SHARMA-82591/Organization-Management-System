import { Component, OnInit } from '@angular/core';
import { LeaveTrackerService } from '../../leave-tracker.service';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { LeaveRequest } from 'src/app/common/dialog/dialog-approveLeaveRequest/dialog-approveLeaveRequest.model';

@Component({
  selector: 'app-rm-leave',
  templateUrl: './rm-leave.component.html',
})
export class RmLeaveComponent implements OnInit {
  rmData: LeaveRequest[] = [];
  isApproveModalOpen = new BehaviorSubject<boolean | false>(false);
  isRejectModalOpen = new BehaviorSubject<boolean | false>(false);
  selectedRequest: any;
  leaveReason: string = '';

  constructor(
    private leaveTrackerService: LeaveTrackerService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchRMLeaveData();
  }

  fetchRMLeaveData() {
    this.leaveTrackerService.getRequestToRM().subscribe({
      next: (rmData: any) => {
        this.rmData = rmData.data;
      },
      error: (e) => {
        console.error(e);
      },
    });
  }

  setDateFormat(currentDate: Date) {
    if (currentDate) {
      const formattedDate = `${new Date(currentDate).getFullYear()}-${(
        new Date(currentDate).getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}-${new Date(currentDate)
        .getDate()
        .toString()
        .padStart(2, '0')}`;
      return formattedDate;
    }
    return '';
  }

  handleApproveRequest(item: any) {
    this.selectedRequest = item;
    this.handleOpenRMRequest();
  }

  handleRejectRequest(item: any) {
    this.selectedRequest = item;
    this.handleOpenRejectRequest();
  }

  handleOpenRMRequest() {
    this.isApproveModalOpen.next(!this.isApproveModalOpen.value);
  }

  handleOpenRejectRequest() {
    this.isRejectModalOpen.next(!this.isRejectModalOpen.value);
    this.leaveReason = '';
  }

  onSubmit(eventData: { id: number; formData: any }) {
    this.leaveTrackerService
      .approveLeaveRequest(eventData.id, eventData.formData)
      .subscribe({
        next: () => {
          this.toastrService.success('Request Approved!', 'Success!');
          this.handleOpenRMRequest();
        },
        error: (e) => {
          this.toastrService.error(
            e?.data?.message || 'Something went wrong',
            'Error!'
          );
          console.error(e);
        },
        complete: () => {
          this.fetchRMLeaveData();
        },
      });
  }

  rejectLeave() {
    this.leaveTrackerService
      .rejectLeaveRequest(this.selectedRequest.id, {
        comment: this.leaveReason,
      })
      .subscribe({
        next: () => {
          this.leaveReason = '';
          this.selectedRequest = null;
          this.handleOpenRejectRequest();
          this.fetchRMLeaveData();
          this.toastrService.success('Leave Rejected!', 'Success');
        },
        error: (err) => {
          this.toastrService.error(
            err?.data?.message || 'Something went wrong.',
            'Error'
          );
        },
      });
  }
}
