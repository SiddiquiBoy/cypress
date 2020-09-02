import { Injectable } from '@angular/core';
import { MenuItemGroup } from 'src/app/modals/menu-item/menu-item-group';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { IconConstants } from 'src/shared/constants/icon-constants/icon-constants';
import { RouterConstants } from 'src/shared/constants/router-constants/router-constants';
import { MenuItem } from 'src/app/modals/menu-item/menu-item';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';

@Injectable({
  providedIn: 'root'
})
export class MainUiService {

  constructor(
    private authenticationService: AuthenticationService,
  ) { }

  private menuItemGroups: MenuItemGroup[] = [];
  // private reverseMenuItemGroups: MenuItemGroup[] = [];

  /**
   * @description sets and returns the menu item groups
   * @author Pulkit Bansal
   * @date 2020-05-06
   * @returns {MenuItemGroup[]}
   * @memberof MainUiService
   */
  public setMenuItemGroups(): MenuItemGroup[] {
    this.menuItemGroups = [];
    let menuItemGroup: MenuItemGroup = new MenuItemGroup();

    // dashboard menu item

    // if (this.authenticationService.checkRole('super-admin') || this.authenticationService.checkRole('admin')) {
    if (this.authenticationService.checkPermission(Permission.MENU_DASHBOARD)) {
      this.addToMenuItemGroup(this.menuItemGroups, this.createMenuItemGroupToAdd(MenuConstants.DASHBOARD, IconConstants.DASHBOARD, RouterConstants.DASHBOARD, []));
    }

    // companies menu item

    // if (this.authenticationService.checkRole('super-admin') || this.authenticationService.checkRole('admin')) {
    if (this.authenticationService.checkPermission(Permission.MENU_COMPANIES)) {
      this.addToMenuItemGroup(this.menuItemGroups, this.createMenuItemGroupToAdd(MenuConstants.COMPANIES, IconConstants.COMPANIES, RouterConstants.COMPANIES, []));
    }

    // demos menu item

    if (this.authenticationService.checkPermission(Permission.MENU_DEMOS)) {
      this.addToMenuItemGroup(this.menuItemGroups, this.createMenuItemGroupToAdd(MenuConstants.DEMOS, IconConstants.DEMOS, RouterConstants.DEMOS, []));
    }

    // calls menu item

    // if (this.authenticationService.checkPermission(Permission.MENU_CALLS)) {
    //   menuItemGroup = new MenuItemGroup();
    //   menuItemGroup.items = [];

    //   this.addToMenuItemGroupItems(menuItemGroup.items, this.createMenuItemToAdd(MenuConstants.CALLS, null, RouterConstants.CALLS));

    //   this.addToMenuItemGroupItems(menuItemGroup.items, this.createMenuItemToAdd(MenuConstants.BOOKINGS, null, RouterConstants.CALLS_BOOKINGS));

    //   this.addToMenuItemGroup(this.menuItemGroups, this.createMenuItemGroupToAdd(MenuConstants.CALLS, IconConstants.CALLS, RouterConstants.CALLS, menuItemGroup.items));
    // }

    // schedule menu item

    // if (!this.authenticationService.checkRole('super-admin')) {
    if (this.authenticationService.checkPermission(Permission.MENU_SCHEDULE)) {
      this.addToMenuItemGroup(this.menuItemGroups, this.createMenuItemGroupToAdd(MenuConstants.SCHEDULE, IconConstants.SCHEDULE, RouterConstants.SCHEDULE, []));
    }

    // dispatch menu item

    // if (!this.authenticationService.checkRole('super-admin')) {
    if (this.authenticationService.checkPermission(Permission.MENU_DISPATCH)) {
      this.addToMenuItemGroup(this.menuItemGroups, this.createMenuItemGroupToAdd(MenuConstants.DISPATCH, IconConstants.DISPATCH, RouterConstants.DISPATCH, []));
    }

    // invoice menu item

    // if (!this.authenticationService.checkRole('super-admin')) {
    if (this.authenticationService.checkPermission(Permission.MENU_INVOICE)) {
      this.addToMenuItemGroup(this.menuItemGroups, this.createMenuItemGroupToAdd(MenuConstants.INVOICE, IconConstants.INVOICE, RouterConstants.INVOICE, []));
    }

    // follow up menu item

    if (this.authenticationService.checkPermission(Permission.MENU_FOLLOW_UP)) {
      this.addToMenuItemGroup(this.menuItemGroups, this.createMenuItemGroupToAdd(MenuConstants.FOLLOW_UP, IconConstants.FOLLOW_UP, RouterConstants.FOLLOW_UP, []));
    }

    // reports menu item

    // if (this.authenticationService.checkRole('super-admin') || this.authenticationService.checkRole('admin')) {
    if (this.authenticationService.checkPermission(Permission.MENU_REPORTS)) {
      // menuItemGroup = new MenuItemGroup();
      // menuItemGroup.items = [];

      // this.addToMenuItemGroupItems(menuItemGroup.items, this.createMenuItemToAdd(MenuConstants.HOME, null, RouterConstants.REPORTS_HOME));

      // this.addToMenuItemGroupItems(menuItemGroup.items, this.createMenuItemToAdd(MenuConstants.ALL, null, RouterConstants.REPORTS_ALL));

      // this.addToMenuItemGroupItems(menuItemGroup.items, this.createMenuItemToAdd(MenuConstants.SCHEDULED, null, RouterConstants.REPORTS_SCHEDULED));

      // this.addToMenuItemGroup(this.menuItemGroups, this.createMenuItemGroupToAdd(MenuConstants.REPORTS, IconConstants.REPORTS, RouterConstants.REPORTS, menuItemGroup.items));

      this.addToMenuItemGroup(this.menuItemGroups, this.createMenuItemGroupToAdd(MenuConstants.REPORTS, IconConstants.REPORTS, RouterConstants.REPORTS, []));
    }

    // pricebook menu item

    // if (this.authenticationService.checkRole('super-admin')) {
    if (this.authenticationService.checkPermission(Permission.MENU_PRICEBOOK)) {
      this.addToMenuItemGroup(this.menuItemGroups, this.createMenuItemGroupToAdd(MenuConstants.PRICE_BOOK, IconConstants.FUND, RouterConstants.PRICE_BOOK, []));
    }

    // customer menu item

    if (this.authenticationService.checkPermission(Permission.MENU_CUSTOMERS)) {
      this.addToMenuItemGroup(this.menuItemGroups, this.createMenuItemGroupToAdd(MenuConstants.CUSTOMERS, IconConstants.USER, RouterConstants.CUSTOMERS, []));
    }

    // project menu item

    if (this.authenticationService.checkPermission(Permission.MENU_PROJECTS)) {
      this.addToMenuItemGroup(this.menuItemGroups, this.createMenuItemGroupToAdd(MenuConstants.PROJECTS, IconConstants.PROJECT, RouterConstants.PROJECTS, []));
    }

    // jobs menu item

    if (this.authenticationService.checkPermission(Permission.MENU_JOBS)) {
      this.addToMenuItemGroup(this.menuItemGroups, this.createMenuItemGroupToAdd(MenuConstants.JOBS, IconConstants.JOB, RouterConstants.JOBS, []));
    }

    // vender menu
    if (this.authenticationService.checkPermission(Permission.MENU_VENDORS)) {
      this.addToMenuItemGroup(this.menuItemGroups, this.createMenuItemGroupToAdd(MenuConstants.VENDORS, IconConstants.VENDOR, RouterConstants.VENDORS, []));
    }

    // settings menu item

    // if (this.authenticationService.checkRole('super-admin') || this.authenticationService.checkRole('admin')) {
    if (this.authenticationService.checkPermission(Permission.MENU_SETTINGS)) {
      // menuItemGroup = new MenuItemGroup();
      // menuItemGroup.items = [];

      // this.addToMenuItemGroupItems(menuItemGroup.items, this.createMenuItemToAdd(MenuConstants.BILLINGS, IconConstants.BILLING, RouterConstants.SETTINGS_BILLINGS));

      // this.addToMenuItemGroupItems(menuItemGroup.items, this.createMenuItemToAdd(MenuConstants.COMPANY_PROFILE, IconConstants.COMPANY_PROFILE, RouterConstants.SETTINGS_PROFILE));

      // this.addToMenuItemGroupItems(menuItemGroup.items, this.createMenuItemToAdd(MenuConstants.PEOPLE, IconConstants.PEOPLE, RouterConstants.SETTINGS_PEOPLE));

      // this.addToMenuItemGroupItems(menuItemGroup.items, this.createMenuItemToAdd(MenuConstants.OPERATIONS, IconConstants.OPERATION, RouterConstants.SETTINGS_OPERATIONS));

      // this.addToMenuItemGroupItems(menuItemGroup.items, this.createMenuItemToAdd(MenuConstants.ROLES, IconConstants.ROLE, RouterConstants.SETTINGS_ROLES));

      // this.addToMenuItemGroupItems(menuItemGroup.items, this.createMenuItemToAdd(MenuConstants.TAGS, IconConstants.TAGS, RouterConstants.SETTINGS_TAGS));

      // this.addToMenuItemGroupItems(menuItemGroup.items, this.createMenuItemToAdd(MenuConstants.TIMESHEETS, IconConstants.TIMESHEETS, RouterConstants.SETTINGS_TIMESHEETS));

      // this.addToMenuItemGroupItems(menuItemGroup.items, this.createMenuItemToAdd(MenuConstants.ZONES, IconConstants.ZONES, RouterConstants.SETTINGS_ZONES));

      this.addToMenuItemGroup(this.menuItemGroups, this.createMenuItemGroupToAdd(MenuConstants.SETTINGS, IconConstants.SETTING, RouterConstants.SETTINGS, []));
    }

    return this.menuItemGroups;
  }

