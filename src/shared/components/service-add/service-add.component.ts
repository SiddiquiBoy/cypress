import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { AppDropdown } from 'src/app/modals/app-dropdown/app-dropdown';
import { ActiveInactiveStatus } from 'src/app/modals/enums/active-inactive-status/active-inactive-status.enum';
import { Service } from 'src/app/modals/service/service';
import { User } from 'src/app/modals/user/user';
import { OrgService } from 'src/app/pages/price-book/org-services/services/org.service';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { Utils } from 'src/shared/utilities/utils';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NZInputValidationType } from 'src/app/modals/enums/nzinput-validation-type.enum';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { ChangeService } from 'src/shared/services/change/change.service';
import { Change } from 'src/app/modals/change/change';
import { ChangeModule } from 'src/app/modals/enums/change-module/change-module.enum';
import { debug } from 'console';
import { ActionEvent } from 'src/app/modals/enums/action-event/action-event.enum';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { DisplayConstant } from 'src/shared/constants/display-constants/display-constant';
import { PlaceholderConstant } from 'src/shared/constants/placeholder-constants/placeholder-constant';

@Component({
  selector: 'app-service-add',
  templateUrl: './service-add.component.html',
  styleUrls: ['./service-add.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ServiceAddComponent implements OnInit, OnDestroy {
  serviceId: string;
  orgId: string;
  description: string;

  subscriptions: Subscription[] = [];
  service: Service = new Service();
  serviceCopy: Service = new Service();
  statusDropdown: AppDropdown[] = [];
  categories: any[] = [];
  // selectedCategories: string[] = [];

  priceRegex: RegExp;
  urlRegex: RegExp;
  isSpinning: boolean = false;
  isImageLoading: boolean = false;
  serviceNameValidationStatus: NZInputValidationType;

  serviceName$ = new Subject<string>();

  changes: Change[] = [];
  changedType: string;

  maximumSelections: number;

  // placeholders
  serviceCodePlaceholder: string;
  serviceNamePlaceholder: string;
  serviceDescriptionPlaceholder: string;
  serviceCategoriesPlaceholder: string;
  servicePricePlaceholder: string;
  serviceMemberPricePlaceholder: string;
  serviceAddonPricePlaceholder: string;
  serviceBonusPlaceholder: string;
  serviceVideoLinkPlaceholder: string;
  serviceStatusPlaceholder: string;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private orgService: OrgService,
    private changeService: ChangeService
  ) { }

  ngOnInit() {
    this.description = 'Add a new service';
    this.setPlaceholders();
    this.setOrgId();
    this.setDropdowns();
    this.getRouteParams();
    this.setRegExps();
    // this.setServiceCodeInputSubscription();
    this.changedType = this.getChangedType();
    this.setMaximumSelections();

    this.subscriptions.push(
      this.serviceName$
        .pipe(debounceTime(750), distinctUntilChanged())
        .subscribe(
          (serviceName: string) => {
            serviceName = serviceName ? serviceName.trim() : serviceName;
            if (serviceName) {
              if (this.serviceId && serviceName === this.serviceCopy.name) {
                this.serviceNameValidationStatus =
                  NZInputValidationType.success;
              } else {
                this.serviceNameValidationStatus =
                  NZInputValidationType.validating;
                this.checkServiceNameValidity(serviceName);
              }
            } else {
              this.serviceNameValidationStatus = NZInputValidationType.error;
            }
          },
          (error) => {
            // handle error
          }
        )
    );
  }

  setPlaceholders() {
    this.serviceCodePlaceholder = PlaceholderConstant.SERVICE_CODE;
    this.serviceNamePlaceholder = PlaceholderConstant.SERVICE_NAME;
    this.serviceDescriptionPlaceholder = PlaceholderConstant.SERVICE_DESCRIPTION;
    this.serviceCategoriesPlaceholder = PlaceholderConstant.CATEGORIES;
    this.servicePricePlaceholder = PlaceholderConstant.SERVICE_PRICE;
    this.serviceMemberPricePlaceholder = PlaceholderConstant.SERVICE_MEMBER_PRICE;
    this.serviceAddonPricePlaceholder = PlaceholderConstant.SERVICE_ADDON_PRICE;
    this.serviceBonusPlaceholder = PlaceholderConstant.SERVICE_BONUS;
    this.serviceVideoLinkPlaceholder = PlaceholderConstant.SERVICE_VIDEO_LINK;
    this.serviceStatusPlaceholder = PlaceholderConstant.STATUS;
  }

  setOrgId() {
    this.authenticationService.currentUser.subscribe((user: User) => {
      // const user: User = Utils.getItemFromLocalStorage('user');
      if (user && user.organization) {
        this.orgId = user.organization.id;
        // this.getCategories();
      } else {
        this.orgId = undefined;
        this.changeService.setInitialService(Utils.cloneDeep(this.service));
      }
    });
  }

  setRegExps() {
    this.priceRegex = Utils.priceRegex;
    this.urlRegex = Utils.urlRegex;
  }

  setDropdowns() {
    this.setStatusDropdown();
  }

  setStatusDropdown() {
    this.statusDropdown = [];
    this.statusDropdown = Utils.createDropdownForNewEnum(
      GeneralStatus,
      false,
      false,
      false,
      false
    );
  }

  setServiceStatusForDropdown() {
    const key = Utils.getEnumKey(ActiveInactiveStatus, this.service.status);
    if (key) {
      this.service.status = this.statusDropdown.find(
        (item) => item.label === key
      ).value;
    } else {
      // do nothing --> this case should never occur
    }
  }

  setSelectedCategories() {
    // this.selectedCategories = this.service.categories.map((category: any) => category.id);
    if (this.categories && this.categories.length > 0 && this.service.categories && this.service.categories.length > 0) {
      const categories = this.categories.filter(category => this.service.categories.findIndex(cat => cat.id === category.id) !== -1);
      if (categories && categories.length > 0) {
        this.service.categories = categories;
      } else {
        // do nothing
      }
    }
  }

  setServiceStatusForBackend() {
    const label = Utils.getDropdownLabel(
      this.statusDropdown,
      this.service.status
    );
    if (label) {
      this.service.status = ActiveInactiveStatus[label];
    } else {
      // do nothing --> this case should never occur
    }
  }

  onSubmit() {
    this.changes = this.changeService.getChanges();
    if (this.serviceId) {
      this.updateService();
    } else {
      this.createService();
    }
  }

  getRouteParams() {
    this.subscriptions.push(
      this.activatedRoute.params.subscribe(
        (params: Params) => {
          if (params.id) {
            this.serviceId = params.id;
            this.description = 'Edit the service';
            this.getService();
          } else {
            this.serviceId = undefined;
            this.getCategories();
            this.service.status = this.statusDropdown.filter(item => item.value === Utils.getEnumKey(GeneralStatus, GeneralStatus.active))[0].value;
            // this.setServiceStatusForDropdown();
          }
        })
    );
  }

  getCategories() {
    this.isSpinning = true;
    // const sortData: SortData[] = [{ sortColumn: 'name', sortOrder: 'asc' }];
    // const paginationData: PaginationData = { page: 1, size: 100 };

    this.subscriptions.push(
      this.orgService.listCategories(this.orgId, this.getCategoriesSortObject(), this.getListPaginationObject(), null, this.getListFilterDataForActiveStatus(), this.getSelectedServiceCategoryIds()).valueChanges.subscribe(
        (response: any) => {
          if (response && response.data && response.data.listCategories
            && response.data.listCategories.data && response.data.listCategories.data.length) {
            this.categories = response.data.listCategories.data;
            this.isSpinning = false;
            this.setSelectedCategories();
            // this.getRouteParams();
          } else {
            this.isSpinning = false;
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

  getSelectedServiceCategoryIds() {
    let ids: string[] = [];
    if (this.service && this.service.categories && this.service.categories.length > 0) {
      ids = this.service.categories.map(service => service.id);
    }
    return ids;
  }

  getCategoriesSortObject() {
    const sortData: SortData[] = [];
    const sort: SortData = {
      sortColumn: 'name',
      sortOrder: 'asc',
    };
    sortData.push(sort);
    return sortData;
  }

  getListFilterDataForActiveStatus() {
    return Utils.createListFilterDataForActiveStatus();
  }

  createService() {
    this.isSpinning = true;
    this.normalizeCurrency();
    this.subscriptions.push(
      this.orgService.createService(this.service).subscribe(
        (response: any) => {
          if (response) {
            this.messageService.success(AppMessages.SERVICE_ADDED);
            this.isSpinning = false;
            this.navigateToServiceList();
          } else {
            this.isSpinning = false;
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

  getService() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.orgService.getService(this.serviceId).valueChanges.subscribe(
        (response: any) => {
          if (response && response.data && response.data.getService) {
            this.service = response.data.getService;
            // Creating a deep clone of service object
            this.serviceCopy = JSON.parse(
              JSON.stringify(response.data.getService)
            );
            this.changeService.setInitialService(Utils.cloneDeep(this.service));
            // this.setServiceStatusForDropdown();
            this.getCategories();
            // this.setSelectedCategories();
            this.isSpinning = false;
          } else {
            this.isSpinning = false;
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

  updateService() {
    this.changes = this.changeService.getChanges();
    this.isSpinning = true;
    // this.normalizeCurrency();
    // this.setServiceStatusForBackend();
    this.subscriptions.push(
      this.orgService.updateService(this.service, this.changes).subscribe(
        (response) => {
          this.isSpinning = false;
          if (response) {
            this.messageService.success(AppMessages.SERVICE_UPDATED);
            this.isSpinning = false;
            this.navigateToServiceList();
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

  /**
   * @description Chcecks for duplicate service code
   * from backend
   * @author Aman Purohit
   * @date 2020-06-23
   * @param {string} value
   * @memberof ServiceAddComponent
   */
  checkServiceNameValidity(value: string) {
    this.subscriptions.push(
      this.orgService.checkIfCodeExists(this.orgId, value).subscribe(
        (response: any) => {
          if (
            response &&
            response.data &&
            response.data.checkIfServiceAlreadyTaken
          ) {
            this.serviceNameValidationStatus = NZInputValidationType.error;
          } else {
            this.serviceNameValidationStatus = NZInputValidationType.success;
          }
        },
        (error) => {
          this.serviceNameValidationStatus = NZInputValidationType.error;
        }
      )
    );
  }

  onServiceNameInput(): void {
    this.serviceName$.next(this.service.name);
  }

  onCancel(): void {
    this.navigateToServiceList();
  }

  navigateToServiceList() {
    this.router.navigate([
      AppUrlConstants.SLASH +
      AppUrlConstants.PRICEBOOK +
      AppUrlConstants.SLASH +
      AppUrlConstants.SERVICES,
    ]);
  }

  normalizeCurrency() {
    this.service.price = Utils.convertToNumber(this.service.price);
    this.service.addOnPrice = Utils.convertToNumber(this.service.addOnPrice);
    this.service.memberPrice = Utils.convertToNumber(this.service.memberPrice);
    this.service.bonus = Utils.convertToNumber(this.service.bonus);
  }

  handleImageLoading(status: boolean) {
    this.isImageLoading = status;
  }

  setImageUrl(url: string) {
    this.updateChangesObject('imageUrl', url, ActionEvent.UPDATE);
    this.service.imageUrl = url;
  }

  updateChangesObject(fieldName: string, newUrl: string, action: ActionEvent) {
    let changes = this.changeService.getChanges();
    const index = changes.findIndex((change) => change.fieldName === fieldName);
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

  getChangedType() {
    return ChangeModule.SERVICE;
  }

  setMaximumSelections() {
    this.maximumSelections = DisplayConstant.MAX_SELECTION;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
