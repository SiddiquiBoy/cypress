import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralTableComponent } from './general-table.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormatStringPipe } from './format-string.pipe';
import { AppSearchbarModule } from '../../app-searchbar/app-searchbar/app-searchbar.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [GeneralTableComponent, FormatStringPipe],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    AppSearchbarModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    GeneralTableComponent
  ],
  entryComponents: [GeneralTableComponent]
})
export class GeneralTableModule { }
