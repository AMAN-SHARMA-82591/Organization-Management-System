import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { EmployeeService } from './employee.service';
import { ToastrService } from 'ngx-toastr';
import { Employee } from './employee.model';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
})
export class EmployeeComponent {
  constructor(
    private employeeSerivce: EmployeeService,
    private toastrService: ToastrService
  ) {}

  columns = [
    {
      key: 'id',
      title: 'ID',
    },
    {
      key: 'firstName',
      title: 'First Name',
    },
    {
      key: 'lastName',
      title: 'Last Name',
    },
    {
      key: 'email',
      title: 'Email',
    },
    {
      key: 'reportingManager',
      title: 'Reporting Manager',
    },
  ];

  isLoading: boolean = false;
  isModalOpen = new BehaviorSubject<boolean | null>(null);
  selectedEmployee: any = null;

  designations: any[] = [];
  employees: any[] = [];
  departments: any[] = [];
  roles: any[] = [];
  employeeForm!: FormGroup;
  editMode: boolean = false;
  selectedUser: any = null;
  totalEmployees: number = 0;
  params = new BehaviorSubject({
    pageNum: 1,
    pageSize: 10,
    sortOrder: 'asc',
    sortName: '',
    search: '',
  });

  onPageChange(pageNum: number) {
    if (this.params.getValue().pageNum !== pageNum) {
      this.params.next({
        ...this.params.value,
        pageNum,
      });
    }
  }
  onSearchChange = (val: string) => {
    this.params.next({
      ...this.params.value,
      search: val,
    });
  };

  handleModal() {
    if (!this.isModalOpen.value) {
      this.fetchDepartments();
      this.fetchDesignations();
      this.fetchRoles();
    }
    this.isModalOpen.next(!this.isModalOpen.value);
  }

  ngOnDestroy(): void {
    this.isModalOpen.unsubscribe();
    this.params.unsubscribe();
  }

  ngOnInit(): void {
    this.initForm();
    this.isModalOpen.subscribe((val) => {
      if (!val) {
        this.editMode = false;
      }
      this.employeeForm.reset();
    });

    this.params.subscribe((val) => {
      this.fetchEmployees();
    });
  }

  private initForm() {
    this.employeeForm = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ]),
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ]),
      password: new FormControl(
        '',
        this.editMode
          ? []
          : [
              Validators.required,
              Validators.pattern(
                /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d][A-Za-z\d@$!%*?&]{8,}$/
              ),
            ]
      ),
      role: new FormControl('', Validators.required),
      department: new FormControl('', Validators.required),
      designation: new FormControl('', Validators.required),
    });
  }

  fetchEmployees() {
    this.isLoading = true;
    this.employeeSerivce.getAllEmployees(this.params.value).subscribe({
      next: (data: any) => {
        this.employees = (data.data.data || []).map((user: any) => ({
          ...user.user,
          reportingManager: user.reportingManager || 'NA',
        }));
        this.totalEmployees = data.data.totalElements;
      },
      error: (e) => console.error(e),
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  fetchDepartments() {
    this.employeeSerivce.getAllDepartments().subscribe({
      next: (data: any) => {
        this.departments = data.data.content || [];
      },
      error: (e) => console.error(e),
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  fetchDesignations() {
    this.employeeSerivce.getAllDesignation().subscribe({
      next: (data: any) => {
        this.designations = data.data.content || [];
      },
      error: (e) => console.error(e),
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  fetchRoles() {
    this.employeeSerivce.getAllRoles().subscribe({
      next: (data: any) => {
        this.roles = data.data.content || [];
      },
      error: (e) => console.error(e),
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  onSubmit() {
    if (this.employeeForm.invalid) return;
    this.isLoading = true;

    const empData = {
      firstName: this.employeeForm.value.firstName,
      lastName: this.employeeForm.value.lastName,
      username: this.employeeForm.value.username,
      email: this.employeeForm.value.email,
      password: this.employeeForm.value.password,
      roleId: this.employeeForm.value.role,
      deptId: this.employeeForm.value.department,
      desgId: this.employeeForm.value.designation,
    };

    this.employeeSerivce.createEmployee(empData).subscribe({
      next: (v) => {
        this.handleModal();
        this.fetchEmployees();
        this.toastrService.success('User Created!', 'Success!');
      },
      error: (e) =>
        this.toastrService.error(
          e?.error?.message || 'Something went wrong!',
          'Error!'
        ),
      complete: () => {},
    });
  }

  onEditClick = (user: any) => {
    this.handleModal();
    this.editMode = true;
    this.initForm();
    this.selectedUser = user;

    this.employeeForm.setValue({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      password: null,
      role: user.userOrganizationRole?.[0].role.id || null,
      department: user.department.id,
      designation: user.designation.id,
    });
  };

  onSaveEmployee = () => {
    this.selectedUser
      ? this.employeeSerivce
          .updateEmployee(this.selectedUser.id, {
            firstName: this.employeeForm.value.firstName,
            lastName: this.employeeForm.value.lastName,
            username: this.employeeForm.value.username,
            email: this.employeeForm.value.email,
            roleId: this.employeeForm.value.role,
            deptId: this.employeeForm.value.department,
            desgId: this.employeeForm.value.designation,
          })
          .subscribe({
            next: (v) => {
              this.handleModal();
              this.fetchEmployees();
              this.toastrService.success('User Updated!', 'Success!');
            },
            error: (error) => {
              this.toastrService.error(
                error?.data?.message || 'Something went wrong',
                'Error!'
              );
            },
            complete: () => {},
          })
      : null;
  };

  onDeleteEmployee = (id: number) => {
    this.employeeSerivce.deleteEmployee(id).subscribe({
      next: (v) => {
        this.fetchEmployees();
        this.toastrService.success('User Deleted!', 'Success!');
      },
      error: (e) => console.error(e),
      complete: () => {},
    });
  };
}