  /**
   * @description sets and returns the reverse menu item groups
   * @author Pulkit Bansal
   * @date 2020-05-06
   * @returns {MenuItemGroup[]}
   * @memberof MainUiService
   */
  // public setReverseMenuItemGroups(): MenuItemGroup[] {
  // this.reverseMenuItemGroups = [];
  // let menuItemGroup: MenuItemGroup = new MenuItemGroup();

  // // notification menu item

  // if (this.authenticationService.checkRole('super-admin') || this.authenticationService.checkRole('admin')) {
  //   this.addToMenuItemGroup(this.reverseMenuItemGroups, this.createMenuItemGroupToAdd(MenuConstants.NOTIFICATION, IconConstants.NOTIFICATION, RouterConstants.NOTIFICATION, []));
  // }

  // settings menu item

  // if (this.authenticationService.checkRole('super-admin') || this.authenticationService.checkRole('admin')) {
  //   menuItemGroup = new MenuItemGroup();
  //   menuItemGroup.items = [];

  //   this.addToMenuItemGroupItems(menuItemGroup.items, this.createMenuItemToAdd(MenuConstants.BILLINGS, IconConstants.BILLING, RouterConstants.SETTINGS_BILLINGS));

  //   this.addToMenuItemGroupItems(menuItemGroup.items, this.createMenuItemToAdd(MenuConstants.COMPANY_PROFILE, IconConstants.COMPANY_PROFILE, RouterConstants.SETTINGS_PROFILE));

