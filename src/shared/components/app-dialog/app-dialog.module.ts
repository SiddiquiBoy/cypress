import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDialogComponent } from './app-dialog.component';
import { NzModalModule } from 'ng-zorro-antd';



@NgModule({
  declarations: [AppDialogComponent],
  imports: [
    CommonModule,
    NzModalModule
  ],
  exports: [
    AppDialogComponent
  ],
  entryComponents: [
    AppDialogComponent
  ]
})
export class AppDialogModule { }
