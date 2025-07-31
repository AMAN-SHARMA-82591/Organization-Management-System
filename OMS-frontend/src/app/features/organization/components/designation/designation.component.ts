import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { DesignationService } from './designation.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
})
export class DesignationComponent {
  constructor(
    private designationService: DesignationService,
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
      key: 'updatedAt',
      title: 'Updated At',
    },
  ];

  isLoading: boolean = false;
  isModalOpen = new BehaviorSubject<boolean | null>(null);
  designations: any[] = [];
  editMode: boolean = false;
  selectedId: number | null = null;
  totalDesgs: number = 0;
  params = new BehaviorSubject<any>({
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
      this.designationForm.reset();
    });

    this.params.subscribe((val) => {
      this.fetchDesignations();
    });
  }
  designationForm!: FormGroup;

  private initForm() {
    this.designationForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(30),
        Validators.maxLength(150),
      ]),
    });
  }

  fetchDesignations() {
    this.isLoading = true;
    this.designationService.getAlldesignations(this.params.value).subscribe({
      next: (data: any) => {
        this.designations = data.data.content || [];
        this.totalDesgs = data.data.totalElements;
      },
      error: (e) => console.error(e),
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  onSubmit() {
    if (this.designationForm.invalid) return;
    this.isLoading = true;

    const designationData = {
      name: this.designationForm.value.name,
      description: this.designationForm.value.description,
    };
    this.designationService.createDesignation(designationData).subscribe({
      next: (v) => {
        this.handleModal();
        this.fetchDesignations();
        this.toastrService.success('Designation Created!', 'Success!');
      },
      error: (e) => console.error(e),
      complete: () => {},
    });
  }

  onEditClick = (designation: any) => {
    this.editMode = true;
    this.selectedId = designation.id;
    this.designationService.getDesignationDetails(designation.id).subscribe({
      next: (data: any) => {
        this.handleModal();
        this.designationForm.patchValue({
          name: data.data.name,
          description: data.data.description,
        });
      },
      error: (e) => console.error(e),
      complete: () => {},
    });
  };

  onSaveDesignation = () => {
    this.selectedId
      ? this.designationService
          .updateDesignation(this.selectedId, {
            name: this.designationForm.value.name,
            description: this.designationForm.value.description,
          })
          .subscribe({
            next: (v) => {
              this.handleModal();
              this.fetchDesignations();
              this.toastrService.success('Designation Updated!', 'Success!');
            },
            error: (e) => console.error(e),
            complete: () => {},
          })
      : null;
  };

  onDeleteDesignation = (id: number) => {
    this.designationService.deleteDesignation(id).subscribe({
      next: (v) => {
        this.fetchDesignations();
        this.toastrService.success('Designation Deleted!', 'Success!');
      },
      error: (e) => console.error(e),
      complete: () => {},
    });
  };
}
