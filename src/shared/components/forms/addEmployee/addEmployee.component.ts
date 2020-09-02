import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppDropdown } from 'src/app/modals/app-dropdown/app-dropdown';
import { Change } from 'src/app/modals/change/change';
import { ChangeModule } from 'src/app/modals/enums/change-module/change-module.enum';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { Role } from 'src/app/modals/enums/role/role.enum';
import { Employee } from 'src/app/modals/people/employee';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { User } from 'src/app/modals/user/user';
import { PhoneFormatPipe } from 'src/shared/pipes/phone-format.pipe';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { ChangeService } from 'src/shared/services/change/change.service';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { Utils } from 'src/shared/utilities/utils';
import { AddEmployeeService } from './services/add-employee.service';
import { ActionEvent } from 'src/app/modals/enums/action-event/action-event.enum';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { PlaceholderConstant } from 'src/shared/constants/placeholder-constants/placeholder-constant';

@Component({
  selector: 'app-add-employee',
  templateUrl: './addEmployee.component.html',
  styleUrls: ['./addEmployee.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AddEmployeeComponent implements OnInit, OnDestroy {

  employeeId: string;
  orgId: string;
  description: string;

  subscriptions: Subscription[] = [];
  employee: Employee = new Employee();
  statusDropdown: AppDropdown[] = [];
  businessUnits: any[] = [];

  emailRegex: RegExp;
  phoneRegex: RegExp;
  nameRegex: RegExp;
  isSpinning = false;
  imageLoading = false;
  isTechnician = false;

  changes: Change[] = [];
  changedType: string;

  // placeholders
  employeeFirstNamePlaceholder: string;
  employeeLastNamePlaceholder: string;
  employeeOfficePhonePlaceholder: string;
  employeeHomePhonePlaceholder: string;
  employeeEmailPlaceholder: string;
  employeeBusinessUnitPlaceholder: string;
  employeeRolePlaceholder: string;
  employeeStatusPlaceholder: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private phoneFormatPipe: PhoneFormatPipe,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private addEmployeeService: AddEmployeeService,
    private changeService: ChangeService
  ) {
  }

  ngOnInit() {
    this.setPlaceholders();
    this.setDropdowns();
    this.setOrgId();
    this.getRouteParams();
    this.setRegExps();
    this.checkTechnicianFromPath();
    this.changedType = this.getChangedType();
  }

  setPlaceholders() {
    this.employeeFirstNamePlaceholder = PlaceholderConstant.FIRST_NAME;
    this.employeeLastNamePlaceholder = PlaceholderConstant.LAST_NAME;
    this.employeeOfficePhonePlaceholder = PlaceholderConstant.OFFICE_PHONE_NUMBER;
    this.employeeHomePhonePlaceholder = PlaceholderConstant.HOME_PHONE_NUMBER;
    this.employeeEmailPlaceholder = PlaceholderConstant.EMAIL;
    this.employeeBusinessUnitPlaceholder = PlaceholderConstant.BUSINESS_UNIT;
    this.employeeRolePlaceholder = PlaceholderConstant.ROLE;
    this.employeeStatusPlaceholder = PlaceholderConstant.STATUS;
  }

  /**
   * @description
   * @author Aman Purohit
   * @date 2020-07-15
   * @memberof AddEmployeeComponent
   */
  setOrgId() {
    this.authenticationService.currentUser.subscribe((user: User) => {
      if (user && user.organization) {
        this.orgId = user.organization.id;
        // this.getBusinessUnits();
      } else {
        this.orgId = undefined;
        // this.changeService.setInitialService(Utils.cloneDeep(this.employee));
      }
    });
  }

  /**
   * @description
   * @author Aman Purohit
   * @date 2020-07-15
   * @memberof AddEmployeeComponent
   */
  setRegExps() {
    this.emailRegex = Utils.emailRegex;
    this.phoneRegex = Utils.phoneRegex;
    this.nameRegex = Utils.nameRegex;
  }

  checkTechnicianFromPath() {
    const path = this.router.url;
    if (path.includes('technician')) {
      this.setTechnician();
    }
  }

  setTechnician() {
    this.isTechnician = true;
    this.employee.roles = [Role.TECHNICIAN];
  }

  setDropdowns() {
    this.setStatusDropdown();
  }

  setDescription() {
    if (!this.employeeId) {
      this.description = `Provide all details for creating ${(this.isTechnician ? 'a Technician' : 'an Employee')}`;
    } else {
      this.description = `Provide all details to edit ${(this.isTechnician ? 'a Technician' : 'an Employee')}`;
    }
  }

  setStatusDropdown() {
    this.statusDropdown = [];
    this.statusDropdown = Utils.createDropdownForNewEnum(GeneralStatus, false, false, false, false);
  }

  getRouteParams() {
    this.subscriptions.push(
      this.activatedRoute.params.subscribe(
        (params: Params) => {
          if (params.id) {
            this.employeeId = params.id;
            // this.description = `Provide all details to edit ${(this.isTechnician ? 'a Technician' : 'an Employee')}`;
            this.getUser();
          } else {
            this.employeeId = undefined;
            this.getBusinessUnits();
            this.employee.status = this.statusDropdown.filter(item => item.value === Utils.getEnumKey(GeneralStatus, GeneralStatus.active))[0].value;
            if (this.isTechnician) {
              this.changeService.setInitialTechnician(Utils.cloneDeep(this.employee));
            } else {
              this.changeService.setInitialEmployee(Utils.cloneDeep(this.employee));
            }
          }
        })
    );
  }

  /**
   * @description Submit form data
   * @author Rajeev Kumar
   * @date 2020-05-26
   * @memberof AddEmployeeComponent
   */
  onSubmit(): void {
    this.changes = this.changeService.getChanges();

    this.employee.homePhone = Utils.phoneRemoveSpecialChars(this.employee.homePhone);
    this.employee.officePhone = Utils.phoneRemoveSpecialChars(this.employee.officePhone);

    if (this.employeeId) {
      this.editEmployee();
    } else {
      this.createEmployee();
    }
  }

  createEmployee() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.addEmployeeService.createUser(this.orgId, this.employee)
        .subscribe(
          (response) => {
            this.isSpinning = false;
            this.messageService.success(this.isTechnician ? AppMessages.TECHNICIAN_ADDED : AppMessages.EMPLOYEE_ADDED);
            this.navigateToList();
          },
          (error) => {
            const errorObj = ErrorUtil.getErrorObject(error);
            this.isSpinning = false;
            if (errorObj.message !== ErrorUtil.AUTH_TOKEN_EXPIRED) {
              this.messageService.error(errorObj.message);
            } else {
              // do nothing
            }
            if (errorObj.logout) {
              this.authenticationService.logout();
            }
          }
        )
    );
  }

  editEmployee() {
    this.subscriptions.push(
      this.addEmployeeService.updateEmployee(this.employee, this.changes)
        .subscribe(
          (response: any) => {
            this.isSpinning = false;
            this.messageService.success(this.isTechnician ? AppMessages.TECHNICIAN_UPDATED : AppMessages.EMPLOYEE_UPDATED);
            this.navigateToList();
          },
          (error) => {
            const errorObj = ErrorUtil.getErrorObject(error);
            this.isSpinning = false;
            if (errorObj.message !== ErrorUtil.AUTH_TOKEN_EXPIRED) {
              this.messageService.error(errorObj.message);
            } else {
              // do nothing
            }
            if (errorObj.logout) {
              this.authenticationService.logout();
            }
          }
        )
    );
  }

  getUser() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.addEmployeeService.getEmployeeById(this.employeeId).valueChanges
        .subscribe(
          (response: any) => {
            if (response && response.data && response.data.getUser) {
              this.isSpinning = false;
              this.employee = response.data.getUser;

              this.employee.homePhone = this.phoneToDisplayFormat(this.employee.homePhone);
              this.employee.officePhone = this.phoneToDisplayFormat(this.employee.officePhone);

              this.getBusinessUnits();

              if (this.isTechnician) {
                this.changeService.setInitialTechnician(Utils.cloneDeep(this.employee));
              } else {
                this.changeService.setInitialEmployee(Utils.cloneDeep(this.employee));
              }

              // this.setSelectedBusinessUnit();
            } else {
              this.isSpinning = false;
            }
          }, (error: any) => {
            const errorObj = ErrorUtil.getErrorObject(error);
            this.isSpinning = false;
            if (errorObj.message !== ErrorUtil.AUTH_TOKEN_EXPIRED) {
              this.messageService.error(errorObj.message);
            } else {
              // do nothing
            }
            if (errorObj.logout) {
              this.authenticationService.logout();
            }
          }
        )
    );
  }

  setSelectedBusinessUnit() {
    if (this.businessUnits && this.businessUnits.length > 0 && this.employee && this.employee.businessUnit && this.employee.businessUnit.id !== null && this.employee.businessUnit.id !== undefined) {
      this.employee.businessUnit = this.businessUnits.find(bu => bu.id === this.employee.businessUnit.id);
    }
  }

  navigateToList() {
    // this.router.navigateByUrl(`/settings/people/${this.isTechnician ? 'technicians' : 'employees'}`);
    this.router.navigate([AppUrlConstants.SLASH + AppUrlConstants.SETTINGS + AppUrlConstants.SLASH + AppUrlConstants.PEOPLE + AppUrlConstants.SLASH + ((this.isTechnician) ? AppUrlConstants.TECHNICIANS : AppUrlConstants.EMPLOYEES)]);
  }

  cancel() {
    this.navigateToList();
  }

  /**
   * @description Fetch list of business units
   * @author Aman Purohit
   * @date 2020-06-09
   * @memberof AddEmployeeComponent
   */
  getBusinessUnits() {
    // const sortData: SortData[] = [{ sortColumn: 'name', sortOrder: 'asc' }];
    this.isSpinning = true;
    this.subscriptions.push(
      this.addEmployeeService.getBusinessUnits(this.orgId, this.getListPaginationObject(), this.getBusinessUnitSortObject(), null, this.getListFilterDataForActiveStatus(), this.getSelectedEmployeeBusinessUnitIds())
        .valueChanges.subscribe(
          (response: any) => {
            if (response && response.data && response.data.listBusinessUnits &&
              response.data.listBusinessUnits.data && response.data.listBusinessUnits.data.length) {
              this.isSpinning = false;
              this.businessUnits = response['data']['listBusinessUnits']['data'];
              this.setSelectedBusinessUnit();
              // this.getRouteParams();
            } else {
              this.isSpinning = false;
              this.messageService.info(AppMessages.CREATE_BUSINESS_UNIT);
            }
          },
          (error: any) => {
            const errorObj = ErrorUtil.getErrorObject(error);
            this.isSpinning = false;
            if (errorObj.message !== ErrorUtil.AUTH_TOKEN_EXPIRED) {
              this.messageService.error(errorObj.message);
            } else {
              // do nothing
            }
            if (errorObj.logout) {
              this.authenticationService.logout();
            }
          }
        )
    );
  }

  getListPaginationObject() {
    return Utils.createListPaginationObject();
  }

  getSelectedEmployeeBusinessUnitIds() {
    let ids: string[] = [];
    if (this.employee && this.employee.businessUnit && this.employee.businessUnit.id !== null && this.employee.businessUnit.id !== undefined) {
      ids = [this.employee.businessUnit.id];
    }
    return ids;
  }

  getBusinessUnitSortObject() {
    const sortData: SortData[] = [];
    const sort: SortData = {
      sortColumn: 'name',
      sortOrder: 'asc'
    };
    sortData.push(sort);
    return sortData;
  }

  getListFilterDataForActiveStatus() {
    return Utils.createListFilterDataForActiveStatus();
  }

  imageUrl(url: string) {
    this.updateChangesObject('imageUrl', url, ActionEvent.UPDATE);
    this.employee.imageUrl = url;
  }

  updateChangesObject(fieldName: string, newUrl: string, action: ActionEvent) {
    let changes = this.changeService.getChanges();
    const index = changes.findIndex(change => change.fieldName === fieldName);
    switch (action) {
      case ActionEvent.UPDATE: {
        if (index < 0) {
          const change = new Change();
          change.fieldName = fieldName;
          change.newValue = newUrl;
          changes.push(change);
        } else {
          changes[index].newValue = newUrl;
        }
        break;
      }
      default: {
        changes = changes;
      }
    }
    this.setChangesObject(changes);
  }

  setChangesObject(changes: Change[]): void {
    this.changeService.setChanges(changes);
    this.changeService.setMapFromChanges(this.changedType, changes);
  }

  handleImageLoading(status: boolean) {
    this.imageLoading = status;
  }

  /**
   * @description Transforms phone number from 9999999999
   * to (999) 999-9999
   * @author Aman Purohit
   * @date 2020-06-22
   * @param {string} phoneNumber
   * @returns
   * @memberof AddEmployeeComponent
   */
  phoneToDisplayFormat(phoneNumber: string) {
    if (!phoneNumber) {
      return phoneNumber;
    }
    return this.phoneFormatPipe.transform(phoneNumber);
  }

  getChangedType() {
    if (this.isTechnician) {
      return ChangeModule.TECHNICIAN;
    } else {
      return ChangeModule.EMPLOYEE;
    }
  }

  ngOnDestroy() {
    // unsubscribing all the subscriptions
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
