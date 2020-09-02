import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Customer } from 'src/app/modals/customer/customer';
import { Subscription, Subject } from 'rxjs';
import { AppDropdown } from 'src/app/modals/app-dropdown/app-dropdown';
import { Utils } from 'src/shared/utilities/utils';
import { ActiveInactiveStatus } from 'src/app/modals/enums/active-inactive-status/active-inactive-status.enum';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { BusinessUnit } from 'src/app/modals/business-unit/business-unit';
import { AddCustomerService } from './services/add-customer.service';
import { User } from 'src/app/modals/user/user';
import { NgForm } from '@angular/forms';
import { CustomerService } from 'src/app/pages/customer/services/customer.service';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { Change } from 'src/app/modals/change/change';
import { ChangeService } from 'src/shared/services/change/change.service';
import { ChangeModule } from 'src/app/modals/enums/change-module/change-module.enum';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddCustomerComponent implements OnInit, OnDestroy {

  @ViewChild('customerForm', null) customerForm: NgForm;

  customerId: string;
  orgId: string;
  customer: Customer = new Customer();
  businessUnits: BusinessUnit[] = [];
  // projects: Project[] = [];
  // jobs: Job[] = [];
  isSpinning = false;
  subscriptions: Subscription[] = [];
  statusDropdown: AppDropdown[] = [];
  activeIndex: number; // the current index of the tab
  isImageLoading = false;
  stepToFormValidity: Map<number, boolean> = new Map();
  stepToFormPristine: Map<number, boolean> = new Map();
  isFormValid$: Subject<boolean> = new Subject<boolean>();
  isFormValid = false;
  isFormPristine = true;
  isCustomerImageUploading = false;
  isBusinessUnitsFetched = false;

  showConfirmDialog = false;
  confirmDialogMessage = 'Changes will not be saved. Do you wish to proceed?';

  changes: Change[] = [];
  changedType: string;

  constructor(
    public router: Router,
    private messageService: MessageService,
    private customerService: CustomerService,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private addCustomerService: AddCustomerService,
    private cd: ChangeDetectorRef,
    private changeService: ChangeService
  ) { }

  ngOnInit() {
    this.setOrgId();
    // this.getBusinessUnits();
    this.setActiveIndex();
    this.setInitialValueForStepMap();
    this.setInitialValueForPristineMap();
    this.setDropdowns();
    this.getRouteParams();
    this.changedType = this.getChangedType();
    // this.getProjects();
    // this.getJobs();

    this.subscriptions.push(
      this.addCustomerService.isCustomerImageUploading$.subscribe((val) => {
        this.isCustomerImageUploading = val;
      })
    );

    this.subscriptions.push(
      this.isFormValid$.subscribe((val) => {
        this.isFormValid = val;
        this.detectChanges();
      })
    );
  }

  setActiveIndex(index?: number) {
    if (index !== null && index !== undefined) {
      this.activeIndex = index;
    } else {
      this.activeIndex = 0;
    }
  }

  setDropdowns() {
    this.setStatusDropdown();
  }

  setStatusDropdown() {
    this.statusDropdown = [];
    this.statusDropdown = Utils.createDropdown(ActiveInactiveStatus, false, true);
  }

  setOrgId() {
    this.subscriptions.push(
      this.authenticationService.currentUser.subscribe((user: User) => {
        if (user && user.organization) {
          this.orgId = user.organization.id;
        } else {
          this.orgId = undefined;
        }
      })
    );
  }

  setInitialValueForStepMap() {
    this.stepToFormValidity.set(0, this.customerId ? true : false);
    this.stepToFormValidity.set(1, this.customerId ? true : false);
    this.stepToFormValidity.set(2, this.customerId ? true : false);
    // this.stepToFormValidity.set(3, false);
  }

  setInitialValueForPristineMap() {
    this.stepToFormPristine.set(0, true);
    this.stepToFormPristine.set(1, true);
    this.stepToFormPristine.set(2, true);
    // this.stepToFormPristine.set(3, true);
  }

  getBusinessUnits() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.addCustomerService.getBusinessUnits(this.orgId, this.getListPaginationObject(), this.getBUSortObject(), null, this.getListFilterDataForActiveStatus(), this.getSelectedBusinessUnitIds())
        .valueChanges.subscribe(
          (response: any) => {
            if (response && response.data && response.data.listBusinessUnits) {
              this.businessUnits = response['data']['listBusinessUnits']['data'];
              if (!this.businessUnits.length) {
                this.messageService.info(AppMessages.CREATE_BUSINESS_UNIT);
              }
              this.isBusinessUnitsFetched = true;
              this.isSpinning = false;
            } else {
              this.isBusinessUnitsFetched = true;
              this.isSpinning = false;
            }
          },
          (error: any) => {
            const errorObj = ErrorUtil.getErrorObject(error);
            this.isBusinessUnitsFetched = true;
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

  getSelectedBusinessUnitIds() {
    let ids: string[] = [];
    if (this.customer && this.customer.businessUnit && this.customer.businessUnit.id) {
      ids = [this.customer.businessUnit.id];
    } else {
      // do nothing
    }
    return ids;
  }

  getListPaginationObject() {
    return Utils.createListPaginationObject();
  }

  getBUSortObject() {
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

  getRouteParams() {
    this.subscriptions.push(
      this.activatedRoute.params.subscribe(
        (params: Params) => {
          if (params.id) {
            this.customerId = params.id;
            this.getCustomer();
          } else {
            this.customerId = undefined;
            this.getBusinessUnits();
            this.changeService.setInitialCustomer(Utils.cloneDeep(this.customer));
          }
        })
    );
  }

  getCustomer() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.customerService.getCustomer(this.customerId).valueChanges.subscribe(
        (response) => {
          if (response) {
            this.customer = response['data']['getCustomer'];
            this.getBusinessUnits();
            this.changeService.setInitialCustomer(Utils.cloneDeep(this.customer));
            this.setInitialValueForStepMap();
            this.isSpinning = false;
          } else {
            this.isSpinning = false;
          }
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

  // setCustomerStatusForDropdown() {
  //   const key = Utils.getEnumKey(ActiveInactiveStatus, this.customer.status);
  //   if (key) {
  //     this.customer.status = this.statusDropdown.find(item => item.label === key).value;
  //   } else {
  //     // do nothing --> this case should never occur
  //   }
  // }

  // setCustomerStatusForBackend() {
  //   const label = Utils.getDropdownLabel(this.statusDropdown, this.customer.status);
  //   if (label) {
  //     this.customer.status = ActiveInactiveStatus[label];
  //   } else {
  //     // do nothing --> this case should never occur
  //   }
  // }

  onIndexChange(index) {
    this.setValueForStepMap(this.activeIndex, (this.customerForm.form.disabled || this.customerForm.form.valid));
    this.setValueForPristineMap(this.activeIndex, this.customerForm.form.pristine);
    this.activeIndex = index;
    this.setFormValidity();
    this.setFormPristinity();
  }

  setValueForStepMap(key: number, value: boolean) {
    this.stepToFormValidity.set(key, value);
  }

  setValueForPristineMap(key: number, value: boolean) {
    this.stepToFormPristine.set(key, value);
  }

  setFormValidity() {
    let result = true;
    this.stepToFormValidity.forEach((value, key) => {
      if (!value) {
        result = false;
      } else {
        // do nothing
      }
    });
    // this.isFormValid = result;
    if (result !== this.isFormValid) {
      this.isFormValid$.next(result);
    }
  }

  setFormPristinity() {
    let result = true;
    this.stepToFormPristine.forEach((value, key) => {
      if (!value) {
        result = false;
      } else {
        // do nothing
      }
    });
    this.isFormPristine = result;
  }

  isCurrentTabValid() {
    this.setValueForStepMap(this.activeIndex, (this.customerForm.form.disabled || this.customerForm.form.valid));
    this.setFormValidity();
    this.setFormPristinity();
    // return this.customerForm.form.valid;
  }

  isAddressTabValid() {
    if (this.customerId) {
      this.addCustomerService.isAddressTabValid$.next(this.customerForm.form.valid);
    } else {
      this.addCustomerService.isAddressTabValid$.next(this.customerForm.form.valid && !this.customerForm.form.pristine);
    }
    // this.addCustomerService.isAddressTabValid$.next(this.customerForm.form.valid && !this.customerForm.form.pristine);
  }

  isProjectTabValid() {
    if (this.customerId) {
      this.addCustomerService.isProjectTabValid$.next(this.customerForm.form.disabled || this.customerForm.form.valid);
    } else {
      this.addCustomerService.isProjectTabValid$.next(this.customerForm.form.valid && !this.customerForm.form.pristine);
    }
    // this.addCustomerService.isProjectTabValid$.next(this.customerForm.form.valid && !this.customerForm.form.pristine);
  }

  // isJobTabValid() {
  //   this.addCustomerService.isJobTabValid$.next(this.customerForm.form.valid && !this.customerForm.form.pristine);
  // }

  isCurrentTabPristine() {
    this.setValueForPristineMap(this.activeIndex, this.customerForm.form.pristine);
  }

  getTabStatus(index: number) {
    if (index !== this.activeIndex) {
      if (this.stepToFormValidity.get(index)) {
        return 'wait';
      } else {
        if (this.stepToFormPristine.get(index)) {
          return 'wait';
        } else {
          return 'error';
        }
      }
    } else {
      return 'wait';
    }
  }

  onSubmit() {
    this.isFormPristine = true;
    this.updateCustomerObjectForBackend();
    this.changes = this.changeService.getChanges();
    if (this.customerId) {
      this.updateCustomer();
    } else {
      this.createCustomer();
    }
  }

  updateCustomerObjectForBackend() {
    // setting lat and long as number
    this.customer.addresses.forEach((add) => {
      add.latitude = +add.latitude;
      add.longitude = +add.longitude;
    });

    // formatting phone number type fields
    this.customer.homePhone = Utils.phoneRemoveSpecialChars(this.customer.homePhone);
    this.customer.officePhone = Utils.phoneRemoveSpecialChars(this.customer.officePhone);

    // formatting status fields
    // this.customer.projects.forEach((proj) => {
    //   const key = Utils.getEnumKey(ActiveInactiveStatus, proj.status);
    //   if (key) {
    //     proj.status = String(this.statusDropdown.find(item => item.label === key).value).toLowerCase();
    //   } else {
    //     // do nothing --> this case should never occur
    //   }
    // });
  }

  createCustomer() {
    this.isSpinning = true;
    // this.setCustomerStatusForBackend();
    this.subscriptions.push(
      this.customerService.createCustomer(this.customer).subscribe(
        (response) => {
          if (response) {
            this.messageService.success(AppMessages.CUSTOMER_ADDED);
            this.isSpinning = false;
            this.navigateToCustomersList();
          } else {
            this.isSpinning = false;
          }
        },
        (error) => {
          const errorObj = ErrorUtil.getErrorObject(error);
          this.isSpinning = false;
          // this.notificationService.error(errorObj.title, errorObj.message);
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

  updateCustomer() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.customerService.updateCustomer(this.customer, this.changes).subscribe(
        (response) => {
          if (response) {
            this.messageService.success(AppMessages.CUSTOMER_UPDATED);
            this.isSpinning = false;
            this.navigateToCustomersList();
          } else {
            this.isSpinning = false;
          }
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

  onNextClick() {
    this.activeIndex += 1;
    this.onIndexChange(this.activeIndex);
  }

  onPrevClick() {
    this.activeIndex -= 1;
    this.onIndexChange(this.activeIndex);
  }

  onCancel(): void {
    if (!this.isFormPristine) {
      // this.messageService.info('Changes will not be saved');
      this.showConfirmDialog = true;
    } else {
      // this.router.navigate([AppUrlConstants.SLASH + AppUrlConstants.SETTINGS + AppUrlConstants.SLASH + AppUrlConstants.CUSTOMERS]);
      this.navigateToCustomersList();
    }
  }

  navigateToCustomersList() {
    this.router.navigate([AppUrlConstants.SLASH + AppUrlConstants.CUSTOMERS]);
  }

  onOkClick() {
    this.showConfirmDialog = false;
    this.isFormPristine = true;
    this.onCancel();
  }

  onCancelClick() {
    this.showConfirmDialog = false;
  }

  getChangedType() {
    return ChangeModule.CUSTOMER;
  }

  detectChanges() {
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  ngOnDestroy() {
    // unsubscribing all the subscriptions
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
