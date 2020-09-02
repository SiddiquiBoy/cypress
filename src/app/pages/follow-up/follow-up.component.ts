import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'src/app/modals/menu-item/menu-item';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { RouterConstants } from 'src/shared/constants/router-constants/router-constants';

@Component({
  selector: 'app-follow-up',
  templateUrl: './follow-up.component.html',
  styleUrls: ['./follow-up.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FollowUpComponent implements OnInit {

  sidebarMenuItems: MenuItem[] = [];
  sidebarMenuWidth: string;

  constructor(
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.setSidebarMenuItems();
    this.sidebarMenuWidth = '190px';
  }

  setSidebarMenuItems() {
    const menuItems = [];
    if (this.authenticationService.checkPermission(Permission.MENU_FOLLOW_UP_ESTIMATES)) {
      menuItems.push(new MenuItem().setMenuItem(MenuConstants.ESTIMATES, null, RouterConstants.FOLLOW_UP_ESTIMATES));
    }
    this.sidebarMenuItems = [...menuItems];
  }

}
