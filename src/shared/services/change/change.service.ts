import { Injectable } from '@angular/core';
import { Tag } from 'src/app/modals/tag/tag';
import { Change } from 'src/app/modals/change/change';
import { ChangeModule } from 'src/app/modals/enums/change-module/change-module.enum';
import { BusinessUnit } from 'src/app/modals/business-unit/business-unit';
import { JobType } from 'src/app/modals/job-type/job-type';
import { Employee } from 'src/app/modals/people/employee';
import { TimesheetCode } from 'src/app/modals/timesheet-code/timesheet-code';
import { Technician } from 'src/app/modals/people/technician';
import { User } from 'src/app/modals/user/user';
import { Category } from 'src/app/modals/category/category';
import { Service } from 'src/app/modals/service/service';
import { Job } from 'src/app/modals/job/job';
import { Project } from 'src/app/modals/project/project';
import { Customer } from 'src/app/modals/customer/customer';
import { Utils } from 'src/shared/utilities/utils';
import { DateUtil } from 'src/shared/utilities/date-util';
import { Company } from 'src/app/modals/company/company';
import { Address } from 'src/app/modals/address/address';
import { Vendor } from 'src/app/modals/vendor/vendor';
import { DispatchBoardEvent } from 'src/app/modals/dispatch-board-event/dispatch-board-event';

/**
 * @description new type for setting the map of changes
 * @author Pulkit Bansal
 * @date 2020-07-13
 * @export
 * @class ValueChange
 */
export class ValueChange {
  constructor(
    public initialValue: any,
    public finalValue: any,
    public displayFieldValue: string,
    public fieldActualName: string,
    public description: string,
    public additionalDescription: string,
    public formatterType: string
  ) { }
}

@Injectable({
  providedIn: 'root'
})
export class ChangeService {

  private map = new Map<string, Map<string, ValueChange>>();
  private changes: Change[] = [];

  private initialTag: Tag = null;
  private initialBusinessUnit: BusinessUnit = null;
  private initialJobType: JobType = null;
  private initialTimesheetCode: TimesheetCode = null;
  private initialEmployee: Employee = null;
  private initialTechnician: Technician = null;
  private initialUser: User = null;
  private initialCategory: Category = null;
  private initialService: Service = null;
  private initialJob: Job = null;
  private initialProject: Project = null;
  private initialCustomer: Customer = null;
  private initialCompanyProfile: Company = null;
  private initialAddress: Address = null;
  private initialVendor: Vendor = null;
  private initialCompany: Company = null;
  private initialDispatchBoardEvent: DispatchBoardEvent = null;

  /**
   * @description to set the map object
   * @author Pulkit Bansal
   * @date 2020-07-15
   * @param {Map<string, Map<string, ValueChange>>} map
   * @memberof ChangeService
   */
  setMap(map: Map<string, Map<string, ValueChange>>): void {
    this.map = map;
  }

  /**
   * @description to set the map object from the changes object
   * used currently in case of deleting a job while updating a project
   * @author Pulkit Bansal
   * @date 2020-07-15
   * @param {string} changedType
   * @param {Change[]} changes
   * @memberof ChangeService
   */
  setMapFromChanges(changedType: string, changes: Change[]) {
    const map: Map<string, Map<string, ValueChange>> = new Map();
    const innerMap = new Map<string, ValueChange>();
    changes.forEach((change) => {
      innerMap.set(change.fieldName, new ValueChange(change.oldValue, change.newValue, change.fieldDisplayName, change.fieldName, change.description, change.additionalDescription, change.formatterType));
    });
    map.set(changedType, innerMap);
    this.setMap(map);
  }

  /**
   * @description to get the map of changes object
   * @author Pulkit Bansal
   * @date 2020-07-13
   * @returns {Map<string, Map<string, ValueChange>>}
   * @memberof ChangeService
   */
  getMap(): Map<string, Map<string, ValueChange>> {
    return this.map;
  }

