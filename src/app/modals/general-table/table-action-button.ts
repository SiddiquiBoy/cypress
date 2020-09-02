import { TableActionButtonType } from './table-action-button-type.enum';
import { TableActionButtonNzType } from './table-action-button-nz-type.enum';
import { MenuItem } from '../menu-item/menu-item';

export interface TableActionButton {
  label?: string;
  icon?: string;
  nzType?: TableActionButtonNzType;
  nzGhost?: boolean;
  nzBlock?: boolean;
  type?: TableActionButtonType;
  disabled?: () => boolean;
  styleClass?: string;
  onClick?: (item?: any) => any;
  onChildClick?: (childItem?: any) => any;
  menu?: MenuItem[];
}
