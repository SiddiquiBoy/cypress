import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { AddAddressComponent } from './add-address.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';
import { FormsModule } from '@angular/forms';
import { PageHeaderModule } from '../page-header/page-header.module';
import { PhoneFormatPipe } from 'src/shared/pipes/phone-format.pipe';



@NgModule({
  declarations: [AddAddressComponent],
  imports: [
    NgZorroAntdModule,
    PageHeaderModule,
    CommonModule,
    FormsModule,
    SharedDirectiveModule,
  ],
  exports: [
    AddAddressComponent
  ],
  entryComponents: [
    AddAddressComponent
  ],
  providers: [
    TitleCasePipe,
    PhoneFormatPipe
  ]
})
export class AddAddressModule { }