  /**
   * @description to set the changes object
   * used in case of an external change
   * currently used in project job component while removing the job
   * @author Pulkit Bansal
   * @date 2020-07-15
   * @param {Change[]} changes
   * @memberof ChangeService
   */
  setChanges(changes: Change[]): void {
    this.changes = changes;
  }

  /**
   * @description to get the changes object
   * @author Pulkit Bansal
   * @date 2020-07-13
   * @returns {Change[]}
   * @memberof ChangeService
   */
  getChanges(): Change[] {
    return this.changes;
  }

  /**
   * @description to set the initial value of the tag object
   * @author Pulkit Bansal
   * @date 2020-07-13
   * @param {Tag} tag
   * @memberof ChangeService
   */
  setInitialTag(tag: Tag) {
    this.initialTag = tag;
    if (this.map.has(ChangeModule.TAG)) {
      this.map.delete(ChangeModule.TAG);
    }
    this.resetData();
  }

  /**
   * @description to get the initial vlaue of the tag object
   * @author Pulkit Bansal
   * @date 2020-07-13
   * @returns {Tag}
   * @memberof ChangeService
   */
  getInitialTag(): Tag {
    return this.initialTag;
  }

  /**
   * @description to set the initial value of the business unit object
   * @author Pulkit Bansal
   * @date 2020-07-13
   * @param {BusinessUnit} businessUnit
   * @memberof ChangeService
   */
  setInitialBusinessUnit(businessUnit: BusinessUnit) {
    this.initialBusinessUnit = businessUnit;
    if (this.map.has(ChangeModule.BUSINESS_UNIT)) {
      this.map.delete(ChangeModule.BUSINESS_UNIT);
    }
    this.resetData();
  }

  /**
   * @description to get the initial value of the business unit object
   * @author Pulkit Bansal
   * @date 2020-07-13
   * @returns {BusinessUnit}
   * @memberof ChangeService
   */
  getInitialBusinessUnit(): BusinessUnit {
    return this.initialBusinessUnit;
  }

  /**
   * @description to set the initial value of the job type object
   * @author Pulkit Bansal
   * @date 2020-07-14
   * @param {JobType} jobType
   * @memberof ChangeService
   */
  setInitialJobType(jobType: JobType) {
    this.initialJobType = jobType;
    if (this.map.has(ChangeModule.JOB_TYPE)) {
      this.map.delete(ChangeModule.JOB_TYPE);
    }
    this.resetData();
  }

  /**
   * @description to get the initial value of the job type object
   * @author Pulkit Bansal
   * @date 2020-07-14
   * @returns {JobType}
   * @memberof ChangeService
   */
  getInitialJobType(): JobType {
    return this.initialJobType;
  }

  /**
   * @description to get the initial value of the timesheet code object
   * @author Pulkit Bansal
   * @date 2020-07-14
   * @param {TimesheetCode} timesheetCode
   * @memberof ChangeService
   */
  setInitialTimesheetCode(timesheetCode: TimesheetCode) {
    this.initialTimesheetCode = timesheetCode;
    if (this.map.has(ChangeModule.TIMESHEET_CODE)) {
      this.map.delete(ChangeModule.TIMESHEET_CODE);
    }
    this.resetData();
  }

  /**
   * @description to get the initial value of the timesheet code object
   * @author Pulkit Bansal
   * @date 2020-07-14
   * @returns {TimesheetCode}
   * @memberof ChangeService
   */
  getInitialTimesheetCode(): TimesheetCode {
    return this.initialTimesheetCode;
  }

  /**
   * @description to set the initial value of the employee object
   * @author Pulkit Bansal
   * @date 2020-07-14
   * @param {Employee} employee
   * @memberof ChangeService
   */
  setInitialEmployee(employee: Employee) {
    this.initialEmployee = employee;
    if (this.map.has(ChangeModule.EMPLOYEE)) {
      this.map.delete(ChangeModule.EMPLOYEE);
    }
    this.resetData();
  }

