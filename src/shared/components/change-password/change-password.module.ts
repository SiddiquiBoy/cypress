import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordComponent } from './change-password.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';



@NgModule({
  declarations: [
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    SharedDirectiveModule
  ],
  entryComponents: [
    ChangePasswordComponent
  ],
  exports: [
    ChangePasswordComponent
  ]
})
export class ChangePasswordModule { }
