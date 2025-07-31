import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Organization } from '../organization/organization.model';
import { BehaviorSubject } from 'rxjs';
import { OrganizationService } from '../organization/organization.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  isModalOpen = new BehaviorSubject<boolean | null>(null);
  organizationForm!: FormGroup;
  constructor(
    private organizationService: OrganizationService,
    private toastrService: ToastrService,
    private authService: AuthService
  ) {}
  currentUser: any = null;
  dashboardDetails: any = null;

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    this.initForm();
    this.getDashboardDetails();
    if (user) {
      const profileData = JSON.parse(user);
      if (!profileData.orgId) {
        this.isModalOpen.next(true);
      } else {
        this.currentUser = profileData;
      }
    }
  }

  ngOnDestroy(): void {
    this.isModalOpen.unsubscribe();
  }

  getDashboardDetails() {
    this.organizationService.dashboardDetails().subscribe({
      next: (res: any) => {
        this.dashboardDetails = res.data;
      },
    });
  }

  handleModal() {
    this.isModalOpen.next(false);
  }

  private initForm() {
    this.organizationForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(4)]),
      address: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    if (this.organizationForm.invalid) return;
    const organizationData: Organization = this.organizationForm.value;
    this.organizationService.createOrganization(organizationData).subscribe({
      next: (organization: any) => {
        this.handleModal();
        const storedDataString = localStorage.getItem('user');
        if (storedDataString !== null) {
          const userObject = JSON.parse(storedDataString);
          userObject.orgId = organization.data.id;
          localStorage.setItem('user', JSON.stringify(userObject));
          this.authService.getUserData(userObject);
          this.getDashboardDetails();
        }
        this.toastrService.success('Organization Created', 'Success!');
      },
      error: (e) => console.error(e),
    });
  }
}