  /**
   * @description to get the initial value of the employee object
   * @author Pulkit Bansal
   * @date 2020-07-14
   * @returns {Employee}
   * @memberof ChangeService
   */
  getInitialEmployee(): Employee {
    return this.initialEmployee;
  }

  /**
   * @description to set the initial value of the technician object
   * @author Pulkit Bansal
   * @date 2020-07-14
   * @param {Technician} technician
   * @memberof ChangeService
   */
  setInitialTechnician(technician: Technician) {
    this.initialTechnician = technician;
    if (this.map.has(ChangeModule.TECHNICIAN)) {
      this.map.delete(ChangeModule.TECHNICIAN);
    }
    this.resetData();
  }

  /**
   * @description to get the initial value of the technician object
   * @author Pulkit Bansal
   * @date 2020-07-14
   * @returns {Technician}
   * @memberof ChangeService
   */
  getInitialTechnician(): Technician {
    return this.initialTechnician;
  }

  /**
   * @description to set the initial value of the user object
   * @author Pulkit Bansal
   * @date 2020-07-14
   * @param {User} user
   * @memberof ChangeService
   */
  setInitialUser(user: User) {
    this.initialUser = user;
    if (this.map.has(ChangeModule.USER)) {
      this.map.delete(ChangeModule.USER);
    }
    this.resetData();
  }

  /**
   * @description to get the initial value of the user object
   * @author Pulkit Bansal
   * @date 2020-07-14
   * @returns {User}
   * @memberof ChangeService
   */
  getInitialUser(): User {
    return this.initialUser;
  }

  /**
   * @description to set the initial value of the category object
   * @author Pulkit Bansal
   * @date 2020-07-14
   * @param {Category} category
   * @memberof ChangeService
   */
  setInitialCategory(category: Category) {
    this.initialCategory = category;
    if (this.map.has(ChangeModule.CATEGORY)) {
      this.map.delete(ChangeModule.CATEGORY);
    }
    this.resetData();
  }

  /**
   * @description to get the initial value of the category object
   * @author Pulkit Bansal
   * @date 2020-07-14
   * @returns {Category}
   * @memberof ChangeService
   */
  getInitialCategory(): Category {
    return this.initialCategory;
  }

  /**
   * @description to set the initial value of the service object
   * @author Pulkit Bansal
   * @date 2020-07-14
   * @param {Service} service
   * @memberof ChangeService
   */
  setInitialService(service: Service) {
    this.initialService = service;
    if (this.map.has(ChangeModule.SERVICE)) {
      this.map.delete(ChangeModule.SERVICE);
    }
    this.resetData();
  }

  /**
   * @description to get the initial value of the service object
   * @author Pulkit Bansal
   * @date 2020-07-14
   * @returns {Service}
   * @memberof ChangeService
   */
  getInitialService(): Service {
    return this.initialService;
  }

  /**
   * @description to set the initial value of the job object
   * @author Pulkit Bansal
   * @date 2020-07-14
   * @param {Job} job
   * @memberof ChangeService
   */
  setInitialJob(job: Job) {
    this.initialJob = job;
    if (this.map.has(ChangeModule.JOB)) {
      this.map.delete(ChangeModule.JOB);
    }
    this.resetData();
  }

  /**
   * @description to get the initial value of the job object
   * @author Pulkit Bansal
   * @date 2020-07-14
   * @returns {Job}
   * @memberof ChangeService
   */
  getInitialJob(): Job {
    return this.initialJob;
  }

  /**
   * @description to set the initial value of the project object
   * @author Pulkit Bansal
   * @date 2020-07-14
   * @param {Project} project
   * @memberof ChangeService
   */
  setInitialProject(project: Project) {
    this.initialProject = project;
    if (this.map.has(ChangeModule.PROJECT)) {
      this.map.delete(ChangeModule.PROJECT);
    }
    this.resetData();
  }

  /**
   * @description to get the initial value of the project object
   * @author Pulkit Bansal
   * @date 2020-07-14
   * @returns {Project}
   * @memberof ChangeService
   */
  getInitialProject(): Project {
    return this.initialProject;
  }

