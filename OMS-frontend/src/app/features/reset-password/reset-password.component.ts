import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastrService: ToastrService
  ) {}
  resetFrom!: FormGroup;
  isLoading = false;

  ngOnInit() {
    const token = this.route.snapshot.queryParams['token'];

    if (!token) {
      this.router.navigate(['/']);
    }

    this.initForm();
  }

  validatePasswordMatch = (
    control: AbstractControl
  ): { [key: string]: any } | null => {
    const password = this.resetFrom?.get('new-password')?.value as string;
    const passwordConfirm = control.value as string;

    if (password !== passwordConfirm) {
      return { passwordMatch: true };
    }

    return null;
  };

  private initForm() {
    this.resetFrom = new FormGroup({
      ['new-password']: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d][A-Za-z\d@$!%*?&]{8,}$/
        ),
      ]),
      ['confirm-new-password']: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d][A-Za-z\d@$!%*?&]{8,}$/
        ),
        this.validatePasswordMatch,
      ]),
    });
  }

  onSubmit() {
    this.authService
      .resetPassword({
        token: this.route.snapshot.queryParams['token'],
        newPassword: this.resetFrom.value['new-password'],
        confirmNewPassword: this.resetFrom.value['confirm-new-password'],
      })
      .subscribe({
        next: () => {
          this.toastrService.success(
            'Password Updated Successfully',
            'Success!'
          );
          this.router.navigate(['/auth']);
        },
        error: () => {
          this.toastrService.error(
            'Something went wrong, please try again aftr sometime',
            'Error!'
          );
        }
      });
  }
}
