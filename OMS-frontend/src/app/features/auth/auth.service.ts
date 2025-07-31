import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  tap,
  throwError,
  Subscription,
} from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from './user.model';
import { MsalService } from '@azure/msal-angular';
import { ProfileService } from '../self-service/profile/profile.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';

export interface AuthResponseData {
  is_success: boolean;
  message: string;
  data: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    deletedAt: Date | null;
    deletedBy: string | null;
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    passwordResetToken: string | null;
    activeOrganization: string | null;
    organization: string | null;
    department: string | null;
    designation: string | null;
    userOrganizationRole: any[];
    userProfile: unknown;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  constructor(
    private http: HttpClient,
    private router: Router,
    private msalService: MsalService,
    public profileService: ProfileService,
    private socialAuthService: SocialAuthService
  ) {}
  user = new BehaviorSubject<User | null>(null);
  private subscription: Subscription = new Subscription();
  private userSubscription: Subscription = new Subscription();

  isLoggedIn() {
    const user = localStorage.getItem('user');
    if (user) {
      const token = JSON.parse(user)._token;
      return !!token;
    }

    return false;
  }

  getCurrentUser() {
    const user = localStorage.getItem('profileData');
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }

  getUserAccesses() {
    const user = this.getCurrentUser();
    if (user) {
      const access = user.roles
        .flat()
        .map((role: any) => role.features.map((fe: any) => fe.name));

      return access.flat();
    }

    return [];
  }

  signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    username: string
  ) {
    return this.http
      .post<AuthResponseData>(environment.baseUrl + '/signUp', {
        email,
        password,
        firstName,
        lastName,
        username,
      })
      .pipe(catchError(this.handleError));
  }

  login(email: string, password: string) {
    return this.http
      .post<any>(environment.baseUrl + '/signIn', {
        email,
        password,
      })
      .pipe(
        catchError(this.handleError),
        tap((res) =>
          this.handleAuthentication({ ...res.user, roles: res.roles })
        )
      );
  }

  getUserData(currentUser: any) {
    this.userSubscription = this.profileService.getUserProfile().subscribe({
      next: (profileData: any) => {
        localStorage.setItem(
          'profileData',
          JSON.stringify({ ...currentUser, ...profileData.data })
        );
        this.profileService.setUserProfile(profileData.data);
      },
      error: (e) => console.error(e),
    });
  }

  oAuthLogin(accessToken: string, oauthClient: string) {
    return this.http
      .post<any>(environment.baseUrl + '/oauth/signIn', {
        accessToken,
        oauthClient,
      })
      .pipe(
        catchError(this.handleError),
        tap((res) => {
          this.handleAuthentication({ ...res.user, roles: res.roles });
        })
      );
  }

  logout() {
    this.http.post(environment.baseUrl + '/signOut', {}).subscribe({
      next: (res) => {
        if (this.msalService.instance.getActiveAccount()?.idToken) {
          this.msalService.instance.loginRedirect();
        }
        this.socialAuthService.signOut();

        this.clearUser();
      },
    });
  }

  clearUser() {
    localStorage.removeItem('profileData');
    localStorage.removeItem('user');
    this.router.navigate(['/auth']);
    this.user.next(null);
  }

  zohoLogin() {
    // return this.http.get(
    //   'https://accounts.zoho.in/oauth/v2/auth?response_type=code&client_id=1000.P1FJ3A37HUXY2YLU1E3X3QF0M2X6OQ&scope=email&redirect_uri=http://localhost:4200'
    // );
  }

  private handleError(errResponse: HttpErrorResponse) {
    let errorMsg = 'An unknow error occurered';

    if (!errResponse.error) {
      return throwError(() => new Error(errorMsg));
    }

    return throwError(() => new Error(errResponse.error.message));
  }

  private handleAuthentication(luser: any) {
    const user = new User(
      luser.email,
      luser.id,
      luser.username,
      luser.orgId,
      luser.token
    );
    this.user.next(user);
    localStorage.setItem('user', JSON.stringify(user));
    if (user.orgId) {
      this.subscription = this.profileService.getUserProfile().subscribe({
        next: (profileData: any) => {
          localStorage.setItem(
            'profileData',
            JSON.stringify({ ...user, ...profileData.data })
          );
          this.profileService.setUserProfile(profileData.data);
        },
        error: (e) => console.error(e),
      });
    }
  }

  resetPasswordRequest(payload: any) {
    return this.http.post(
      environment.baseUrl + '/users/forgot-password',
      payload
    );
  }

  resetPassword(payload: any) {
    return this.http.post(
      environment.baseUrl + '/users/reset-password',
      payload
    );
  }

  changePassword(payload: any) {
    return this.http.post(
      environment.baseUrl + '/users/change-password',
      payload
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }
}
