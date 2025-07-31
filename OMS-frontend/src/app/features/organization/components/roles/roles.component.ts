import { Component } from '@angular/core';
import { RoleService } from './roles.service';
import { BehaviorSubject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
})
export class RolesComponent {
  constructor(
    private roleSerivce: RoleService,
    private toastrService: ToastrService
  ) {}
  columns = [
    {
      key: 'name',
      title: 'Name',
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
  roles: any[] = [];
  features: any[] = [];
  settings: IDropdownSettings = {};
  editMode: boolean = false;
  selectedId: number | null = null;
  totalRoles: number = 0;

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
      this.fetchFeatures();
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
      this.roleForm.reset();
    });

    this.params.subscribe((val) => {
      this.fetchRoles();
    });

    this.settings = {
      idField: 'id',
      textField: 'name',
    };
  }
  roleForm!: FormGroup;

  private initForm() {
    this.roleForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(15),
      ]),
      features: new FormControl([], Validators.required),
    });
  }

  fetchFeatures() {
    this.roleSerivce.getAllFeature().subscribe({
      next: (data: any) => {
        this.features = data.data || [];
      },
      error: (e) => console.error(e),
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  fetchRoles() {
    this.isLoading = true;
    this.roleSerivce.getAllRoles(this.params.value).subscribe({
      next: (data: any) => {
        this.roles = data.data.content || [];
        this.totalRoles = data.data.totalElements;
      },
      error: (e) => console.error(e),
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  onSubmit() {
    if (this.roleForm.invalid) return;

    this.isLoading = true;

    const roleData = {
      name: this.roleForm.value.name,
      featureIds: this.roleForm.value.features.map((f: any) => f.id),
    };
    this.roleSerivce.createRole(roleData).subscribe({
      next: (v) => {
        this.handleModal();
        this.fetchRoles();
        this.toastrService.success('Role Created!', 'Success!');
      },
      error: (e) => console.error(e),
      complete: () => {},
    });
  }

  onEditClick = (role: any) => {
    this.editMode = true;
    this.selectedId = role.id;
    this.roleSerivce.getRoleDetails(role.id).subscribe({
      next: (data: any) => {
        this.handleModal();
        this.roleForm.patchValue({
          name: data.data.name,
          features: data.data.features.map((f: any) => ({
            id: f.id,
            name: f.name,
          })),
        });
      },
      error: (e) => console.error(e),
      complete: () => {},
    });
  };

  onSaveRole = () => {
    this.selectedId
      ? this.roleSerivce
          .updateRole(this.selectedId, {
            name: this.roleForm.value.name,
            featureIds: this.roleForm.value.features.map((f: any) => f.id),
          })
          .subscribe({
            next: (v) => {
              this.handleModal();
              this.fetchRoles();
              this.toastrService.success('Role Updated!', 'Success!');
            },
            error: (e) => console.error(e),
            complete: () => {},
          })
      : null;
  };

  onDeleteRole = (id: number) => {
    this.roleSerivce.deleteRole(id).subscribe({
      next: (v) => {
        this.fetchRoles();
        this.toastrService.success('Role Deleted!', 'Success!');
      },
      error: (e) => console.error(e),
      complete: () => {},
    });
  };
}
