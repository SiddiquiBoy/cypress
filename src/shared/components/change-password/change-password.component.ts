import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChangePasswordService } from './services/change-password-service/change-password.service';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { Utils } from 'src/shared/utilities/utils';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChangePasswordComponent implements OnInit, OnDestroy {

  @ViewChild('changePasswordForm', null) changePasswordForm: NgForm;

  @Output() eEmitOnCancel: EventEmitter<boolean> = new EventEmitter();
  @Output() eEmitOnPassChange: EventEmitter<boolean> = new EventEmitter();

  subscriptions: Subscription[] = [];
  isSpinning = false;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  passwordRegex: RegExp;

  constructor(
    private changePasswordService: ChangePasswordService,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.setRegExps();
  }

  setRegExps() {
    this.setPasswordRegex();
  }

  setPasswordRegex() {
    this.passwordRegex = Utils.passwordRegex;
  }

  onCancel() {
    this.eEmitOnCancel.emit(true);
    this.changePasswordForm.form.reset();
  }

  onSubmit() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.changePasswordService.changePassword(this.oldPassword, this.newPassword).subscribe(
        (response) => {
          if (response) {
            this.messageService.success(AppMessages.PASSWORD_UPDATED);
            this.eEmitOnPassChange.emit(true);
            this.isSpinning = false;
          } else {
            this.isSpinning = false;
          }
        },
        (error) => {
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
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
