import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AppSearchBarService } from './services/app-search-bar.service';
import { MenuItemGroup } from 'src/app/modals/menu-item/menu-item-group';
import { AppSearchResult } from 'src/app/modals/app-search-result/app-search-result';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { RouterConstants } from 'src/shared/constants/router-constants/router-constants';
import { MenuItem } from 'src/app/modals/menu-item/menu-item';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-searchbar',
  templateUrl: './app-searchbar.component.html',
  styleUrls: ['./app-searchbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppSearchbarComponent implements OnInit, OnDestroy {

  @Input() searchPlaceholder = 'Search';
  @Input() inputSearchStyle = 'default';

  @Output() searchValue = new EventEmitter<{}>();

  searchText$ = new Subject<string>();
  subscriptions: Subscription[] = [];

  // Search Bar
  inputValue?: string;
  menuItemGroups: MenuItemGroup[] = [];

  constructor(
    private appSearchBarService: AppSearchBarService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.searchText$
        .pipe(
          debounceTime(750),
          distinctUntilChanged()
        )
        .subscribe((value) => {
          this.searchValue.emit(value);
        })
    );

    this.subscriptions.push(
      this.appSearchBarService.searchResult$.subscribe(
        (result) => {
          this.menuItemGroups = this.createMenuItemGroupsFromAppSearchResult(result);
        }
      )
    );

  }


  /**
   * @description handle search input event
   * @author Aman Purohit
   * @date 2020-06-08
   * @param {Event} event
   * @memberof AppSearchbarComponent
   */
  onInput(event: Event): void {
    this.inputValue = this.inputValue.trim();
    const value = (event.target as HTMLInputElement).value.trim();
    this.searchText$.next(value);
  }

  createMenuItemGroupsFromAppSearchResult(result: AppSearchResult) {
    const menuItemGroups: MenuItemGroup[] = [];
    // tslint:disable-next-line: forin
    for (const prop in result) {
      switch (prop) {
        case 'customers': {
          const menuItemGroup: MenuItemGroup = new MenuItemGroup();
          menuItemGroup.label = MenuConstants.CUSTOMERS;
          menuItemGroup.routeTo = RouterConstants.CUSTOMERS;
          const menuItems: MenuItem[] = [];
          result.customers.forEach((cus) => {
            const menuItem: MenuItem = new MenuItem();
            menuItem.label = cus.fullName;
            menuItem.routeTo = RouterConstants.CUSTOMERS + AppUrlConstants.SLASH + cus.id + AppUrlConstants.SLASH + AppUrlConstants.VIEW;
            menuItems.push(menuItem);
          });
          menuItemGroup.items = menuItems;
          if (menuItemGroup && menuItemGroup.items && menuItemGroup.items.length > 0) {
            menuItemGroups.push(menuItemGroup);
          } else {
            // do nothing
          }
          break;
        }
        case 'employees': {
          const menuItemGroup: MenuItemGroup = new MenuItemGroup();
          menuItemGroup.label = MenuConstants.EMPLOYEES;
          menuItemGroup.routeTo = RouterConstants.SETTINGS_PEOPLE_EMPLOYEES;
          const menuItems: MenuItem[] = [];
          result.employees.forEach((emp) => {
            const menuItem: MenuItem = new MenuItem();
            menuItem.label = emp.fullName;
            menuItem.routeTo = RouterConstants.SETTINGS_PEOPLE_EMPLOYEES;
            menuItems.push(menuItem);
          });
          menuItemGroup.items = menuItems;
          if (menuItemGroup && menuItemGroup.items && menuItemGroup.items.length > 0) {
            menuItemGroups.push(menuItemGroup);
          } else {
            // do nothing
          }
          break;
        }
        case 'technicians': {
          const menuItemGroup: MenuItemGroup = new MenuItemGroup();
          menuItemGroup.label = MenuConstants.TECHNICIANS;
          menuItemGroup.routeTo = RouterConstants.SETTINGS_PEOPLE_TECHNICIANS;
          const menuItems: MenuItem[] = [];
          result.technicians.forEach((tech) => {
            const menuItem: MenuItem = new MenuItem();
            menuItem.label = tech.fullName;
            menuItem.routeTo = RouterConstants.SETTINGS_PEOPLE_TECHNICIANS;
            menuItems.push(menuItem);
          });
          menuItemGroup.items = menuItems;
          if (menuItemGroup && menuItemGroup.items && menuItemGroup.items.length > 0) {
            menuItemGroups.push(menuItemGroup);
          } else {
            // do nothing
          }
          break;
        }
        case 'projects': {
          const menuItemGroup: MenuItemGroup = new MenuItemGroup();
          menuItemGroup.label = MenuConstants.PROJECTS;
          menuItemGroup.routeTo = RouterConstants.PROJECTS;
          const menuItems: MenuItem[] = [];
          result.projects.forEach((proj) => {
            const menuItem: MenuItem = new MenuItem();
            menuItem.label = proj.name;
            menuItem.routeTo = RouterConstants.PROJECTS + AppUrlConstants.SLASH + proj.id + AppUrlConstants.SLASH + AppUrlConstants.VIEW;
            menuItems.push(menuItem);
          });
          menuItemGroup.items = menuItems;
          if (menuItemGroup && menuItemGroup.items && menuItemGroup.items.length > 0) {
            menuItemGroups.push(menuItemGroup);
          } else {
            // do nothing
          }
          break;
        }
        case 'jobs': {
          const menuItemGroup: MenuItemGroup = new MenuItemGroup();
          menuItemGroup.label = MenuConstants.JOBS;
          menuItemGroup.routeTo = RouterConstants.JOBS;
          const menuItems: MenuItem[] = [];
          result.jobs.forEach((job) => {
            const menuItem: MenuItem = new MenuItem();
            menuItem.label = job.jobTypeName;
            menuItem.routeTo = RouterConstants.JOBS + AppUrlConstants.SLASH + job.id + AppUrlConstants.SLASH + AppUrlConstants.VIEW;
            menuItems.push(menuItem);
          });
          menuItemGroup.items = menuItems;
          if (menuItemGroup && menuItemGroup.items && menuItemGroup.items.length > 0) {
            menuItemGroups.push(menuItemGroup);
          } else {
            // do nothing
          }
          break;
        }
      }
    }
    return menuItemGroups;
  }

  onMenuItemClick(item: MenuItem) {
    this.inputValue = null;
    this.router.navigate([item.routeTo]);
  }

  ngOnDestroy() {
    // unsubscribing all the subscriptions
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
