import { SortOrder } from 'src/app/modals/sorting/sort-order.enum';

/**
 * @description a utility class for sorting
 * @author Pulkit Bansal
 * @date 2020-04-30
 * @export
 * @class SortUtil
 */
export class SortUtil {

  /**
   * @description to sort an array based on the value of multiple fields combined
   *  like the firstName and lastName
   * @author Pulkit Bansal
   * @date 2020-04-27
   * @static
   * @param {any[]} array
   * @param {string[]} fields {in the order you want them to sort}
   * @param {boolean} [ignoreCase=true]
   * @param {SortOrder} order
   * @returns {Array<any>}
   * @memberof SortUtil
   */
  static sortArrayWithCombinedField(array: any[], fields: string[], ignoreCase = true, order = SortOrder.ASCENDING): Array<any> {
    if (array && array.length && fields && fields.length) {
      array = array.sort((a, b) => {
        let sorted = false;
        let result: number;
        fields.forEach((field) => {
          if (!sorted) {
            if (ignoreCase) {
              if (order === SortOrder.ASCENDING) {
                result = (a[field].toLowerCase() > b[field].toLowerCase()) ? 1 :
                (b[field].toLowerCase() > a[field].toLowerCase()) ? -1 : 0;
              } else if (order === SortOrder.DESCENDING) {
                result = (b[field].toLowerCase() > a[field].toLowerCase()) ? 1 :
                (a[field].toLowerCase() > b[field].toLowerCase()) ? -1 : 0;
              }
            } else {
              if (order === SortOrder.ASCENDING) {
                result = (a[field] > b[field]) ? 1 : (b[field] > a[field]) ? -1 : 0;
              } else if (order === SortOrder.DESCENDING) {
                result = (b[field] > a[field]) ? 1 : (a[field] > b[field]) ? -1 : 0;
              }
            }
            if (result === 0) {
              // do nothing
            } else {
              sorted = true;
            }
          }
        });
        return result;
      });
    } else {
      // do nothing
    }
    return array;
  }

}