  /**
   * @description to set the initial value of the customer object
   * @author Pulkit Bansal
   * @date 2020-07-14
   * @param {Customer} customer
   * @memberof ChangeService
   */
  setInitialCustomer(customer: Customer) {
    this.initialCustomer = customer;
    if (this.map.has(ChangeModule.CUSTOMER)) {
      this.map.delete(ChangeModule.CUSTOMER);
    }
    this.resetData();
  }

  /**
   * @description to get the initial value of the customer object
   * @author Pulkit Bansal
   * @date 2020-07-14
   * @returns {Customer}
   * @memberof ChangeService
   */
  getInitialCustomer(): Customer {
    return this.initialCustomer;
  }

  /**
   * @description set the initial value of company object
   * @author Aman Purohit
   * @date 2020-07-16
   * @param {Company} company
   * @memberof ChangeService
   */
  setInitialCompany(company: Company) {
    this.initialCompany = company;
    if (this.map.has(ChangeModule.COMPANY)) {
      this.map.delete(ChangeModule.COMPANY);
    }
    this.resetData();
  }

  /**
   * @description to get the initial value of the company object
   * @author Aman Purohit
   * @date 2020-07-16
   * @returns {Company}
   * @memberof ChangeService
   */
  getInitialCompany(): Company {
    return this.initialCompany;
  }

  /**
   * @description set the initial value of address object
   * @author Aman Purohit
   * @date 2020-07-21
   * @param {Address} address
   * @memberof ChangeService
   */
  setInitialAddress(address: Address) {
    this.initialAddress = address;
    if (this.map.has(ChangeModule.ADDRESS)) {
      this.map.delete(ChangeModule.ADDRESS);
    }
    this.resetData();
  }

  /**
   * @description to get the initial value of the address object
   * @author Aman Purohit
   * @date 2020-07-21
   * @returns {Address}
   * @memberof ChangeService
   */
  getInitialAddress(): Address {
    return this.initialAddress;
  }

  /**
   * @description set the initial value of address object
   * @author Pulkit Bansal
   * @date 2020-08-05
   * @param {Vendor} vendor
   * @memberof ChangeService
   */
  setInitialVendor(vendor: Vendor) {
    this.initialVendor = vendor;
    if (this.map.has(ChangeModule.VENDOR)) {
      this.map.delete(ChangeModule.VENDOR);
    }
    this.resetData();
  }

  /**
   * @description to get the initial value of the address object
   * @author Aman Purohit
   * @date 2020-07-21
   * @returns {Address}
   * @memberof ChangeService
   */
  getInitialVendor(): Vendor {
    return this.initialVendor;
  }

/**
 * @description to set the initial value of the company profile object
 * @author Pulkit Bansal
 * @date 2020-08-06
 * @param {Company} company
 * @memberof ChangeService
 */
setInitialCompanyProfile(company: Company) {
    this.initialCompanyProfile = company;
    if (this.map.has(ChangeModule.COMPANY_PROFILE)) {
      this.map.delete(ChangeModule.COMPANY_PROFILE);
    }
    this.resetData();
  }

  /**
   * @description to get the initial value of the company profile object
   * @author Aman Purohit
   * @date 2020-07-16
   * @returns {Company}
   * @memberof ChangeService
   */
  getInitialCompanyProfile(): Company {
    return this.initialCompanyProfile;
  }

  setInitialDispatchBoardEvent(dispatchBoardEvent: DispatchBoardEvent) {
    this.initialDispatchBoardEvent = dispatchBoardEvent;
    if (this.map.has(ChangeModule.DISPATCH_BOARD_EVENT)) {
      this.map.delete(ChangeModule.DISPATCH_BOARD_EVENT);
    }
    this.resetData();
  }

  getInitialDispatchBoardEvent(): DispatchBoardEvent {
    return this.initialDispatchBoardEvent;
  }


  constructor() { }

