import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  profile: any;
  private subscription: Subscription = new Subscription();

  constructor(public profileService: ProfileService) {}

  ngOnInit(): void {
    this.subscription = this.profileService.userProfile$.subscribe(
      (profileData) => {
        this.profile = profileData.users_profile_info;
      }
    );
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
