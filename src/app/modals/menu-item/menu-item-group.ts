import { MenuItem } from './menu-item';

/**
 * @description to define an menu item group
 * @author Pulkit Bansal
 * @date 2020-04-28
 * @export
 * @class MenuItemGroup
 */
export class MenuItemGroup {
  label: string;
  icon: string;
  routeTo: string;
  items: MenuItem[] = [];
  disabled: boolean;
}
