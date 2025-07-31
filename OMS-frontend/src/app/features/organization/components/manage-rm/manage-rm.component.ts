import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EmployeeService } from '../employee/employee.service';
import { AuthService } from 'src/app/features/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-rm',
  templateUrl: './manage-rm.component.html',
})
export class ManageRmComponent {
  constructor(
    private employeeSerivce: EmployeeService,
    private authService: AuthService,
    private toastrService: ToastrService
  ) {}
  isModalOpen = new BehaviorSubject<boolean | null>(null);
  @Input() selectedEmp: any = null;
  users: any[] = [];
  isLoading: boolean = false;
  selectedUser: any = null;
  currentUser = this.authService.getCurrentUser();

  params = new BehaviorSubject({
    pageNum: 1,
    pageSize: 10,
    sortOrder: 'asc',
    sortName: '',
    search: '',
  });

  handleModal = () => {
    if (!this.isModalOpen.getValue()) {
      this.fetchEmployees();
    }
    this.isModalOpen.next(!this.isModalOpen.value);
  };

  onSearchChange = (val: string) => {
    this.params.next({
      ...this.params.value,
      search: val,
    });
    this.fetchEmployees();
  };

  fetchEmployees() {
    this.isLoading = true;
    this.employeeSerivce.getAllEmployees(this.params.value).subscribe({
      next: (data: any) => {
        this.users = (data.data || []).map((user: any) => ({
          ...user.user,
          key: `${user.user.firstName} ${user.user.lastName}`,
        }));
      },
      error: (e) => {
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  onUserSelect = (user: any) => {
    this.selectedUser = user;
  };

  submitRM() {
    this.employeeSerivce
      .assignRm({
        userId: this.selectedEmp.id,
        reportingManagerId: this.selectedUser.id,
      })
      .subscribe({
        next: () => {
          this.toastrService.success(
            'Reporting Manager Assigned Successfully!',
            'Success!'
          );
          this.handleModal();
        },
        error: (err) => {
          this.toastrService.error(
            err?.error?.message || 'Something went wrong, try again later',
            'Error!'
          );
        },
      });
  }

  ngOnInit(): void {}
}
