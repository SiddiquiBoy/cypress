import { User } from '../user/user';
import { BusinessUnit } from '../business-unit/business-unit';

export class Employee extends User {
    businessUnit: BusinessUnit;
}
