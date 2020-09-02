import { BaseObject } from '../base-object/base-object';

export class JobNote extends BaseObject {
  note: string;
  pinnedAt?: Date;
}
