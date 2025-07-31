import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { LeaveBreakup, LeaveRequest } from './dialog-approveLeaveRequest.model';
import { LeaveTrackerService } from 'src/app/features/leave-tracker/leave-tracker.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-approveLeaveRequest',
  templateUrl: './dialog-approveLeaveRequest.component.html',
})
export class DialogApproveLeaveRequest implements OnChanges {
  @Output() handleOpenRMRequest: EventEmitter<any> = new EventEmitter();
  @Output() onSubmit: EventEmitter<{ id: number; formData: any }> =
    new EventEmitter();
  @Input() isApproveModalOpen = new BehaviorSubject<boolean | false>(false);
  @Input() data: LeaveRequest = {
    id: 0,
    startDate: new Date(),
    endDate: new Date(),
    reason: '',
    typeOfLeave: '',
    comment: '',
    isApproved: false,
    isCancelled: false,
    noOfDays: 0,
    leaveBreakups: '',
    createdBy: '',
  };
  rmFormData!: FormGroup;
  leaveBreakups: LeaveBreakup[] = [];
  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'].currentValue) {
      this.initForm();
    }
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

  private initForm() {
    this.rmFormData = this.fb.group({
      approvedLeaveBreakups: this.fb.array([]),
      approvedStartDate: this.setDateFormat(this.data.startDate),
      approvedEndDate: this.setDateFormat(this.data.endDate),
      comment: ['', [Validators.required, Validators.minLength(10)]],
    });
    this.updateLeaveBreakup(this.data.leaveBreakups);
  }

  public get getApprovedLeaveBreakups() {
    return <FormArray>this.rmFormData.get('approvedLeaveBreakups');
  }

  private leaveBreakup(value: any): FormGroup {
    return this.fb.group({
      startDate: this.setDateFormat(value.startDate),
      endDate: this.setDateFormat(value.endDate),
      noOfDays: value.noOfDays,
      timeOfDay: value.timeOfDay,
      isApproved: true,
    });
  }

  private updateLeaveBreakup(data: string) {
    const leaveBreakup: LeaveBreakup[] = JSON.parse(data);
    this.leaveBreakups = leaveBreakup;
    leaveBreakup.forEach((value, i) => {
      if (value) {
        this.getApprovedLeaveBreakups.push(this.leaveBreakup(value));
      }
    });
  }

  onLeaveSubmit() {
    this.onSubmit.emit({ id: this.data.id, formData: this.rmFormData.value });
  }
}
