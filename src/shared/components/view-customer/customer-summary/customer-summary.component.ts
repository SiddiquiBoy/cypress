import { Component, OnInit, ViewEncapsulation, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Customer } from 'src/app/modals/customer/customer';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { User } from 'src/app/modals/user/user';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { Utils } from 'src/shared/utilities/utils';
import { BusinessUnit } from 'src/app/modals/business-unit/business-unit';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { ViewCustomerService } from '../services/view-customer.service';
import { Change } from 'src/app/modals/change/change';
import { ChangeService } from 'src/shared/services/change/change.service';
import { ChangeModule } from 'src/app/modals/enums/change-module/change-module.enum';
import { AddCustomerService } from '../../add-customer/services/add-customer.service';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';

@Component({
  selector: 'app-customer-summary',
  templateUrl: './customer-summary.component.html',
  styleUrls: ['./customer-summary.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomerSummaryComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  customerCopy: Customer; // Used for cloning customer object to display in popup.
  businessUnits: BusinessUnit[] = [];

  @Input() orgId: string;
  @Input() customer: Customer;
  @Output() emitOnCustomerUpdate: EventEmitter<boolean> = new EventEmitter();

  isSpinning = false;
  showEditCustomerDialog = false;
  isBusinessUnitsFetched = false;
  isCustomerImageUploading = false;

  changes: Change[] = [];
  changedType: string;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private viewCustomerService: ViewCustomerService,
    private changeService: ChangeService,
    private addCustomerService: AddCustomerService,
  ) { }

  ngOnInit() {
    this.getBusinessUnits();
    this.changeService.setInitialCustomer(Utils.cloneDeep(this.customer));
    this.changedType = this.getChangedType();

    this.subscriptions.push(
      this.addCustomerService.isCustomerImageUploading$.subscribe((val) => {
        this.isCustomerImageUploading = val;
      })
    );
  }

  /**
   * @description Cancel event of Edit Customer Dialog
   * @author Aman Purohit
   * @date 2020-07-22
   * @memberof CustomerSummaryComponent
   */
  onCancelClick() {
    this.showEditCustomerDialog = false;
  }

  updateCustomer() {
    this.changes = this.changeService.getChanges();
    this.isSpinning = true;
    this.subscriptions.push(
      this.viewCustomerService.updateCustomer(this.customerCopy, this.changes)
        .subscribe(
          (response: any) => {
            if (response && response.data && response.data.updateCustomer) {
              this.isSpinning = false;
              this.showEditCustomerDialog = false;
              this.emitOnCustomerUpdate.emit(true);
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

  onEdit() {
    this.changeService.setInitialCustomer(Utils.cloneDeep(this.customer));
    this.customerCopy = Utils.cloneDeep(this.customer);
    this.showEditCustomerDialog = true;
  }

  getBusinessUnits() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.viewCustomerService.getBusinessUnits(this.orgId, this.getListPaginationObject(), this.getBUSortObject(), null, this.getListFilterDataForActiveStatus())
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

  onBack() {
    this.router.navigate(
      [AppUrlConstants.CUSTOMERS]
    );
  }

  getChangedType() {
    return ChangeModule.CUSTOMER;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
