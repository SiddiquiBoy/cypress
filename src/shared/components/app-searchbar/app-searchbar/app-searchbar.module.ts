import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSearchbarComponent } from './app-searchbar.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';



@NgModule({
  declarations: [AppSearchbarComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    SharedDirectiveModule
  ],
  exports: [AppSearchbarComponent],
  entryComponents: [AppSearchbarComponent]
})
export class AppSearchbarModule { }
