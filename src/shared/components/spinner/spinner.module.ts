import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner.component';
import { NzSpinModule } from 'ng-zorro-antd';



@NgModule({
  declarations: [SpinnerComponent],
  imports: [
    CommonModule,
    NzSpinModule
  ],
  exports: [
    SpinnerComponent
  ],
  entryComponents: [
    SpinnerComponent
  ]
})
export class SpinnerModule { }