  //   this.addToMenuItemGroupItems(menuItemGroup.items, this.createMenuItemToAdd(MenuConstants.PEOPLE, IconConstants.PEOPLE, RouterConstants.SETTINGS_PEOPLE));

  //   this.addToMenuItemGroupItems(menuItemGroup.items, this.createMenuItemToAdd(MenuConstants.OPERATIONS, IconConstants.OPERATION, RouterConstants.SETTINGS_OPERATIONS));

  //   this.addToMenuItemGroupItems(menuItemGroup.items, this.createMenuItemToAdd(MenuConstants.ROLES, IconConstants.ROLE, RouterConstants.SETTINGS_ROLES));

  //   this.addToMenuItemGroupItems(menuItemGroup.items, this.createMenuItemToAdd(MenuConstants.TAGS, IconConstants.TAGS, RouterConstants.SETTINGS_TAGS));

  //   this.addToMenuItemGroupItems(menuItemGroup.items, this.createMenuItemToAdd(MenuConstants.TIMESHEETS, IconConstants.TIMESHEETS, RouterConstants.SETTINGS_TIMESHEETS));

  //   this.addToMenuItemGroupItems(menuItemGroup.items, this.createMenuItemToAdd(MenuConstants.ZONES, IconConstants.ZONES, RouterConstants.SETTINGS_ZONES));

