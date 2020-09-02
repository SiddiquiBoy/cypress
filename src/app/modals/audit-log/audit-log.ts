import { BaseObject } from '../base-object/base-object';

export class AuditLog extends BaseObject {
  interactedWith: string;
  interactedWithId: string;
  owningEntityType: string;
  segment: string;
  owningEntityId: string;
  organizationId: string;
  modifiedResourceName: string;
  modifiedResourceId: string;
  diff: string[] = [];
  ownerEntityType: string;
  ownerEntityId: string;
  userId: string;
  userName: string;
  metadata: string;
  roles: string[] = [];
}
