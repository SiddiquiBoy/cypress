import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'transformUserType'
})
export class TransformUserTypePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (!value) {
      return value;
    }
    switch (value) {
      case 'orgAdmin': {
        return 'Org Admin';
      }
      case 'technician': {
        return 'Technician';
      }
      default: {
        return value;
      }
    }
  }

}
