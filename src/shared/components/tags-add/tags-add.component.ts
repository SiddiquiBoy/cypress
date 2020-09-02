import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Tag } from 'src/app/modals/tag/tag';
import { NotificationService } from 'src/shared/services/notification-service/notification.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { TagsService } from 'src/app/pages/settings/operations/tags/services/tags.service';
import { Subscription } from 'rxjs';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { Utils } from 'src/shared/utilities/utils';
import { Importance } from 'src/app/modals/enums/importance/importance.enum';
import { AppDropdown } from 'src/app/modals/app-dropdown/app-dropdown';
import { ActiveInactiveStatus } from 'src/app/modals/enums/active-inactive-status/active-inactive-status.enum';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { ChangeService } from 'src/shared/services/change/change.service';
import { ChangeModule } from 'src/app/modals/enums/change-module/change-module.enum';
import { Change } from 'src/app/modals/change/change';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { PlaceholderConstant } from 'src/shared/constants/placeholder-constants/placeholder-constant';

@Component({
  selector: 'app-tags-add',
  templateUrl: './tags-add.component.html',
  styleUrls: ['./tags-add.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TagsAddComponent implements OnInit, OnDestroy {
  tagId: string;
  description: string;
  tag: Tag = new Tag();
  isSpinning = false;
  subscriptions: Subscription[] = [];
  importanceDropdown: AppDropdown[] = [];
  statusDropdown: AppDropdown[] = [];
  changes: Change[] = [];
  changedType: string;

  // placeholders
  tagColorPlaceholder: string;
  tagCodePlaceholder: string;
  tagNamePlaceholder: string;
  tagStatusPlaceholder: string;
  tagImportancePlaceholder: string;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private messageService: MessageService,
    private tagService: TagsService,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private changeService: ChangeService
  ) { }

  ngOnInit() {
    this.setPlaceholders();
    this.description = 'Add a new tag';
    this.setDropdowns();
    this.getRouteParams();
    this.changedType = this.getChangedType();
  }

  setPlaceholders() {
    this.tagColorPlaceholder = PlaceholderConstant.TAG_COLOR;
    this.tagCodePlaceholder = PlaceholderConstant.TAG_CODE;
    this.tagNamePlaceholder = PlaceholderConstant.TAG_NAME;
    this.tagStatusPlaceholder = PlaceholderConstant.STATUS;
    this.tagImportancePlaceholder = PlaceholderConstant.IMPORTANCE;
  }

  setDropdowns() {
    this.setImportanceDropdown();
    this.setStatusDropdown();
  }

  setImportanceDropdown() {
    this.importanceDropdown = [];
    // this.importanceDropdown = Utils.createDropdown(Importance, false, true);
    this.importanceDropdown = Utils.createDropdownForNewEnum(
      Importance,
      false,
      false,
      false,
      false
    );
  }

  setStatusDropdown() {
    this.statusDropdown = [];
    // this.statusDropdown = Utils.createDropdown(ActiveInactiveStatus, false, true);
    this.statusDropdown = Utils.createDropdownForNewEnum(
      GeneralStatus,
      false,
      false,
      false,
      false
    );
  }

  getRouteParams() {
    this.subscriptions.push(
      this.activatedRoute.params.subscribe((params: Params) => {
        if (params.id) {
          this.tagId = params.id;
          this.description = 'Edit the tag';
          this.getTag();
        } else {
          this.tagId = undefined;
          // this.tag.status = ActiveInactiveStatus.ACTIVE;
          this.tag.status = this.statusDropdown.filter(
            (item) =>
              item.value ===
              Utils.getEnumKey(GeneralStatus, GeneralStatus.active)
          )[0].value;
          this.changeService.setInitialTag(Utils.cloneDeep(this.tag));
          // this.setTagStatusForDropdown();
        }
      })
    );
  }

  getTag() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.tagService.getTag(this.tagId).valueChanges.subscribe(
        (response) => {
          if (response) {
            this.tag = response['data']['getTag'];
            // this.setTagImportamceForDropdown();
            // this.setTagStatusForDropdown();
            this.changeService.setInitialTag(Utils.cloneDeep(this.tag));
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

  setTagImportamceForDropdown() {
    const key = Utils.getEnumKey(Importance, this.tag.importance);
    if (key) {
      this.tag.importance = this.importanceDropdown.find(
        (item) => item.label === key
      ).value;
    } else {
      // do nothing --> this case should never occur
    }
  }

  setTagStatusForDropdown() {
    const key = Utils.getEnumKey(ActiveInactiveStatus, this.tag.status);
    if (key) {
      this.tag.status = this.statusDropdown.find(
        (item) => item.label === key
      ).value;
    } else {
      // do nothing --> this case should never occur
    }
  }

  setTagImportamceForBackend() {
    const label = Utils.getDropdownLabel(
      this.importanceDropdown,
      this.tag.importance
    );
    if (label) {
      this.tag.importance = Importance[label];
    } else {
      // do nothing --> this case should never occur
    }
  }

  setTagStatusForBackend() {
    const label = Utils.getDropdownLabel(this.statusDropdown, this.tag.status);
    if (label) {
      this.tag.status = ActiveInactiveStatus[label];
    } else {
      // do nothing --> this case should never occur
    }
  }

  onColorInput() {
    if (!Utils.isValidHexColorCode(this.tag.color)) {
      this.tag.color = MenuConstants.DEFAULT_TAG_COLOR;
    }
  }

  /**
   * @description
   * @author Rajeev Kumar
   * @date 2020-06-05
   * @param {Tag} data
   * @memberof TagsAddComponent
   */
  onSubmit() {
    this.changes = this.changeService.getChanges();
    if (this.tagId) {
      this.updateTag();
    } else {
      this.createTag();
    }
  }

  createTag() {
    this.isSpinning = true;
    // this.setTagImportamceForBackend();
    // this.setTagStatusForBackend();
    this.subscriptions.push(
      this.tagService.createTag(this.tag).subscribe(
        (response) => {
          if (response) {
            this.messageService.success(AppMessages.TAG_ADDED);
            this.isSpinning = false;
            this.navigateToTagsList();
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

  updateTag() {
    this.isSpinning = true;
    // this.setTagImportamceForBackend();
    // this.setTagStatusForBackend();
    this.subscriptions.push(
      this.tagService.updateTag(this.tag, this.changes).subscribe(
        (response) => {
          if (response) {
            this.messageService.success(AppMessages.TAG_UPDATED);
            this.isSpinning = false;
            this.navigateToTagsList();
          } else {
            this.isSpinning = false;
          }
        },
        (error) => {
          const errorObj = ErrorUtil.getErrorObject(error);
          this.isSpinning = false;
          // this.notificationService.error(errorObj.title, errorObj.message);
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

  navigateToTagsList() {
    this.router.navigate([
      AppUrlConstants.SLASH +
      AppUrlConstants.SETTINGS +
      AppUrlConstants.SLASH +
      AppUrlConstants.OPERATIONS +
      AppUrlConstants.SLASH +
      AppUrlConstants.TAGS,
    ]);
  }

  onCancel(): void {
    this.navigateToTagsList();
  }

  getChangedType() {
    return ChangeModule.TAG;
  }

  ngOnDestroy() {
    // unsubscribing all the subscriptions
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
