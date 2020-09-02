import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Router } from '@angular/router';
import { TenantService } from 'src/shared/services/configuration-services/tenant-service/tenant.service';
import { NotificationService } from 'src/shared/services/notification-service/notification.service';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { ForgotPasswordService } from './services/forgot-password.service';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { distinctUntilChanged } from 'rxjs/operators';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { Utils } from 'src/shared/utilities/utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgotPassword.component.html',
  styleUrls: ['./forgotPassword.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ForgotPasswordComponent implements OnInit, OnDestroy {

  form: FormGroup;
  tenantLogo: string;
  subscriptions: Subscription[] = [];
  isSpinning: boolean = false;
  forgotPasswordSuccessMessage: string;
  compassProHomePageLink: string;


  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private tenantService: TenantService,
    private forgotPasswordService: ForgotPasswordService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.pattern(Utils.emailRegex)]]
    });
  }
  ngOnInit() {
    this.getCompassProHomePageLink();
    this.getTenantLogo();
    this.subscriptions.push(
      this.form.get('email').valueChanges.pipe(distinctUntilChanged()).subscribe(val => {
        if (val) {
          this.form.get('email').patchValue(val.toLowerCase());
          this.form.get('email').updateValueAndValidity();
        }
      })
    );
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
          this.messageService.error(AppMessages.SOMETHING_WENT_WRONG);
        }
      )
    );
  }

  submitForm() {
    if (this.form.valid) {
      this.isSpinning = true;
      this.subscriptions.push(
        this.forgotPasswordService.forgotPassword(this.form.value.email)
        .subscribe((response: any) => {
          if (response) {
            // this.messageService.info(`If you have an account with us, you should receive a link to reset password shortly!`)
            // this.form.reset();
            this.forgotPasswordSuccessMessage = 'If you have an account with us, you should receive a link to reset password shortly!';
          }
          this.isSpinning = false;
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
  }
  getCompassProHomePageLink() {
    this.compassProHomePageLink = environment.compassProWordpressHome;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
