import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarNavigationMenuComponent } from './sidebar-navigation-menu.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    SidebarNavigationMenuComponent
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    RouterModule
  ],
  exports: [
    SidebarNavigationMenuComponent
  ],
  entryComponents: [
    SidebarNavigationMenuComponent
  ]
})
export class SidebarNavigationMenuModule { }
