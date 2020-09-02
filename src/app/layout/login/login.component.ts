import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Router } from '@angular/router';
import { TenantService } from 'src/shared/services/configuration-services/tenant-service/tenant.service';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/shared/services/notification-service/notification.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Utils } from 'src/shared/utilities/utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  tenantLogo: string;
  subscriptions: Subscription[] = [];
  firstRedirect = true;
  isSpinning = false;
  passwordVisible = false;
  compassProHomePageLink: string;
  compassProRegistrationLink: string;
  emailRegex: RegExp;

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private tenantService: TenantService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.getCompassProHomePageLink();
    this.getCompassProRegistrationLink();
    this.getTenantLogo();
    this.setEmailRegex();
    this.setLoginForm();

    this.subscriptions.push(
      this.loginForm.get('userName').valueChanges.pipe(distinctUntilChanged()).subscribe(val => {
        this.loginForm.get('userName').patchValue(val.toLowerCase());
        this.loginForm.get('userName').updateValueAndValidity();
      })
    );

    this.subscriptions.push(
      this.authenticationService.isErrorThrown$.subscribe(
        (val) => {
          if (val) {
            this.isSpinning = false;
          }
        }
      )
    );

    this.subscriptions.push(
      this.authenticationService.isPermissionSet$.subscribe(
        (val) => {
          if (val) {
            this.isSpinning = false;
            this.router.navigate(['/']);
          } else {
            // do nothing
          }
        },
        (error) => {
          this.isSpinning = false;
          this.notificationService.error(
            'Error', 'Permission Not Set'
          );
        }
      )
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
          this.notificationService.error('Error', 'Error while fetching logo' + error.error.message ? ('- ' + error.error.message) : '');
        }
      )
    );
  }

  setEmailRegex() {
    this.emailRegex = Utils.emailRegex;
  }

  setLoginForm() {
    this.loginForm = this.fb.group({
      userName: [null, [Validators.required, Validators.pattern(this.emailRegex)]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

  submitForm(): void {
    this.isSpinning = true;
    // tslint:disable-next-line: forin
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }
    this.authenticationService.login(this.loginForm.value.userName, this.loginForm.value.password, this.loginForm.value.remember);
  }

  getCompassProHomePageLink() {
    this.compassProHomePageLink = environment.compassProWordpressHome;
  }

  getCompassProRegistrationLink() {
    this.compassProRegistrationLink = environment.compassProWordpressRegistration;
  }

  ngOnDestroy() {
    // unsubscribing all subscriptions
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
