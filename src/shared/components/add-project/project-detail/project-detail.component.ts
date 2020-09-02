import { Component, OnInit, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { Project } from 'src/app/modals/project/project';
import { ControlContainer, NgForm } from '@angular/forms';
import { AppDropdown } from 'src/app/modals/app-dropdown/app-dropdown';
import { Utils } from 'src/shared/utilities/utils';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { Customer } from 'src/app/modals/customer/customer';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { ActiveInactiveStatus } from 'src/app/modals/enums/active-inactive-status/active-inactive-status.enum';
import { Address } from 'src/app/modals/address/address';
import { Subscription } from 'rxjs';
import { AddProjectService } from '../services/add-project.service';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { PlaceholderConstant } from 'src/shared/constants/placeholder-constants/placeholder-constant';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  encapsulation: ViewEncapsulation.None
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  @Input() redirectUpdate = false;
  @Input() redirectFrom: string;
  _project: Project = new Project();
  @Input() set project(project: Project) {
    this._project = project;
    if (project && project.id) {
      if (project.customer && project.customer.id && this.customers && this.customers.length > 0) {
        this.setSelectedCustomer();
      } else {
        if (project && !project.id) {
          project.customer = null;
        }
      }
    } else {
      if (project && project.customer) {
        if (project.customer.id) {
          // do nothing
        } else {
          if (project && !project.id) {
            project.customer = null;
          }
        }
      }
    }
    this.setSelectedCustomer();
    this.setProjectInitialStatus();
  }

  get project() {
    return this._project;
  }

  _customers: Customer[] = [];
  @Input() set customers(customers: Customer[]) {
    this._customers = customers;
    if (customers && customers.length > 0) {
      if (this.project && this.project.id) {
        this.setSelectedCustomer();
      }
    } else {
      if (this.redirectUpdate) {
        this.messageService.info(AppMessages.CREATE_CUSTOMER);
      }
    }
    this.setSelectedCustomer();
  }

  get customers() {
    return this._customers;
  }

  @Input() changedType: string;

  subscriptions: Subscription[] = [];
  statusDropdown: AppDropdown[] = [];
  customerAddresses: Address[] = [];

  // placeholders
  projectNamePlaceholder: string;
  projectCodePlaceholder: string;
  projectCustomerPlaceholder: string;
  projectStatusPlaceholder: string;

  constructor(
    private messageService: MessageService,
    private addProjectService: AddProjectService
  ) { }

  ngOnInit() {
    this.setPlaceholders();
    this.setDropdowns();
  }

  setPlaceholders() {
    this.projectNamePlaceholder = PlaceholderConstant.PROJECT_NAME;
    this.projectCodePlaceholder = PlaceholderConstant.PROJECT_CODE;
    this.projectCustomerPlaceholder = PlaceholderConstant.CUSTOMER;
    this.projectStatusPlaceholder = PlaceholderConstant.STATUS;
  }

  setSelectedCustomer() {
    if (this.project && this.project.customer && this.project.customer.id) {
      if (this.customers && this.customers.length > 0) {
        const selectedCustomer = this.customers.filter(customer => customer.id === this.project.customer.id)[0];
        if (selectedCustomer && selectedCustomer.id) {
          this.project.customer = selectedCustomer;
          // this.project.customerId = selectedCustomer.id;
        }
        this.onCustomerSelect();
      } else {
        // do nothing
      }
    } else if (this.redirectFrom === 'customer') {
      if (this.customers && this.customers.length) {
        this.project.customer = this.customers[0];
      }
    } else {
      // do nothing
    }
  }

  setDropdowns() {
    this.setStatusDropdown();
    this.setProjectInitialStatus();
  }

  setProjectInitialStatus() {
    if (this.project) {
      if (!this.project.status) {
        if (this.statusDropdown && this.statusDropdown.length > 0) {
          this.project.status = this.statusDropdown.filter(item => item.value === Utils.getEnumKey(GeneralStatus, GeneralStatus.active))[0].value;
        } else {
          // do nothing
        }
      } else {
        // do nothing
      }
    } else {
      // do nothing
    }
  }

  onCustomerSelect() {
    if (this.project && this.project.customer && this.project.customer.id) {
      // this.project.customerId = this.project.customer.id;
    }
    this.setCustomerAddresses();
  }

  setCustomerAddresses() {
    this.customerAddresses = [];
    if (this.project.customer && this.project.customer.id) {
      const customer = this.customers.find(cus => cus.id === this.project.customer.id);
      if (customer && customer.id) {
        this.customerAddresses = customer.addresses;
        this.addProjectService.selectedCustomerAddresses$.next(this.customerAddresses);
      }
    }
  }

  setStatusDropdown() {
    this.statusDropdown = [];
    // this.statusDropdown = Utils.createDropdown(GeneralStatus, false, true);
    this.statusDropdown = Utils.createDropdownForNewEnum(GeneralStatus, false, false, false, false);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
