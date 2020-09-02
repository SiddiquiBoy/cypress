import { BaseObject } from '../base-object/base-object';
import { Role } from '../enums/role/role.enum';
import { ActiveInactiveStatus } from '../enums/active-inactive-status/active-inactive-status.enum';
import { Company } from '../company/company';
import { GeneralStatus } from '../enums/general-status/general-status.enum';

/**
 * @description test object to implement basic login functionality
 * @author Pulkit Bansal
 * @date 2020-04-27
 * @export
 * @class User
 * @extends {BaseObject}
 */
export class User extends BaseObject {
    firstName: string;
    lastName: string;
    fullName: string;
    username: string;
    isAccountVerified: boolean;
    roles: Role[] = []; // ask backend to rename to roles
    password: string;
    homePhone: string;
    officePhone: string;
    email: string;
    organization: Company;
    imageUrl: string;
    status: GeneralStatus;
}

