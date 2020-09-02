import { Component, ViewEncapsulation, OnInit, OnDestroy, Inject } from '@angular/core';
import { User } from 'src/app/modals/user/user';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Utils } from 'src/shared/utilities/utils';
import { MenuItemGroup } from 'src/app/modals/menu-item/menu-item-group';
import { Subscription } from 'rxjs';
import { TenantService } from 'src/shared/services/configuration-services/tenant-service/tenant.service';
import { NotificationService } from 'src/shared/services/notification-service/notification.service';
import { MainUiService } from './services/ui-service/main-ui.service';
import { Role } from 'src/app/modals/enums/role/role.enum';
import { MenuItem } from 'src/app/modals/menu-item/menu-item';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { Router } from '@angular/router';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { environment } from 'src/environments/environment';
import { AppSearchBarService } from 'src/shared/components/app-searchbar/app-searchbar/services/app-search-bar.service';
import { MainService } from './services/main.service';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { AppSearchResult } from 'src/app/modals/app-search-result/app-search-result';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit, OnDestroy {

  isCollapsed = true;
  currentUser: User = new User();
  profileInitials: string;
  menuItems: MenuItemGroup[] = [];
  // reverseMenuItems: MenuItemGroup[] = [];
  tenantLogo: string;
  organizationLogo: string;
  subscriptions: Subscription[] = [];
  showNotificationPanel = false;
  // showPasswordChangeDialog = false;
  notificationCount = 14;
  notificationOverflowCount = 10;
  organisationName: string;
  changePasswordPermission: string;
  isSpinning = false;
  currentApplicationVersion = environment.appVersion;
  currentApplicationReleaseDate = environment.appReleaseDate;
  appSearchBarPermission: string;
  orgId: string;
  searchResult: AppSearchResult = new AppSearchResult();

  constructor(
    private authenticationService: AuthenticationService,
    private tenantService: TenantService,
    private notificationService: NotificationService,
    private mainUiService: MainUiService,
    private mainService: MainService,
    private router: Router,
    private appSearchBarService: AppSearchBarService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {

    this.setPermissions();

    this.getTenantLogo();
    // this.getOrganisationLogo();
    this.getCurrentUser();
    // this.setProfileInitials();

    /* to prevent the expression changed error while detecting changes */
    setTimeout(() => {
      this.setMenuItems();
      // this.setReverseMenuItems();
    }, 0);

    this.subscriptions.push(
      this.authenticationService.organizationUpdated$.subscribe(
        (result) => {
          if (result) {
            this.getOrganisationName();
          } else {
            // do nothing
          }
        }
      )
    );

    this.subscriptions.push(
      this.authenticationService.currentUser.subscribe((user: User) => {
        if (user && user.organization) {
          this.orgId = user.organization.id;
        } else {
          this.orgId = undefined;
        }
      })
    );
  }

  setPermissions() {
    this.setChangePasswordPermission();
    this.setAppSearchBarPermission();
  }

  setChangePasswordPermission() {
    this.changePasswordPermission = Permission.CHANGE_PASSWORD;
  }

  setAppSearchBarPermission() {
    this.appSearchBarPermission = Permission.VIEW_APP_SEARCHBAR;
  }

  /**
   * @description gets the tenant logo
   * @author Pulkit Bansal
   * @date 2020-05-06
   * @memberof MainComponent
   */
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

  getOrganisationLogo() {
    this.subscriptions.push(
      this.tenantService.getOrganisationLogo().subscribe(
        (response) => {
          if (response) {
            this.organizationLogo = response;
          }
        },
        (error) => {
          this.notificationService.error('Error', 'Error while fetching logo' + error.error.message ? ('- ' + error.error.message) : '');
        }
      )
    )
  }

  getOrganisationName() {
    this.organisationName = this.currentUser.organization.name;
  }

  /**
   * @description set the list of menu items
   * @author Pulkit Bansal
   * @date 2020-04-28
   * @memberof MainComponent
   */
  setMenuItems() {
    this.menuItems = this.mainUiService.setMenuItemGroups();
  }

  /**
   * @description set the list of reverse menu items
   * @author Pulkit Bansal
   * @date 2020-04-28
   * @memberof MainComponent
   */
  // setReverseMenuItems() {
  // this.reverseMenuItems = this.mainUiService.setReverseMenuItemGroups();
  // }

  /**
   * @description to get the current user from local storage
   * @author Pulkit Bansal
   * @date 2020-04-28
   * @memberof MainComponent
   */
  getCurrentUser() {
    this.authenticationService.currentUser.subscribe((user: User) => {
      if (user) {
        this.currentUser = user;
        if (this.currentUser) {
          this.setProfileInitials();
          this.getOrganisationName();
        }
      }
    });
    // this.currentUser = Utils.getItemFromLocalStorage('user');
    // if (this.currentUser) {
    //   this.setProfileInitials();
    //   this.getOrganisationName();
    // }
  }

  /**
   * @description set the profile initials displayed in the header
   * @author Pulkit Bansal
   * @date 2020-04-28
   * @memberof MainComponent
   */
  setProfileInitials() {
    this.profileInitials = this.currentUser.firstName.charAt(0).toUpperCase() + this.currentUser.lastName.charAt(0).toUpperCase();
  }

  /**
   * @description to check the role for navigation and display
   * @author Pulkit Bansal
   * @date 2020-05-06
   * @param {string} role
   * @returns {boolean}
   * @memberof MainComponent
   */
  checkRole(role: Role): boolean {
    return this.authenticationService.checkRole(role);
  }

  checkPermission(permission: string): boolean {
    return this.authenticationService.checkPermission(permission);
  }

  openNotificationPanel() {
    this.showNotificationPanel = true;
  }

  closeNotificationPanel() {
    this.showNotificationPanel = false;
  }

  // onPassChange() {
  //   this.showPasswordChangeDialog = false;
  // }

  // onCancelClick() {
  //   this.showPasswordChangeDialog = false;
  // }

  changePassword() {
    // this.showPasswordChangeDialog = true;
    this.router.navigate([AppUrlConstants.SLASH + AppUrlConstants.CHANGE_PASSWORD]);
  }

  onSearchInput(value: string) {
    this.isSpinning = true;
    this.subscriptions.push(
      this.mainService.searchApp(this.orgId, value).valueChanges.subscribe(
        (response) => {
          if (response) {
            this.searchResult = response['data']['searchApp'];
            this.appSearchBarService.searchResult$.next(this.searchResult);
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

  /**
   * @description logout the user
   * @author Pulkit Bansal
   * @date 2020-04-28
   * @memberof MainComponent
   */
  logout() {
    this.authenticationService.logout(true);
  }

  ngOnDestroy() {
    // unsubscribing all subscriptions
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
