import { User } from '../user/user';
import { BusinessUnit } from '../business-unit/business-unit';

export class Technician extends User {
    businessUnit: BusinessUnit;
}
