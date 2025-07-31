import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeService } from './core/services/theme/theme.service';
import { MenuService } from './core/services/menu/menu.service';
import { AuthService } from './features/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from './features/self-service/profile/profile.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'OMS';
  isLoggedIn = false;
  private subscription: Subscription = new Subscription();
  constructor(
    public themeService: ThemeService,
    public menuService: MenuService,
    private authService: AuthService,
    private profileService: ProfileService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    const userOrg = localStorage.getItem('user');
    this.authService.user.subscribe((data) => {
      this.isLoggedIn = this.authService.isLoggedIn() || !!data?._token;
      if (
        currentUser &&
        this.isLoggedIn &&
        userOrg &&
        JSON.parse(userOrg).orgId !== null
      ) {
        this.authService.getUserData(currentUser);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
