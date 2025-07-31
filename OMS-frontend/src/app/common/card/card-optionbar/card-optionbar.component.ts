import {
  Component,
  EventEmitter,
  OnInit,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ProfileService } from 'src/app/features/self-service/profile/profile.service';

@Component({
  selector: 'app-card-optionbar',
  templateUrl: './card-optionbar.component.html',
})
export class CardOptionbarComponent implements OnInit, OnDestroy {
  @Output()
  isModalOpen = new EventEmitter<boolean>(false);
  openModal: boolean = false;
  profileForm!: FormGroup;
  profileId: string = '';
  profileData: any = undefined;
  private profileSubscription: Subscription = new Subscription();
  private userSubscription: Subscription = new Subscription();

  constructor(
    private profileService: ProfileService,
    private toastrService: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.profileSubscription = this.profileService.userProfile$.subscribe(
      (profileData) => {
        if (Object.keys(profileData).length) {
          const { users_profile_info: profile } = profileData;
          this.profileId = profile.id;
          this.profileForm = this.fb.group({
            firstName: [
              profile.firstName,
              [Validators.required, Validators.minLength(3)],
            ],
            lastName: [
              profile.lastName,
              [Validators.required, Validators.minLength(3)],
            ],
            dateOfBirth: this.setDateFormat(profile.dateOfBirth),
            workPhoneNumber: [
              profile.workPhoneNumber,
              [Validators.required, Validators.minLength(10)],
            ],
            gender: profile.gender,
            personalPhoneNumber: profile.personalPhoneNumber,
            language: profile.language,
            panCard: profile.panCard,
            email: [profile.user.email, Validators.required],
            username: [profile.user.username, Validators.required],
            aadharCard: profile.aadharCard,
          });
        }
      }
    );
  }

  private setDateFormat(currentDate: Date) {
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

  onSubmit() {
    this.profileSubscription = this.profileService
      .updateProfile(this.profileId, this.profileForm.value)
      .subscribe({
        next: (profileData: any) => {
          this.handleCloseModal();
          this.profileData = profileData.data;
          this.toastrService.success('Profile Updated!', 'Success');
          this.profileSubscription.unsubscribe();

          this.userSubscription = this.profileService
            .getUserProfile()
            .subscribe((userProfile: any) => {
              const { roles } = userProfile.data;
              this.profileService.setUserProfile({
                roles,
                users_profile_info: this.profileData,
              });
            });
        },
        error: (e) => console.error(e),
      });
  }

  handleOpenModal() {
    this.isModalOpen.emit(true);
    this.openModal = true;
  }

  handleCloseModal() {
    this.isModalOpen.emit(false);
    this.openModal = false;
  }

  ngOnDestroy(): void {
    this.profileSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }
}
