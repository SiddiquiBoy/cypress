/**
 * @description to define a menu item
 * @author Pulkit Bansal
 * @date 2020-04-28
 * @export
 * @class MenuItem
 */
export class MenuItem {
  label: string;
  icon: string;
  routeTo: string;
  disabled: boolean;

  /**
   * @description to set a menu item
   * @author Pulkit Bansal
   * @date 2020-05-15
   * @param {string} label
   * @param {string} icon
   * @param {string} routeTo
   * @returns {MenuItem}
   * @memberof MenuItem
   */
  setMenuItem(label: string, icon: string, routeTo: string, disabled?: boolean): MenuItem {
    this.label = label;
    this.icon = icon;
    this.routeTo = routeTo;
    this.disabled = disabled;
    return this;
  }
}
