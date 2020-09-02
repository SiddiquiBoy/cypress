import { BaseObject } from '../base-object/base-object';

export class Attachment extends BaseObject {
  title: string;
  description: string;
  tye: string;
  entityType: any;
  entityId: string;
  files: string[] = [];
}

