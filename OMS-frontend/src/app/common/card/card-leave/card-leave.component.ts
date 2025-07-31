import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserLeaveData } from 'src/app/features/leave-tracker/leave-tracker.model';

@Component({
  selector: 'app-card-leave',
  templateUrl: './card-leave.component.html',
})
export class CardLeaveComponent implements OnInit {
  @Input() title: string = '';
  @Input() leaveType: string = '';
  @Input() icon: string = '';
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
  @Output() refetchData: EventEmitter<any> = new EventEmitter();
  availableLeaves: number = 0;
  isModalOpen = new BehaviorSubject<boolean | false>(false);

  constructor() {}

  ngOnInit(): void {}

  handleModal() {
    this.isModalOpen.next(!this.isModalOpen.value);
  }
}