  //   this.addToMenuItemGroup(this.reverseMenuItemGroups, this.createMenuItemGroupToAdd(MenuConstants.SETTINGS, IconConstants.SETTING, RouterConstants.SETTINGS, menuItemGroup.items));
  // }

  // return this.reverseMenuItemGroups;
  // }

  /**
   * @description creates a menuItemGroup to add to the menuItemGroup[]
   * @author Pulkit Bansal
   * @date 2020-05-06
   * @param {string} label
   * @param {string} icon
   * @param {string} route
   * @param {MenuItem[]} items
   * @returns {MenuItemGroup}
   * @memberof MainComponent
   */
  createMenuItemGroupToAdd(label: string, icon: string, route: string, items: MenuItem[]): MenuItemGroup {
    const menuItemGroup: MenuItemGroup = new MenuItemGroup();
    if (label) {
      menuItemGroup.label = label;
    } else {
      // do nothing
    }
    if (icon) {
      menuItemGroup.icon = icon;
    } else {
      // do nothing
    }
    if (route) {
      menuItemGroup.routeTo = route;
    } else {
      // do nothing
    }
    if (items) {
      menuItemGroup.items = items;
    } else {
      // do nothing
    }
    return menuItemGroup;
  }

  /**
   * @description adds the group to the menuItemGroup[]
   * @author Pulkit Bansal
   * @date 2020-05-06
   * @param {MenuItemGroup[]} target
   * @param {MenuItemGroup} source
   * @memberof MainComponent
   */
  addToMenuItemGroup(target: MenuItemGroup[], source: MenuItemGroup) {
    target.push(source);
  }

  /**
   * @description creates a sub menu item to add
   * @author Pulkit Bansal
   * @date 2020-05-06
   * @param {string} label
   * @param {string} icon
   * @param {string} route
   * @returns {MenuItem}
   * @memberof MainUiService
   */
  createMenuItemToAdd(label: string, icon: string, route: string, disabled?: boolean): MenuItem {
    const innerMenuItem: MenuItem = new MenuItem();
    if (label) {
      innerMenuItem.label = label;
    } else {
      // do nothing
    }
    if (icon) {
      innerMenuItem.icon = icon;
    } else {
      // do nothing
    }
    if (route) {
      innerMenuItem.routeTo = route;
    } else {
      // do nothing
    }
    innerMenuItem.disabled = disabled;
    return innerMenuItem;
  }

  /**
   * @description adds a sub menu item to the items array of the menu
   * @author Pulkit Bansal
   * @date 2020-05-06
   * @param {MenuItem[]} target
   * @param {MenuItem} source
   * @memberof MainComponent
   */
  addToMenuItemGroupItems(target: MenuItem[], source: MenuItem) {
    target.push(source);
  }

  /**
   * @description to get all the menu items
   * used in can activate services to find the next route to navigate
   * @author Pulkit Bansal
   * @date 2020-05-06
   * @returns {MenuItemGroup[]}
   * @memberof MainUiService
   */
  public getAllMenuItemGroups(): MenuItemGroup[] {
    // return [...this.setMenuItemGroups(), ...this.setReverseMenuItemGroups()];
    return [...this.setMenuItemGroups()];
  }

  /**
   * @description to get the next authorized route
   * @author Pulkit Bansal
   * @date 2020-05-06
   * @returns {string}
   * @memberof MainUiService
   */
  getNextRoute(currentRoute: string): string {
    const menuItemGroups: MenuItemGroup[] = this.getAllMenuItemGroups();
    let foundRoute: string = null;
    menuItemGroups.forEach((menuItemGroup) => {
      if (!foundRoute) {
        if (menuItemGroup.routeTo && menuItemGroup.routeTo !== currentRoute) {
          foundRoute = menuItemGroup.routeTo;
        }
      } else {
        // do nothing
      }
      // if (!foundRoute) {
      //   if (menuItemGroup.items && menuItemGroup.items.length > 0) {
      //     menuItemGroup.items.forEach((menuItem) => {
      //       if (!foundRoute) {
      //         if (menuItem.routeTo && menuItem.routeTo !== currentRoute) {
      //           foundRoute = menuItem.routeTo;
      //         }
      //       } else {
      //         // do nothing
      //       }
      //     });
      //   }
      // } else {
      //   // do nothing
      // }
    });
    return foundRoute;
  }

}

