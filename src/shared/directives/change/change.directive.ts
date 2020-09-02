import { Directive, OnChanges, ElementRef, Input } from '@angular/core';
import { ChangeService } from 'src/shared/services/change/change.service';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[changes]'
})
export class ChangeDirective implements OnChanges {

  @Input() changedType: string = null;
  @Input() changedValue: any = null;
  @Input() changedField: string = null;
  @Input() changedFieldDisplayName: string = null;
  @Input() formatterType: string = null;
  // tslint:disable-next-line: no-inferrable-types
  @Input() changeDescription: string = '-';
  // tslint:disable-next-line: no-inferrable-types
  @Input() changeAdditionalDescription: string = '-';
  @Input() changedFieldArrayVariable: string = null;
  @Input() checkOnlyObjectId = false;
  @Input() trimValue = false;

  constructor(
    private el: ElementRef,
    private changeService: ChangeService,
  ) { }

  ngOnChanges() {
    // ng on changes takes some time to detect the changes
    setTimeout(() => {
      if (this.checkDirty()) {
        this.changeService.updateObjectMap(this.changedType, this.changedField, this.changedFieldDisplayName, this.changedValue, this.formatterType, this.changeDescription, this.changeAdditionalDescription, this.changedFieldArrayVariable, this.checkOnlyObjectId, this.trimValue);
      }
    }, 100);
  }

  /**
   * @description changes will be created only when a form is in dirty state
   * @author Pulkit Bansal
   * @date 2020-07-13
   * @returns
   * @memberof ChangeDirective
   */
  checkDirty() {
    if (this.el.nativeElement.classList && this.el.nativeElement.classList.length) {
      const list = this.el.nativeElement.classList;
      let dirty = false;

      let antFormItemControlWrapperProp = false;

      // "ng-tns-c19-80"
      // 1: "ant-form-item-control-wrapper"
      // 2: "ant-col"
      // 3: "ng-star-inserted"

      list.forEach((element) => {
        if (element === 'ng-dirty') {
          dirty = true;
        } else if (element === 'ant-form-item-control-wrapper') {
          antFormItemControlWrapperProp = true;
        } else {
          // do nothing
        }
      });
      if (dirty) {
        return true;
      } else {
        if (antFormItemControlWrapperProp) {
          return true;
        }
        return false;
      }
    } else {
      return false;
    }
  }

}
