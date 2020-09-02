import { Component, OnInit, ViewEncapsulation, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { Company } from 'src/app/modals/company/company';
import { Subscription } from 'rxjs';
import { AppDropdown } from 'src/app/modals/app-dropdown/app-dropdown';
import { Utils } from 'src/shared/utilities/utils';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { Employee } from 'src/app/modals/people/employee';
import { AddCompanyService } from '../services/add-company.service';
import { Role } from 'src/app/modals/enums/role/role.enum';
import { PlaceholderConstant } from 'src/shared/constants/placeholder-constants/placeholder-constant';

@Component({
  selector: 'app-company-admin',
  templateUrl: './company-admin.component.html',
  styleUrls: ['./company-admin.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  encapsulation: ViewEncapsulation.None
})
export class CompanyAdminComponent implements OnInit, OnDestroy {

  _company: Company = new Company();
  // _companyEmployees: Employee[] = [];
  @Input() set company(company: Company) {
    // this._companyEmployees = company.employees;
    // if (company && company.employees && company.employees.length > 0) {
    //   company.employees = company.employees.filter(emp => emp.roles[0] === Role.ORGADMIN);
    // } else {
    //   // do nothing
    // }
    this._company = company;
    if (company) {
      if (company.employees && company.employees.length > 0) {
        this.setSelectedStatus();
      } else {
        this.addInitialAdmin();
      }
    } else {
      // do nothing
    }
  }

  get company(): Company {
    return this._company;
  }

  @Input() changedType: string;

  @Output() eEmitIsAdminTabValid = new EventEmitter<any>();

  subscriptions: Subscription[] = [];
  statusDropdown: AppDropdown[] = [];
  isAdminTabValid = false;
  emailRegex: RegExp;
  phoneRegex: RegExp;
  nameRegex: RegExp;

  // placeholders
  companyAdminFirstNamePlaceholder: string;
  companyAdminLastNamePlaceholder: string;
  companyAdminOfficePhonePlaceholder: string;
  companyAdminHomePhonePlaceholder: string;
  companyAdminEmailPlaceholder: string;
  companyAdminRolelaceholder: string;
  companyAdminStatusPlaceholder: string;

  constructor(
    private addCompanyService: AddCompanyService
  ) { }

  ngOnInit() {
    this.setPlaceholders();
    this.setRegExps();
    this.setDropdowns();

    this.subscriptions.push(
      this.addCompanyService.isAdminTabValid$.subscribe((val) => {
        this.isAdminTabValid = val;
      })
    );
  }

  setPlaceholders() {
    this.companyAdminFirstNamePlaceholder = PlaceholderConstant.FIRST_NAME;
    this.companyAdminLastNamePlaceholder = PlaceholderConstant.LAST_NAME;
    this.companyAdminOfficePhonePlaceholder = PlaceholderConstant.OFFICE_PHONE_NUMBER;
    this.companyAdminHomePhonePlaceholder = PlaceholderConstant.HOME_PHONE_NUMBER;
    this.companyAdminEmailPlaceholder = PlaceholderConstant.EMAIL;
    this.companyAdminRolelaceholder = PlaceholderConstant.ROLE;
    this.companyAdminStatusPlaceholder = PlaceholderConstant.STATUS;
  }

  emitIsAdminTabValid() {
    this.eEmitIsAdminTabValid.emit(true);
  }

  setRegExps() {
    this.emailRegex = Utils.emailRegex;
    this.phoneRegex = Utils.phoneRegex;
    this.nameRegex = Utils.nameRegex;
  }

  setDropdowns() {
    this.setStatusDropdown();
  }

  setStatusDropdown() {
    this.statusDropdown = [];
    this.statusDropdown = Utils.createDropdownForNewEnum(GeneralStatus, false, false, false, false);
    this.setSelectedStatus();
  }

  addInitialAdmin() {
    if (this.company.employees) {
      // do nothing
    } else {
      this.company.employees = [];
    }
    const admin: Employee = new Employee();
    admin.roles = [Role.ORGADMIN];
    this.company.employees.push(admin);
    this.setSelectedStatus();
  }

  setSelectedStatus() {
    if (this.statusDropdown && this.statusDropdown.length > 0) {
      if (this.company && this.company.employees && this.company.employees.length > 0) {
        if (this.company.employees && this.company.employees.length > 0 && this.company.employees[0].status) {
          this.company.employees[0].status = this.statusDropdown.filter(item => item.value === Utils.getEnumKey(GeneralStatus, GeneralStatus[this.company.employees[0].status]))[0].value;
        } else {
          // this case should not occur
          this.setDefaultStatus();
        }
      } else {
        this.setDefaultStatus();
      }
    } else {
      // do nothing
    }
  }

  setDefaultStatus() {
    if (this.company) {
      if (this.company.employees && this.company.employees.length > 0) {
        // do nothing
      } else {
        const admin: Employee = new Employee();
        admin.roles = [Role.ORGADMIN];
        this.company.employees.push(admin);
      }
      this.company.employees[0].status = this.statusDropdown.filter(item => item.value === Utils.getEnumKey(GeneralStatus, GeneralStatus.active))[0].value;
    } else {
      // do nothing
    }

  }

  getRoleAtIndex(index: number) {
    return this.company.employees[0].roles[index];
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
