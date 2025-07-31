import { Component, Input } from '@angular/core';
import { AuthService } from '../../auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-passowrd',
  templateUrl: './forgot-passowrd.component.html',
})
export class ForgotPassowrdComponent {
  constructor(
    private authService: AuthService,
    private toastrService: ToastrService
  ) {}
  isOpenModal: boolean = false;
  resetPasswordForm!: FormGroup;
  isLoading: boolean = false;
  @Input() isLoginMode: boolean = true;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.resetPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  handleModal() {
    this.isOpenModal = !this.isOpenModal;
  }

  handleConfirm() {
    this.isLoading = true;
    this.authService
      .resetPasswordRequest({
        email: this.resetPasswordForm.value.email,
      })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.toastrService.success('Please check your inbox.', 'Email sent!');
          this.resetPasswordForm.reset();
          this.handleModal()
        },
        error: (err) => {
          this.isLoading = false;
          this.toastrService.error(
            err?.error?.message ||
              'Something went wrong, please try again aftr sometime',
            'Error!'
          );
        },
      });
  }
}