  /**
   * @description to create/update the map object based on changes
   * @author Pulkit Bansal
   * @date 2020-07-14
   * @param {string} type
   * @param {string} field
   * @param {string} changedFieldDisplayName
   * @param {*} value
   * @param {string} formatterType
   * @param {string} changeDescription
   * @param {string} changeAdditionalDescription
   * @param {string} changedFieldArrayVariable
   * @param {boolean} checkOnlyObjectId
   * @param {boolean} trimValue
   * @memberof ChangeService
   */
  updateObjectMap(type: string, field: string, changedFieldDisplayName: string, value: any, formatterType: string, changeDescription: string, changeAdditionalDescription: string, changedFieldArrayVariable: string, checkOnlyObjectId: boolean, trimValue: boolean) {
    let valueToCheck = this.getValueToCheck(this.getObject(type), field);
    if (changedFieldArrayVariable) {
      valueToCheck = this.getValueFromArrayObj(valueToCheck, changedFieldArrayVariable);
      value = this.getValueFromArrayObj(value, changedFieldArrayVariable);
    } else {
      // do nothing
    }
    if (trimValue) {
      valueToCheck = (valueToCheck !== undefined && valueToCheck !== null) ? valueToCheck.trim() : valueToCheck;
      value = (value !== undefined && value !== null) ? value.trim() : value;
    } else {
      // do nothing
    }
    if (formatterType) {
      switch (formatterType) {
        case 'date': {
          valueToCheck = new Date(valueToCheck);
          value = new Date(value);
          break;
        }
        case 'time': {
          valueToCheck = DateUtil.getFormattedTime(valueToCheck, true, false, false);
          value = DateUtil.getFormattedTime(value, true, false, false);
          break;
        }
        case 'phone': {
          valueToCheck = Utils.phoneRemoveSpecialChars(valueToCheck);
          value = Utils.phoneRemoveSpecialChars(value);
          break;
        }
        case 'number': {
          valueToCheck = (valueToCheck !== undefined && valueToCheck !== null && !isNaN(Number(valueToCheck))) ? + valueToCheck : valueToCheck;
          value = (value !== undefined && value !== null && !isNaN(Number(value))) ? + value : value;
        }
      }
    } else {
      // do nothing
    }




    /*=============================================
    =            old code            =
    =============================================*/

    // if (this.map.has(type)) {
    //   const innerMap = this.map.get(type);
    //   // if (JSON.stringify(valueToCheck) !== JSON.stringify(value) && ((JSON.stringify(valueToCheck) !== '""' && JSON.stringify(valueToCheck) !== undefined) || (JSON.stringify(value) !== undefined && JSON.stringify(value) !== '""'))) {
    //   if (!Utils.isEqual(valueToCheck, value) && ((JSON.stringify(valueToCheck) !== '""' && JSON.stringify(valueToCheck) !== undefined) || (JSON.stringify(value) !== undefined && JSON.stringify(value) !== '""'))) {
    //     innerMap.set(field, new ValueChange(valueToCheck, value, changedFieldDisplayName, field, changeDescription, changeAdditionalDescription, formatterType));
    //     this.map.set(type, innerMap);
    //   } else {
    //     innerMap.delete(field);
    //     this.map.set(type, innerMap);
    //   }
    // } else {
    //   // if (JSON.stringify(valueToCheck) !== JSON.stringify(value) && ((JSON.stringify(valueToCheck) !== '""' && JSON.stringify(valueToCheck) !== undefined) || (JSON.stringify(value) !== undefined && JSON.stringify(value) !== '""'))) {
    //   if (!Utils.isEqual(valueToCheck, value) && ((JSON.stringify(valueToCheck) !== '""' && JSON.stringify(valueToCheck) !== undefined) || (JSON.stringify(value) !== undefined && JSON.stringify(value) !== '""'))) {
    //     const innerMap = new Map<string, ValueChange>();
    //     innerMap.set(field, new ValueChange(valueToCheck, value, changedFieldDisplayName, field, changeDescription, changeAdditionalDescription, formatterType));
    //     this.map.set(type, innerMap);
    //   } else {
    //     // do nothing
    //   }
    // }

    /*=====  End of old code  ======*/





    /*=============================================
    =            new code            =
    =============================================*/

    if (this.map.has(type)) {
      const innerMap = this.map.get(type);
      // if (JSON.stringify(valueToCheck) !== JSON.stringify(value) && ((JSON.stringify(valueToCheck) !== '""' && JSON.stringify(valueToCheck) !== undefined) || (JSON.stringify(value) !== undefined && JSON.stringify(value) !== '""'))) {
      if (checkOnlyObjectId) {
        if (!Utils.isEqual(this.getIdsFromObject(valueToCheck), this.getIdsFromObject(value)) && ((JSON.stringify(valueToCheck) !== '""' && JSON.stringify(valueToCheck) !== undefined) || (JSON.stringify(value) !== undefined && JSON.stringify(value) !== '""'))) {
          innerMap.set(field, new ValueChange(valueToCheck, value, changedFieldDisplayName, field, changeDescription, changeAdditionalDescription, formatterType));
          this.map.set(type, innerMap);
        } else {
          innerMap.delete(field);
          this.map.set(type, innerMap);
        }
      } else {
        if (!Utils.isEqual(valueToCheck, value) && ((JSON.stringify(valueToCheck) !== '""' && JSON.stringify(valueToCheck) !== undefined) || (JSON.stringify(value) !== undefined && JSON.stringify(value) !== '""'))) {
          innerMap.set(field, new ValueChange(valueToCheck, value, changedFieldDisplayName, field, changeDescription, changeAdditionalDescription, formatterType));
          this.map.set(type, innerMap);
        } else {
          innerMap.delete(field);
          this.map.set(type, innerMap);
        }
      }
    } else {
      // if (JSON.stringify(valueToCheck) !== JSON.stringify(value) && ((JSON.stringify(valueToCheck) !== '""' && JSON.stringify(valueToCheck) !== undefined) || (JSON.stringify(value) !== undefined && JSON.stringify(value) !== '""'))) {
      if (checkOnlyObjectId) {
        if (!Utils.isEqual(this.getIdsFromObject(valueToCheck), this.getIdsFromObject(value)) && ((JSON.stringify(valueToCheck) !== '""' && JSON.stringify(valueToCheck) !== undefined) || (JSON.stringify(value) !== undefined && JSON.stringify(value) !== '""'))) {
          const innerMap = new Map<string, ValueChange>();
          innerMap.set(field, new ValueChange(valueToCheck, value, changedFieldDisplayName, field, changeDescription, changeAdditionalDescription, formatterType));
          this.map.set(type, innerMap);
        } else {
          // do nothing
        }
      } else {
        if (!Utils.isEqual(valueToCheck, value) && ((JSON.stringify(valueToCheck) !== '""' && JSON.stringify(valueToCheck) !== undefined) || (JSON.stringify(value) !== undefined && JSON.stringify(value) !== '""'))) {
          const innerMap = new Map<string, ValueChange>();
          innerMap.set(field, new ValueChange(valueToCheck, value, changedFieldDisplayName, field, changeDescription, changeAdditionalDescription, formatterType));
          this.map.set(type, innerMap);
        } else {
          // do nothing
        }
      }
    }

    /*=====  End of new code  ======*/
    console.log('map', this.map);
    this.createChangesObject(type);
  }

