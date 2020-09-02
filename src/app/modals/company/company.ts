import { BaseObject } from '../base-object/base-object';
import { Address } from '../address/address';
import { OrgStatus } from '../enums/org-status/org-status.enum';
import { Project } from '../project/project';
import { Vendor } from '../vendor/vendor';
import { Tag } from '../tag/tag';
import { BusinessUnit } from '../business-unit/business-unit';
import { Employee } from '../people/employee';

export class Company extends BaseObject {
  name: string;
  addresses: Address[] = [];
  status: OrgStatus;
  contact: string;
  employees: Employee[] = [];
  projects: Project[] = [];
  vendors: Vendor[] = [];
  tags: Tag[] = [];
  businessUnits: BusinessUnit[] = [];
  email: string;
  imageUrl: string;
}
