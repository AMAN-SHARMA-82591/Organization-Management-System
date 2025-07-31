import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Department } from './department.model';
import { DepartmentService } from './department.service';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
})
export class DepartmentComponent implements OnInit, OnDestroy {
  constructor(
    private departmentService: DepartmentService,
    private toastrService: ToastrService
  ) {}

  columns = [
    {
      key: 'name',
      title: 'Name',
    },
    {
      title: 'Description',
      key: 'description',
    },

    {
      title: 'Created At',
      key: 'createdAt',
      renderFn: (val: Date) =>
         `<span> ${val ? new Date(val).toLocaleDateString() : 'NA'}</span>`,
    },
    {
      key: 'updatedBy',
      title: 'Updated By',
    },
    {
      key: 'updatedAt',
      title: 'Updated At',
      renderFn: (val: Date) =>
         `<span> ${val ? new Date(val).toLocaleDateString() : 'NA'}</span>`,
    },
  ];

  isLoading: boolean = false;
  isModalOpen = new BehaviorSubject<boolean | null>(null);
  departments: any[] = [];
  editMode: boolean = false;
  selectedId: number | null = null;
  totalDeps: number = 0;

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

      this.departmentForm.reset();
    });

    this.params.subscribe((val) => {
      this.fetchDepartments();
    });
  }
  departmentForm!: FormGroup;

  private initForm() {
    this.departmentForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(50),
        Validators.maxLength(150),
      ]),
    });
  }

  fetchDepartments() {
    this.isLoading = true;
    this.departmentService.getAllDepartments(this.params.value).subscribe({
      next: (data: any) => {
        this.departments = data.data.content || [];
        this.totalDeps = data.data.totalElements;
      },
      error: (e) => {
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  onSubmit() {
    if (this.departmentForm.invalid) return;
    this.isLoading = true;

    const departMentData: Department = {
      name: this.departmentForm.value.name,
      description: this.departmentForm.value.description,
    };
    this.departmentService.createDepartment(departMentData).subscribe({
      next: (v) => {
        this.handleModal();
        this.fetchDepartments();
        this.toastrService.success('Department Created!', 'Success!');
      },
      error: (e) => console.error(e),
      complete: () => {},
    });
  }

  onEditClick = (department: any) => {
    this.editMode = true;
    this.selectedId = department.id;
    this.departmentService.getDepartmentDetails(department.id).subscribe({
      next: (data: any) => {
        this.handleModal();
        this.departmentForm.patchValue({
          name: data.data.name,
          description: data.data.description,
        });
      },
      error: (e) => console.error(e),
      complete: () => {},
    });
  };

  onSaveDepartment = () => {
    this.selectedId
      ? this.departmentService
          .updateDepartment(this.selectedId, {
            name: this.departmentForm.value.name,
            description: this.departmentForm.value.description,
          })
          .subscribe({
            next: (v) => {
              this.handleModal();
              this.fetchDepartments();
              this.toastrService.success('Department Updated!', 'Success!');
            },
            error: (e) => console.error(e),
            complete: () => {},
          })
      : null;
  };

  onDeleteDepartment = (id: number) => {
    this.departmentService.deleteDepartment(id).subscribe({
      next: (v) => {
        this.fetchDepartments();
        this.toastrService.success('Deapartment Deleted!', 'Success!');
      },
      error: (e) => console.error(e),
      complete: () => {},
    });
  };
}
