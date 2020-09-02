import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { TenantService } from 'src/shared/services/configuration-services/tenant-service/tenant.service';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { ResetPasswordService } from './services/reset-password.service';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

  form: FormGroup;
  tenantLogo: string;
  token: string;
  subscriptions: Subscription[] = [];
  isSpinning: boolean = true;
  isSubmitting: boolean = false;
  isTokenExpired: boolean = false;
  passwordVisible = false;
  confirmPasswordVisible = false;
  compassProHomePageLink: string;

  constructor(
    private fb: FormBuilder,
    private tenantService: TenantService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private resetPasswordService: ResetPasswordService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    this.form = this.fb.group({
      password: [null, [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/)]],
      confirmPassword: [null, [Validators.required, this.confirmationValidator]]
    });
  }

  ngOnInit() {
    this.getCompassProHomePageLink();
    this.getTenantLogo();
    this.activatedRoute.params.subscribe((data: any) => {
      if (data && data.id) {
        this.subscriptions.push(
          this.resetPasswordService.checkToken(data.id)
          .subscribe((response: any) => {
            this.isSpinning = false;
            if (response && response.data && response.data.checkForgotPasswordToken) {
              // Token valid
              this.token = data.id;
            } else {
              // Token expired
              this.isTokenExpired = true;
            }
          }, (error) => {
            const errorObj = ErrorUtil.getErrorObject(error);
            this.isSpinning = false;
            if (errorObj.message !== ErrorUtil.AUTH_TOKEN_EXPIRED) {
              this.messageService.error(errorObj.message);
            } else {
              // do nothing
            }
            if (errorObj.logout) {
              this.authenticationService.logout();
            }
          })
        );
      }
    });
  }

  getTenantLogo() {
    this.subscriptions.push(
      this.tenantService.getTenantLogo().subscribe(
        (response) => {
          if (response) {
            this.tenantLogo = response;
          }
        },
        (error) => {
          // this.messageService.error(AppMessages.SOMETHING_WENT_WRONG);
        }
      )
    );
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.form.controls.confirmPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.form.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  }

  submitForm() {
    // tslint:disable-next-line: forin
    for (const key in this.form.controls) {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    }

    if (this.form.valid) {
      this.isSubmitting = true;
      this.subscriptions.push(
        this.resetPasswordService.resetPassword(this.token, this.form.value.password)
          .subscribe((response: any) => {
            this.isSubmitting = false;
            this.messageService.success(AppMessages.PASSWORD_UPDATED);
            this.router.navigate(
              [AppUrlConstants.SLASH, AppUrlConstants.LOGIN]
            );
          }, (error) => {
            const errorObj = ErrorUtil.getErrorObject(error);
            this.isSubmitting = false;
            if (errorObj.message !== ErrorUtil.AUTH_TOKEN_EXPIRED) {
              this.messageService.error(errorObj.message);
            } else {
              // do nothing
            }
            if (errorObj.logout) {
              this.authenticationService.logout();
            }
          })
      );
    }
  }

  getCompassProHomePageLink() {
    this.compassProHomePageLink = environment.compassProWordpressHome;
  }

  ngOnDestroy() {
    // unsubscribing all the subscriptions
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
