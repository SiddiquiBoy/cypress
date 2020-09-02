import { FilterOp } from './filter-op.enum';

export interface FilterData {
  field?: string;
  value?: any;
  op?: FilterOp;
  // op?: string; // FilterOp
  type?: string;
  ignoreCase?: boolean;
}
