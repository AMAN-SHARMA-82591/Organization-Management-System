import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LeaveTrackerService } from './leave-tracker.service';
import { UserLeaveData } from './leave-tracker.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-leave-tracker',
  templateUrl: './leave-tracker.component.html',
  styleUrls: ['./leave-tracker.component.css'],
})
export class LeaveTrackerComponent implements OnInit {
  isModalOpen = new BehaviorSubject<boolean | false>(false);
  leavesData: UserLeaveData = {
    availablePaidLeaves: 0,
    approvedLeaves: 0,
    availableUnpaidLeaves: 0,
    bookedLeaves: 0,
    availableVacationLeaves: 0,
    availableSickLeaves: 0,
    totalLeaves: 0,
  };
  leaveType: string = '';
  year = '2023';

  upcomingLeaveHolidays: any = [];

  isCancelLeaveModalOpen = new BehaviorSubject<boolean | false>(false);
  selectedLeave: any = null;
  leaveReason: string = '';

  constructor(
    private leaveTrackerService: LeaveTrackerService,
    private toasterService: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchUserLeavesData();
    this.fetchLeavesAndHolidays();
  }

  fetchLeavesAndHolidays() {
    this.leaveTrackerService.getLeavesAndHolidays().subscribe({
      next: (res: any) => {
        this.upcomingLeaveHolidays = res.data;
      },
      error: (e) => {
        console.error(e);
      },
    });
  }

  fetchUserLeavesData() {
    this.leaveTrackerService.getUserLeaves().subscribe({
      next: (leaveData: any) => {
        this.leavesData = leaveData.data;
      },
      error: (e) => {
        console.error(e);
      },
    });
  }

  refreshUserLeavesData() {
    this.fetchLeavesAndHolidays();
    this.fetchUserLeavesData();
  }

  handleModal(leaveType: string) {
    this.isModalOpen.next(!this.isModalOpen.value);
    this.leaveType = leaveType;
  }

  handleCancelLeaveModal(leave: any = null) {
    this.leaveReason = '';
    this.selectedLeave = leave;
    this.isCancelLeaveModalOpen.next(!this.isCancelLeaveModalOpen.value);
  }

  cancelLeave() {
    this.leaveTrackerService
      .cancelLeaveRequest(this.selectedLeave.leaveRequestId, {
        leaveCancelReason: this.leaveReason,
      })
      .subscribe({
        next: () => {
          this.leaveReason = '';
          this.selectedLeave = null;
          this.handleCancelLeaveModal();
          this.fetchLeavesAndHolidays();
          this.toasterService.success('Leave Cancelled!', 'Success');
        },
        error: (err) => {
          this.toasterService.error(
            err?.data?.message || 'Something went wrong.',
            'Error'
          );
        },
      });
  }
}
