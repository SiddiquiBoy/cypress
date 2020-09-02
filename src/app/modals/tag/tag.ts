import { BaseObject } from '../base-object/base-object';
import { ActiveInactiveStatus } from '../enums/active-inactive-status/active-inactive-status.enum';
import { Color } from '../color/color';
import { GeneralStatus } from '../enums/general-status/general-status.enum';
import { Importance } from '../enums/importance/importance.enum';

export class Tag extends BaseObject {
  name: string;
  // color?: Color = new Color(); // this will be color code only not an object
  color: string = '#000000'; // code of the color
  code?: string;
  // importance?: string;
  importance?: Importance;
  // status: ActiveInactiveStatus;
  status: GeneralStatus;
  // conversionCheckbox: boolean;
  // dispatchCheckbox: boolean;
}
