import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionDirective } from './permission-directive/permission.directive';
import { PhoneFormatPipe } from '../pipes/phone-format.pipe';
import { FirstLetterCapitalPipe } from '../pipes/first-letter-capital-pipe/first-letter-capital.pipe';
import { InputTrimDirective } from './input-trim/input-trim.directive';
import { FormatCamelCasePipe } from '../pipes/format-camel-case.pipe';
import { TransformJobStatusPipe } from '../pipes/transform-job-status.pipe';
import { ChangeDirective } from './change/change.directive';
import { MatchFieldsDirective } from './match-fields/match-fields.directive';
import { MonthFormatPipe } from '../pipes/month-format.pipe';
import { TransformUserTypePipe } from '../pipes/transform-user-type.pipe';



@NgModule({
  declarations: [
    PermissionDirective,
    PhoneFormatPipe,
    FirstLetterCapitalPipe,
    InputTrimDirective,
    FormatCamelCasePipe,
    MonthFormatPipe,
    TransformUserTypePipe,
    TransformJobStatusPipe,
    ChangeDirective,
    MatchFieldsDirective,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    PermissionDirective,
    PhoneFormatPipe,
    FirstLetterCapitalPipe,
    FormatCamelCasePipe,
    TransformUserTypePipe,
    MonthFormatPipe,
    InputTrimDirective,
    TransformJobStatusPipe,
    ChangeDirective,
    MatchFieldsDirective,
  ]
})
export class SharedDirectiveModule { }
