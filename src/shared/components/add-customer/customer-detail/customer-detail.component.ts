import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Customer } from 'src/app/modals/customer/customer';
import { Utils } from 'src/shared/utilities/utils';
import { ControlContainer, NgForm } from '@angular/forms';
import { BusinessUnit } from 'src/app/modals/business-unit/business-unit';
import { AddCustomerService } from '../services/add-customer.service';
import { AppDropdown } from 'src/app/modals/app-dropdown/app-dropdown';
import { ActiveInactiveStatus } from 'src/app/modals/enums/active-inactive-status/active-inactive-status.enum';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { ActionEvent } from 'src/app/modals/enums/action-event/action-event.enum';
import { ChangeService } from 'src/shared/services/change/change.service';
import { Change } from 'src/app/modals/change/change';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { PlaceholderConstant } from 'src/shared/constants/placeholder-constants/placeholder-constant';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  encapsulation: ViewEncapsulation.None
})
export class CustomerDetailComponent implements OnInit {

  _customer: Customer = new Customer();
  @Input() set customer(customer) {
    this._customer = customer;
    if (customer && customer.id) {
      if (customer.businessUnit && customer.businessUnit.id && this.businessUnits && this.businessUnits.length > 0) {
        this.setSelectedBusinessUnit();
        // this.setSelectedStatus();
      }
    } else {
      // do nothing
    }
    this.setCustomerInitialStatus();
  }

  get customer() {
    return this._customer;
  }

  _businessUnits: BusinessUnit[] = [];
  @Input() set businessUnits(businessUnits: BusinessUnit[]) {
    this._businessUnits = businessUnits;
    if (businessUnits && businessUnits.length > 0) {
      if (this.customer && this.customer.id) {
        this.setSelectedBusinessUnit();
      }
    } else {
      this.messageService.info(AppMessages.CREATE_BUSINESS_UNIT);
    }
  }

  get businessUnits() {
    return this._businessUnits;
  }

  @Input() changedType: string;

  fileUploadText: string;
  imageUrl: string;
  nameRegex: RegExp;
  phoneRegex: RegExp;
  emailRegex: RegExp;
  statusDropdown: AppDropdown[] = [];

  // placeholders
  customerFirstNamePlaceholder: string;
  customerLastNamePlaceholder: string;
  customerHomePhonePlaceholder: string;
  customerOfficePhonePlaceholder: string;
  customerEmailPlaceholder: string;
  customerBusinessUnitPlaceholder: string;
  customerStatusPlaceholder: string;

  constructor(
    private addCustomerService: AddCustomerService,
    private messageService: MessageService,
    private changeService: ChangeService
  ) { }

  ngOnInit() {
    this.setPlaceholders();
    this.setRegExps();
    this.setDropdowns();
    // this.setSelectedStatus();
    this.fileUploadText = 'Upload Customer Image';
  }

  setPlaceholders() {
    this.customerFirstNamePlaceholder = PlaceholderConstant.FIRST_NAME;
    this.customerLastNamePlaceholder = PlaceholderConstant.LAST_NAME;
    this.customerHomePhonePlaceholder = PlaceholderConstant.HOME_PHONE_NUMBER;
    this.customerOfficePhonePlaceholder = PlaceholderConstant.OFFICE_PHONE_NUMBER;
    this.customerEmailPlaceholder = PlaceholderConstant.EMAIL;
    this.customerBusinessUnitPlaceholder = PlaceholderConstant.BUSINESS_UNIT;
    this.customerStatusPlaceholder = PlaceholderConstant.STATUS;
  }

  setSelectedBusinessUnit() {
    const selectedBu = this.businessUnits.filter(bu => bu.id === this.customer.businessUnit.id)[0];
    if (selectedBu && selectedBu.id) {
      this.customer.businessUnit.id = this.businessUnits.filter(bu => bu.id === this.customer.businessUnit.id)[0].id;
    }
  }

  setSelectedStatus() {
    // if (this.customer && this.customer.id) {

    // } else {
    //   this.customer.status = this.statusDropdown.filter(item => item.value === GeneralStatus['active'])[0].label;
    // }
  }

  setRegExps() {
    this.nameRegex = Utils.nameRegex;
    this.phoneRegex = Utils.phoneRegex;
    this.emailRegex = Utils.emailRegex;
  }

  setDropdowns() {
    this.setStatusDropdown();
    this.setCustomerInitialStatus();
  }

  setStatusDropdown() {
    this.statusDropdown = [];
    // this.statusDropdown = Utils.createDropdown(ActiveInactiveStatus, false, true);
    this.statusDropdown = Utils.createDropdownForNewEnum(GeneralStatus, false, false, false, false);
  }

  setCustomerInitialStatus() {
    if (this.customer) {
      if (!this.customer.status) {
        if (this.statusDropdown && this.statusDropdown.length > 0) {
          this.customer.status = this.statusDropdown.filter(item => item.value === Utils.getEnumKey(GeneralStatus, GeneralStatus.active))[0].value;
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

  handleImageLoading(status: boolean) {
    this.addCustomerService.isCustomerImageUploading$.next(status);
  }

  setImageUrl(url: string) {
    this.imageUrl = url;
    this.updateChangesObject('imageUrl', 'Image Url', url, this.customer.imageUrl, ActionEvent.UPDATE);
    this.customer.imageUrl = url;
  }

  updateChangesObject(fieldName: string, fieldDisplayName: string, newValue: any, oldValue: any, action: string) {
    let changes = this.changeService.getChanges();
    switch (action) {
      case ActionEvent.UPDATE: {
        this.setImageUrlInChanges(fieldName, fieldDisplayName, newValue, oldValue, changes);
        break;
      }
      default: {
        this.setImageUrlInChanges(fieldName, fieldDisplayName, newValue, oldValue, changes);
      }
    }
    this.setChangesObject(changes);
  }

  setImageUrlInChanges(fieldName: string, fieldDisplayName: string, newValue: any, oldValue: any, changes: Change[]) {
    const index = changes.findIndex(change => change.fieldName === fieldName);
    if (index < 0) {
      const change = new Change();
      change.fieldName = fieldName;
      change.fieldDisplayName = fieldDisplayName;
      change.newValue = newValue;
      change.oldValue = oldValue;
      changes.push(change);
    } else {
      changes[index].newValue = newValue;
    }
  }

  setChangesObject(changes: Change[]): void {
    this.changeService.setChanges(changes);
    this.changeService.setMapFromChanges(this.changedType, changes);
  }

}
