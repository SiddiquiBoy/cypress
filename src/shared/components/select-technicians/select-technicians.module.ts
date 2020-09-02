import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectTechniciansComponent } from './select-technicians.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [SelectTechniciansComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    SharedDirectiveModule
  ],
  exports: [SelectTechniciansComponent]
})
export class SelectTechniciansModule { }
