import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'src/app/modals/menu-item/menu-item';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { RouterConstants } from 'src/shared/constants/router-constants/router-constants';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';

@Component({
  selector: 'app-price-book',
  templateUrl: './price-book.component.html',
  styleUrls: ['./price-book.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PriceBookComponent implements OnInit {

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
    // if (this.authenticationService.checkRole('super-admin')) {
    if (this.authenticationService.checkPermission(Permission.MENU_PRICEBOOK_CATEGORIES)) {
      menuItems.push(new MenuItem().setMenuItem(MenuConstants.CATEGORIES, null, RouterConstants.PRICE_BOOK_CATEGORIES));
    }
    // if (this.authenticationService.checkRole('super-admin')) {
    if (this.authenticationService.checkPermission(Permission.MENU_PRICEBOOK_SERVICES)) {
      menuItems.push(new MenuItem().setMenuItem(MenuConstants.SERVICES, null, RouterConstants.PRICE_BOOK_SERVICES));
    }
    this.sidebarMenuItems = [...menuItems];
  }

}
