import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { MenuItem } from 'src/app/modals/menu-item/menu-item';
import { MenuItemGroup } from 'src/app/modals/menu-item/menu-item-group';

@Component({
  selector: 'app-sidebar-navigation-menu',
  templateUrl: './sidebar-navigation-menu.component.html',
  styleUrls: ['./sidebar-navigation-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarNavigationMenuComponent implements OnInit {

  // @Input() menuItems: MenuItem[] = [];
  @Input() menuItemsGroup: MenuItemGroup[] = [];

  @Input() sidebarMenuWidth: string = null;

  @Input() sidebarHeading: string = null;

  @Output() eEmitOnMenuItemClick: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onMenuItemClick(item: MenuItem) {
    this.eEmitOnMenuItemClick.emit(item);
  }

}
