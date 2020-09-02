import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsAddComponent } from './tags-add.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { PageHeaderModule } from '../page-header/page-header.module';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';

@NgModule({
  declarations: [TagsAddComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    PageHeaderModule,
    SharedDirectiveModule,
  ],
})
export class TagsAddModule {}