  /**
   * @description to get the value from the object based on object pojo
   * @author Pulkit Bansal
   * @date 2020-07-13
   * @param {*} object
   * @param {*} field
   * @returns
   * @memberof ChangeService
   */
  getValueToCheck(object, field) {
    const splitArray = field.split('.').join('#').split('/').join('#').split('#');
    splitArray.forEach((item) => {
      object = (object && object[item]) ? object[item] : undefined;
    });
    return object;
  }

  /**
   * @description to get the object for value comparision
   * @author Pulkit Bansal
   * @date 2020-07-13
   * @param {*} type
   * @returns
   * @memberof ChangeService
   */
  getObject(type) {
    switch (type) {
      case ChangeModule.TAG: {
        return this.getInitialTag();
      }
      case ChangeModule.BUSINESS_UNIT: {
        return this.getInitialBusinessUnit();
      }
      case ChangeModule.JOB_TYPE: {
        return this.getInitialJobType();
      }
      case ChangeModule.TIMESHEET_CODE: {
        return this.getInitialTimesheetCode();
      }
      case ChangeModule.EMPLOYEE: {
        return this.getInitialEmployee();
      }
      case ChangeModule.TECHNICIAN: {
        return this.getInitialTechnician();
      }
      case ChangeModule.USER: {
        return this.getInitialUser();
      }
      case ChangeModule.CATEGORY: {
        return this.getInitialCategory();
      }
      case ChangeModule.SERVICE: {
        return this.getInitialService();
      }
      case ChangeModule.JOB: {
        return this.getInitialJob();
      }
      case ChangeModule.PROJECT: {
        return this.getInitialProject();
      }
      case ChangeModule.CUSTOMER: {
        return this.getInitialCustomer();
      }
      case ChangeModule.COMPANY_PROFILE: {
        return this.getInitialCompanyProfile();
      }
      case ChangeModule.ADDRESS: {
        return this.getInitialAddress();
      }
      case ChangeModule.VENDOR: {
        return this.getInitialVendor();
      }
      case ChangeModule.COMPANY: {
        return this.getInitialCompany();
      }
      case ChangeModule.DISPATCH_BOARD_EVENT: {
        return this.getInitialDispatchBoardEvent();
      }
    }
  }

