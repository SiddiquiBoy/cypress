import { Component, OnInit, ViewEncapsulation, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { ViewCustomerService } from './services/view-customer.service';
import { Customer } from 'src/app/modals/customer/customer';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { User } from 'src/app/modals/user/user';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';

@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.component.html',
  styleUrls: ['./view-customer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewCustomerComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  customerId: string;
  orgId: string;
  customer: Customer = new Customer();

  viewJobsPermission: string;
  isSpinning = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private viewCustomerService: ViewCustomerService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.viewCustomerService.isSpinning$.subscribe((val) => {
        this.isSpinning = val;
        this.detectChanges();
      })
    );

    this.permissions();
    this.setOrgId();
    this.getRouteParams();
  }

  permissions() {
    this.viewJobsPermission = Permission.MENU_JOBS;
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

  getRouteParams() {
    this.subscriptions.push(
      this.activatedRoute.params.subscribe(
        (params: Params) => {
          if (params.viewid) {
            this.customerId = params.viewid;
            this.getCustomer();
          } else {
            this.customerId = undefined;
          }
        }
      )
    );
  }

  getCustomer() {
    this.viewCustomerService.isSpinning$.next(true);
    this.subscriptions.push(
      this.viewCustomerService.getCustomer(this.customerId).valueChanges.subscribe(
        (response: any) => {
          if (response && response.data && response.data.getCustomer) {
            this.customer = response.data.getCustomer;
            this.viewCustomerService.isSpinning$.next(false);
          } else {
            this.viewCustomerService.isSpinning$.next(false);
          }
        },
        (error: any) => {
          const errorObj = ErrorUtil.getErrorObject(error);
          this.viewCustomerService.isSpinning$.next(false);
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

  onCustomerUpdate(status: boolean) {
    if (status) {
      // this.messageService.success('Customer address has been deleted successfully');
      this.messageService.success(AppMessages.CUSTOMER_UPDATED);
      this.getCustomer();
    }
  }

  onCustomerAddressCreate(status: boolean) {
    if (status) {
      // this.messageService.success('Customer address has been deleted successfully');
      this.messageService.success(AppMessages.CUSTOMER_ADDRESS_ADDED);
      this.getCustomer();
    }
  }

  onCustomerAddressUpdate(status: boolean) {
    if (status) {
      // this.messageService.success('Customer address has been deleted successfully');
      this.messageService.success(AppMessages.CUSTOMER_ADDRESS_UPDATED);
      this.getCustomer();
    }
  }

  onCustomerAddressDelete(status: boolean) {
    if (status) {
      // this.messageService.success('Customer address has been deleted successfully');
      this.messageService.success(AppMessages.CUSTOMER_ADDRESS_DELETED);
      this.getCustomer();
    }
  }

  onCustomerProjectUpdate(status: boolean) {
    if (status) {
      this.messageService.success(AppMessages.CUSTOMER_PROJECT_UPDATED);
      this.getCustomer();
    }
  }

  onCustomerProjectCreate(status: boolean) {
    if (status) {
      this.messageService.success(AppMessages.CUSTOMER_PROJECT_ADDED);
      this.getCustomer();
    }
  }

  detectChanges() {
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
