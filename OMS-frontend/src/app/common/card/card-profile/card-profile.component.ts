import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProfileInfo } from 'src/app/features/self-service/profile/profile.model';
import { ProfileService } from 'src/app/features/self-service/profile/profile.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-card-profile',
  templateUrl: './card-profile.component.html',
})
export class CardProfileComponent implements OnInit, OnDestroy {
  profileData: ProfileInfo = {
    firstName: '',
    lastName: '',
    designation: '',
    email: '',
    department: '',
    avtaar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  };
  private subscription: Subscription = new Subscription();

  constructor(public profileService: ProfileService) {}
  ngOnInit(): void {
    this.subscription = this.profileService.userProfile$.subscribe(
      (profileData) => {
        if (Object.keys(profileData).length) {
          const { users_profile_info } = profileData;
          this.profileData.firstName = users_profile_info.firstName;
          this.profileData.lastName = users_profile_info.lastName;
          this.profileData.designation = users_profile_info.user.designation.name;
          this.profileData.email = users_profile_info.user.email;
          this.profileData.department = users_profile_info.user.department.name;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
