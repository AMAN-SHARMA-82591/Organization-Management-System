import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/features/auth/auth.service';
import { ProfileService } from 'src/app/features/self-service/profile/profile.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
})
export class ProfileMenuComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  userName: string = '';
  private subscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProfileData();
  }

  getProfileData() {
    this.subscription = this.profileService.userProfile$.subscribe(
      (profileData) => {
        if (Object.keys(profileData).length) {
          const { users_profile_info: userInfo } = profileData;
          this.userName = `${userInfo.firstName} ${userInfo.lastName}`;
        }
      }
    );
  }

  toggleMenu(event: any) {
    event.preventDefault();

    return (this.isMenuOpen = !this.isMenuOpen);
  }

  handleLogout() {
    this.authService.logout();
  }

  handlePassword() {
    this.router.navigate(['/change-password'])
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
