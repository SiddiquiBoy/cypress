import { FilterData } from '../filtering/filter-data';

export class ColumnItem {
  name: string;
  type?: string;
  columnMap?: string;
  columnMap2?: string;
  showFilter?: boolean = false;
  listOfFilters?: any = [];
  filterFn?: any;
  filterMultiple?: boolean;
  showSort?: boolean = false;
  width?: string = '';
  filter?: FilterData;
  hidden?: boolean = false;
  permanent?: boolean;
  default?: boolean;
  expand?: boolean;
}
