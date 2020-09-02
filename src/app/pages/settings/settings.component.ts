import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'src/app/modals/menu-item/menu-item';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { IconConstants } from 'src/shared/constants/icon-constants/icon-constants';
import { RouterConstants } from 'src/shared/constants/router-constants/router-constants';
import { MenuItemGroup } from 'src/app/modals/menu-item/menu-item-group';
import { MainUiService } from 'src/app/layout/main/services/ui-service/main-ui.service';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit {

  // sidebarMenuItems: MenuItem[] = [];
  sidebarMenuItems: MenuItemGroup[] = [];
  sidebarMenuWidth: string;

  constructor(
    private authenticationService: AuthenticationService,
    private mainUiService: MainUiService
  ) { }

  ngOnInit() {
    this.setSidebarMenuItems();
    this.sidebarMenuWidth = '190px';
  }

  setSidebarMenuItems() {
    const menuItemGroups = [];
    if (this.authenticationService.checkPermission(Permission.MENU_SETTINGS)) {
      const menuItems: MenuItem[] = [];
      this.mainUiService.addToMenuItemGroupItems(menuItems, this.mainUiService.createMenuItemToAdd(MenuConstants.CARD, null, RouterConstants.SETTINGS_BILLINGS_CARD));
      this.mainUiService.addToMenuItemGroupItems(menuItems, this.mainUiService.createMenuItemToAdd(MenuConstants.INVOICES, null, RouterConstants.SETTINGS_BILLINGS_INVOICE));
      this.mainUiService.addToMenuItemGroupItems(menuItems, this.mainUiService.createMenuItemToAdd(MenuConstants.PAYMENT, null, RouterConstants.SETTINGS_BILLINGS_PAYMENT));
      this.mainUiService.addToMenuItemGroupItems(menuItems, this.mainUiService.createMenuItemToAdd(MenuConstants.TRANSACTIONS, null, RouterConstants.SETTINGS_BILLINGS_TRANSACTION));
      menuItemGroups.push(this.mainUiService.createMenuItemGroupToAdd(MenuConstants.BILLINGS, null, RouterConstants.SETTINGS_BILLINGS, menuItems));
    }
    if (this.authenticationService.checkPermission(Permission.MENU_SETTINGS_COMPANY_PROFILE)) {
      const menuItems: MenuItem[] = [];
      menuItemGroups.push(this.mainUiService.createMenuItemGroupToAdd(MenuConstants.COMPANY_PROFILE, null, RouterConstants.SETTINGS_COMPANY_PROFILE, menuItems));
    }
    if (this.authenticationService.checkPermission(Permission.MENU_SETTINGS_PEOPLE)) {
      const menuItems: MenuItem[] = [];
      if (this.authenticationService.checkPermission(Permission.MENU_PEOPLE_EMPLOYEES)) {
        this.mainUiService.addToMenuItemGroupItems(menuItems, this.mainUiService.createMenuItemToAdd(MenuConstants.EMPLOYEES, null, RouterConstants.SETTINGS_PEOPLE_EMPLOYEES));
      }
      if (this.authenticationService.checkPermission(Permission.MENU_PEOPLE_TECHNICIANS)) {
        this.mainUiService.addToMenuItemGroupItems(menuItems, this.mainUiService.createMenuItemToAdd(MenuConstants.TECHNICIANS, null, RouterConstants.SETTINGS_PEOPLE_TECHNICIANS));
      }
      menuItemGroups.push(this.mainUiService.createMenuItemGroupToAdd(MenuConstants.PEOPLE, null, RouterConstants.SETTINGS_PEOPLE, menuItems));
    }
    if (this.authenticationService.checkPermission(Permission.MENU_SETTINGS_OPERATIONS)) {
      const menuItems: MenuItem[] = [];
      this.mainUiService.addToMenuItemGroupItems(menuItems, this.mainUiService.createMenuItemToAdd(MenuConstants.BUSINESS_UNITS, null, RouterConstants.SETTINGS_OPERATIONS_BUSINESSUNIT));
      this.mainUiService.addToMenuItemGroupItems(menuItems, this.mainUiService.createMenuItemToAdd(MenuConstants.JOB_TYPE, null, RouterConstants.SETTINGS_OPERATIONS_JOBTYPE));
      this.mainUiService.addToMenuItemGroupItems(menuItems, this.mainUiService.createMenuItemToAdd(MenuConstants.TAGS, null, RouterConstants.SETTINGS_OPERATIONS_TAGS));
      if (this.authenticationService.checkPermission(Permission.MENU_OPERATIONS_TIMESHEET_CODES)) {
        this.mainUiService.addToMenuItemGroupItems(menuItems, this.mainUiService.createMenuItemToAdd(MenuConstants.TIMESHEET_CODES, null, RouterConstants.SETTINGS_OPERATIONS_TIMESHEETCODES));
      }
      menuItemGroups.push(this.mainUiService.createMenuItemGroupToAdd(MenuConstants.OPERATIONS, null, RouterConstants.SETTINGS_OPERATIONS, menuItems));
    }
    if (this.authenticationService.checkPermission(Permission.MENU_SETTINGS_ROLES)) {
      const menuItems: MenuItem[] = [];
      // menuItemGroups.push(this.mainUiService.createMenuItemGroupToAdd(MenuConstants.ROLES, null, RouterConstants.SETTINGS_ROLES, menuItems));
    }
    // if (this.authenticationService.checkPermission(Permission.MENU_SETTINGS_TIMESHEETS)) {
    //   const menuItems: MenuItem[] = [];
    //   menuItemGroups.push(this.mainUiService.createMenuItemGroupToAdd(MenuConstants.TIMESHEET_CODES, null, RouterConstants.SETTINGS_TIMESHEETS, menuItems));
    // }
    // if (this.authenticationService.checkPermission(Permission.MENU_SETTINGS_CUSTOMERS)) {
    //   const menuItems: MenuItem[] = [];
    //   menuItemGroups.push(this.mainUiService.createMenuItemGroupToAdd(MenuConstants.CUSTOMERS, null, RouterConstants.SETTINGS_CUSTOMERS, menuItems));
    // }
    // if (this.authenticationService.checkPermission(Permission.MENU_SETTINGS_PROJECTS)) {
    //   const menuItems: MenuItem[] = [];
    //   menuItemGroups.push(this.mainUiService.createMenuItemGroupToAdd(MenuConstants.PROJECTS, null, RouterConstants.SETTINGS_PROJECTS, menuItems));
    // }
    this.sidebarMenuItems = [...menuItemGroups];
  }

}
