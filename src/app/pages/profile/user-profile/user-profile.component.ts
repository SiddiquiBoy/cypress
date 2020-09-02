import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserProfileService } from './services/user-profile-service/user-profile.service';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { User } from 'src/app/modals/user/user';
import { Change } from 'src/app/modals/change/change';
import { ChangeService } from 'src/shared/services/change/change.service';
import { ChangeModule } from 'src/app/modals/enums/change-module/change-module.enum';
import { Utils } from 'src/shared/utilities/utils';
import { AppDropdown } from 'src/app/modals/app-dropdown/app-dropdown';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { ActionEvent } from 'src/app/modals/enums/action-event/action-event.enum';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserProfileComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  isSpinning = false;
  user: User = new User();
  nameRegex: RegExp;
  phoneRegex: RegExp;
  emailRegex: RegExp;
  changes: Change[] = [];
  changedType: string;
  statusDropdown: AppDropdown[] = [];
  fileUploadText: string;
  isImageLoading = false;

  constructor(
    private userProfileService: UserProfileService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
    private changeService: ChangeService
  ) { }

  ngOnInit() {
    this.setChangedType();
    this.setFileUploadText();
    this.setRegExps();
    this.setDropdowns();
    this.getUser();
  }

  setChangedType() {
    this.changedType = ChangeModule.USER;
  }

  setFileUploadText() {
    this.fileUploadText = 'Upload User Image';
  }

  setRegExps() {
    this.emailRegex = Utils.emailRegex;
    this.phoneRegex = Utils.phoneRegex;
    this.nameRegex = Utils.nameRegex;
  }

  setDropdowns() {
    this.setStatusDropdown();
  }

  setStatusDropdown() {
    this.statusDropdown = [];
    this.statusDropdown = Utils.createDropdownForNewEnum(GeneralStatus, false, false, false, false);
  }

  getUser() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.userProfileService.getUser().valueChanges.subscribe(
        (response: any) => {
          if (response) {
            this.user = response.data.me;
            this.changeService.setInitialUser(Utils.cloneDeep(this.user));
            this.isSpinning = false;
            console.log('user is', this.user);
          } else {
            this.isSpinning = false;
            this.changeService.setInitialUser(Utils.cloneDeep(this.user));
          }
        },
        (error) => {
          const errorObj = ErrorUtil.getErrorObject(error);
          if (errorObj.message !== ErrorUtil.AUTH_TOKEN_EXPIRED) {
            this.messageService.error(errorObj.message);
          } else {
            // do nothing
          }
          this.isSpinning = false;
          if (errorObj.logout) {
            this.authenticationService.logout();
          }
        }
      )
    );
  }

  handleImageLoading(status: boolean) {
    this.isImageLoading = status;
  }

  setImageUrl(url: string) {
    this.updateChangesObject('imageUrl', 'Image Url', url, this.user.imageUrl, ActionEvent.UPDATE);
    this.user.imageUrl = url;
  }

  updateChangesObject(fieldName: string, fieldDisplayName: string, newValue: any, oldValue: any, action: string) {
    const changes = this.changeService.getChanges();
    switch (action) {
      case ActionEvent.UPDATE: {
        this.setImageUrlInChanges(fieldName, fieldDisplayName, newValue, oldValue, changes);
        break;
      }
      default: {
        this.setImageUrlInChanges(fieldName, fieldDisplayName, newValue, oldValue, changes);
      }
    }
    this.setChangesObject(changes);
  }

  setImageUrlInChanges(fieldName: string, fieldDisplayName: string, newValue: any, oldValue: any, changes: Change[]) {
    const index = changes.findIndex(change => change.fieldName === fieldName);
    if (index < 0) {
      const change = new Change();
      change.fieldName = fieldName;
      change.fieldDisplayName = fieldDisplayName;
      change.newValue = newValue;
      change.oldValue = oldValue;
      changes.push(change);
    } else {
      changes[index].newValue = newValue;
    }
  }

  setChangesObject(changes: Change[]): void {
    this.changeService.setChanges(changes);
    this.changeService.setMapFromChanges(this.changedType, changes);
  }

  onCancel() {
    this.getUser();
  }

  onSubmit() {
    this.setChanges();
    this.updateUser();
  }

  setChanges() {
    this.changes = this.changeService.getChanges();
  }

  updateUser() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.userProfileService.updateUser(this.user, this.changes)
        .subscribe(
          (response: any) => {
            if (response) {
              this.authenticationService.getUser();
              this.isSpinning = false;
              this.messageService.success(AppMessages.USER_PROFILE_UPDATED);
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