  /**
   * @description to get the value of an array field in the object - will be used in tags and tech array
   * @author Pulkit Bansal
   * @date 2020-07-13
   * @param {*} value
   * @param {*} changedFieldArrayVariable
   * @returns
   * @memberof ChangeService
   */
  getValueFromArrayObj(value, changedFieldArrayVariable) {
    value = value.map(item => item[changedFieldArrayVariable]);
    return value.slice().join(',');
  }

  /**
   * @description to get only the id field(s) from an object(array)
   * @author Pulkit Bansal
   * @date 2020-07-14
   * @param {*} object
   * @returns
   * @memberof ChangeService
   */
  getIdsFromObject(object: any) {
    if (object instanceof Array) {
      return object.map(obj => obj.id);
    } else {
      return object && object.id ? object.id : undefined;
    }
  }

  /**
   * @description to create the changes object for the type specified
   * @author Pulkit Bansal
   * @date 2020-07-13
   * @param {string} type
   * @memberof ChangeService
   */
  createChangesObject(type: string) {
    this.changes = [];
    const changedValueMap = this.map.get(type);
    this.changes = (changedValueMap) ? this.createChagnesObjectFromMap(changedValueMap) : [];
  }

  /**
   * @description to create the changes object from the map of the specified type
   * @author Pulkit Bansal
   * @date 2020-07-13
   * @param {Map<string, ValueChange>} map
   * @returns
   * @memberof ChangeService
   */
  createChagnesObjectFromMap(map: Map<string, ValueChange>) {
    const changes: Change[] = [];
    map.forEach((value, key) => {
      const change: Change = new Change();
      // change.fieldName = value.displayFieldValue;
      change.fieldDisplayName = value.displayFieldValue;
      change.fieldName = value.fieldActualName;
      change.oldValue = value.initialValue;
      change.newValue = value.finalValue;
      change.description = value.description;
      change.additionalDescription = value.additionalDescription;
      change.formatterType = value.formatterType;
      changes.push(change);
    });
    console.log('changes', changes);
    return changes;
  }

  /**
   * @description to reset the map and changes objects
   * @author Pulkit Bansal
   * @date 2020-07-13
   * @memberof ChangeService
   */
  resetData() {
    this.map = new Map<string, Map<string, ValueChange>>();
    this.changes = [];
  }
}
