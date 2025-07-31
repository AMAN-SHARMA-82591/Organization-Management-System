import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private toastrService: ToastrService
  ) {}

  changePasswordForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  confirmPasswordValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    return control.value.newPassword === control.value.confirmNewPassword
      ? null
      : { passwordMatch: true };
  };

  private initForm() {
    this.changePasswordForm = new FormGroup(
      {
        currentPassword: new FormControl('', [Validators.required]),
        newPassword: new FormControl('', [
          Validators.required,
          Validators.pattern(
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d][A-Za-z\d@$!%*?&]{8,}$/
          ),
        ]),
        confirmNewPassword: new FormControl('', [
          Validators.required,
          Validators.pattern(
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d][A-Za-z\d@$!%*?&]{8,}$/
          ),
        ]),
      },
      { validators: this.confirmPasswordValidator }
    );
  }

  onSubmit() {
    this.authService
      .changePassword({
        oldPassword: this.changePasswordForm.value.currentPassword,
        newPassword: this.changePasswordForm.value.newPassword,
        confirmNewPassword: this.changePasswordForm.value.confirmNewPassword,
      })
      .subscribe({
        next: () => {
          this.toastrService.success(
            'Password Changed Successfully',
            'Success!'
          );
          this.authService.logout();
        },
        error: (err) => {
          const message =
            err.error.message ||
            'Something went wrong, please try again aftr sometime';

          this.toastrService.error(message, 'Error!');
        },
      });
  }
}
