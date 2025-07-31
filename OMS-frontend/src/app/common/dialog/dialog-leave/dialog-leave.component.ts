import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { UserLeaveData } from 'src/app/features/leave-tracker/leave-tracker.model';
import { LeaveTrackerService } from 'src/app/features/leave-tracker/leave-tracker.service';

@Component({
  selector: 'app-dialog-leave',
  templateUrl: './dialog-leave.component.html',
})
export class DialogLeaveComponent implements OnInit, OnChanges {
  @Input() data: { availableLeaves: number } = {
    availableLeaves: 0,
  };
  @Input() leavesData: UserLeaveData = {
    availablePaidLeaves: 0,
    approvedLeaves: 0,
    availableUnpaidLeaves: 0,
    bookedLeaves: 0,
    availableVacationLeaves: 0,
    availableSickLeaves: 0,
    totalLeaves: 0,
  };
  @Input() leaveType: String | undefined;
  @Input() isModalOpen = new BehaviorSubject<boolean | false>(false);
  @Input() handleOpenModal: ((leaveType: string) => void) | undefined;
  @Output() refetchData: EventEmitter<any> = new EventEmitter();
  dateList: string[] = [];
  endDateValue: string = '';
  startDateValue: string = '';
  leaveTrackerForm!: FormGroup;
  minDate: string = '';
  remainingLeaveData: {
    availableLeaves: number;
    currentlyBooked: number;
    balance: number;
  } = {
    availableLeaves: 0,
    currentlyBooked: 0,
    balance: 0,
  };

  constructor(
    private fb: FormBuilder,
    private leaveTrackerService: LeaveTrackerService,
    private toastrService: ToastrService
  ) {
    this.minDate = new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.initForm();
    this.leaveTrackerForm.reset();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.updateRemainingLeavesData(this.data.availableLeaves);
    }
  }

  private updateRemainingLeavesData(availableLeave: number) {
    this.remainingLeaveData = {
      availableLeaves: availableLeave,
      currentlyBooked: this.dateList.length,
      balance: availableLeave - this.dateList.length,
    };
  }

  private handleUpdateCurrentlyBooked() {
    const leaveBreakupsData = this.getLeaveBreakups.value
      .map((value: any) => value.noOfDays)
      .reduce((a: string, b: string) => parseFloat(a) + parseFloat(b), 0);
    this.remainingLeaveData.currentlyBooked = leaveBreakupsData;
    this.remainingLeaveData.balance =
      this.remainingLeaveData.availableLeaves - leaveBreakupsData;
    this.leaveTrackerForm.patchValue({
      startDate: this.startDateValue,
      endDate: this.endDateValue,
      noOfDays: leaveBreakupsData,
      typeOfLeave: this.leaveType,
    });
  }

  private initForm() {
    this.leaveTrackerForm = this.fb.group({
      leaveBreakups: this.fb.array([]),
      typeOfLeave: [this.leaveType, Validators.required],
      noOfDays: [this.remainingLeaveData.currentlyBooked, Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  private leaveBreakup(date: string): FormGroup {
    return this.fb.group({
      startDate: date,
      endDate: date,
      noOfDays: '1',
      timeOfDay: 'full',
    });
  }

  public get getLeaveBreakups() {
    return <FormArray>this.leaveTrackerForm.get('leaveBreakups');
  }

  updateDateRange() {
    this.dateList = this.getDateRange(this.startDateValue, this.endDateValue);
    this.dateList.forEach((value, i) => {
      if (value) {
        const shortDateFormat = this.getFormattedDate(new Date(value));
        this.getLeaveBreakups.push(this.leaveBreakup(shortDateFormat));
      }
    });
    this.handleUpdateCurrentlyBooked();
  }

  handleChangeLeaveType(event: any) {
    this.leaveType = event.target.value;
    if (this.leaveType === 'paid_leave')
      this.updateRemainingLeavesData(this.leavesData.availablePaidLeaves);
    else if (this.leaveType === 'unpaid_leave')
      this.updateRemainingLeavesData(this.leavesData.availableUnpaidLeaves);
    else if (this.leaveType === 'vacation_leave')
      this.updateRemainingLeavesData(this.leavesData.availableVacationLeaves);
    else if (this.leaveType === 'sick_leave')
      this.updateRemainingLeavesData(this.leavesData.availableSickLeaves);
    else this.updateRemainingLeavesData(this.leavesData.availablePaidLeaves);
    this.handleUpdateCurrentlyBooked();
  }

  updateEndDateField() {
    this.endDateValue = this.startDateValue;
  }

  handleChangeOptions(noOfDays: string): any {
    const fullDay: object[] = [{ name: '', value: 'full' }];
    const halfDay: object[] = [
      { name: '1st Half', value: '1st_half' },
      { name: '2nd Half', value: '2nd_half' },
    ];
    const quarterDay: object[] = [
      { name: '1st Quarter', value: '1st_quarter' },
      { name: '2nd Quarter', value: '2nd_quarter' },
      { name: '3rd Quarter', value: '3rd_quarter' },
      { name: '4th Quarter', value: '4th_quarter' },
    ];
    if (noOfDays === '0.5') return halfDay;
    else if (noOfDays === '0.25') return quarterDay;
    else return fullDay;
  }

  handleChangeNoOfDays(event: any, index: number) {
    const daysValue = event.target.value;
    if (daysValue === '0.5') {
      this.getLeaveBreakups.at(index).patchValue({
        timeOfDay: '1st_half',
      });
    } else if (daysValue === '0.25') {
      this.getLeaveBreakups.at(index).patchValue({
        timeOfDay: '1st_quarter',
      });
    } else {
      this.getLeaveBreakups.at(index).patchValue({
        timeOfDay: 'full',
      });
    }
    this.handleUpdateCurrentlyBooked();
  }

  private getFormattedDate(currentDate: Date): string {
    return `${new Date(currentDate).getFullYear()}-${(
      new Date(currentDate).getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${new Date(currentDate)
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  }

  getDateRange(startDate: string, endDate: string): string[] {
    let dateArray: string[] = [];
    let currentDate = new Date(startDate);
    if (!isNaN(currentDate.getDate()) && startDate === endDate) {
      dateArray.push(this.getFormattedDate(currentDate));
    } else {
      dateArray = [];
      while (currentDate <= new Date(endDate)) {
        dateArray.push(this.getFormattedDate(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    this.getLeaveBreakups.clear();
    return dateArray;
  }

  onSubmit() {
    this.leaveTrackerService
      .createLeaveRequest(this.leaveTrackerForm.value)
      .subscribe({
        next: () => {
          this.leaveTrackerForm.reset();
          this.getLeaveBreakups.clear();
          this.handleCancelModel();
          this.refetchData.emit();
          this.startDateValue = '';
          this.endDateValue = '';
          this.toastrService.success('Leave Created!', 'Success!');
        },
        error: (err) => {
          const errorMessage = err?.error?.message || 'Something went wrong';
          this.toastrService.error(errorMessage, 'Error!');
        },
      });
  }

  handleCancelModel() {
    this.handleOpenModal && this.handleOpenModal('');
    this.leaveTrackerForm.reset();
    this.getLeaveBreakups.clear();
    this.startDateValue = '';
    this.endDateValue = '';
  }
}
