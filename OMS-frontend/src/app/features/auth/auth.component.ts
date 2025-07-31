import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';
import { SocialAuthService } from '@abacritt/angularx-social-login';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  loginForm!: FormGroup;
  isLoading = false;
  alertMessage: string = '';
  isLoginMode: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastrService: ToastrService,
    private msalService: MsalService,
    private socialAuthService: SocialAuthService
  ) {}
  ngOnInit(): void {
    this.initForm();
    this.socialAuthService.authState.subscribe({
      next: (user) => {
        this.authService.oAuthLogin(user.idToken, 'google').subscribe({
          next: (res) => {
            this.isLoading = false;
            this.router.navigate(['/']);
            if (this.isLoginMode)
              this.toastrService.success('Logged In Successfully!', 'Success!');
            else {
              this.toastrService.success('Signed Up Successfully!', 'Success!');

              this.loginForm.reset();
            }
            setTimeout(() => this.clearAlert(), 3000);
          },
          error: (err) => {
            this.toastrService.error(err.message, 'Error!');

            this.isLoading = false;
            this.alertMessage = err;
          },
        });
      },
    });
  }

  onOutlookClick() {
    this.msalService.loginPopup().subscribe({
      next: (user: AuthenticationResult) => {
        this.authService.oAuthLogin(user.idToken, 'outlook').subscribe({
          next: (res) => {
            this.isLoading = false;
            this.router.navigate(['/']);
            if (this.isLoginMode)
              this.toastrService.success('Logged In Successfully!', 'Success!');
            else {
              this.toastrService.success('Signed Up Successfully!', 'Success!');

              this.loginForm.reset();
            }
            setTimeout(() => this.clearAlert(), 3000);
          },
          error: (err) => {
            this.toastrService.error(err.message, 'Error!');

            this.isLoading = false;
            this.alertMessage = err;
          },
        });
      },
    });
  }

  onZohoClick() {
    // this.authService.zohoLogin();
    //   .subscribe({
    //   next: (data: any) => {
    //     console.log('dd', data);
    //   },
    //   error: (e) => console.log(e),
    //   complete: () => {
    //   },
    // });
  }

  private initForm() {
    this.loginForm = new FormGroup({
      firstName: new FormControl(
        '',
        this.isLoginMode ? null : Validators.required
      ),
      lastName: new FormControl(
        '',
        this.isLoginMode ? null : Validators.required
      ),
      username: new FormControl(
        '',
        this.isLoginMode ? null : Validators.required
      ),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ]),
      password: new FormControl('', [
        Validators.required,
        // Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
      ]),
    });
  }

  toggleMode() {
    this.loginForm.reset();
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    let auth: Observable<any>;

    if (this.isLoginMode) {
      auth = this.authService.login(
        this.loginForm.value.email,
        this.loginForm.value.password
      );
    } else {
      auth = this.authService.signUp(
        this.loginForm.value.email,
        this.loginForm.value.password,
        this.loginForm.value.firstName,
        this.loginForm.value.lastName,
        this.loginForm.value.username
      );
    }

    auth.subscribe({
      next: (res) => {
        this.isLoading = false;
        this.router.navigate(['/']);
        if (this.isLoginMode)
          this.toastrService.success('Logged In Successfully!', 'Success!');
        else {
          this.toastrService.success('Signed Up Successfully!', 'Success!');

          this.loginForm.reset();
        }
        setTimeout(() => this.clearAlert(), 3000);
      },
      error: (err) => {
        this.toastrService.error(err.message, 'Error!');

        this.isLoading = false;
        this.alertMessage = err;
      },
    });
  }

  clearAlert() {
    this.alertMessage = '';
  }
}
