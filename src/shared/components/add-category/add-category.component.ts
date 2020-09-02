import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { Category } from 'src/app/modals/category/category';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UploadFile } from 'ng-zorro-antd';
import { AddCategoryService } from './add-category-service/add-category-service';
import { Utils } from 'src/shared/utilities/utils';
import { BusinessUnit } from 'src/app/modals/business-unit/business-unit';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { Apollo } from 'apollo-angular';
import { Service } from 'src/app/modals/service/service';
import { User } from 'src/app/modals/user/user';
import { FilterOp } from 'src/app/modals/filtering/filter-op.enum';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { AppDropdown } from 'src/app/modals/app-dropdown/app-dropdown';
import { Change } from 'src/app/modals/change/change';
import { ChangeService } from 'src/shared/services/change/change.service';
import { ChangeModule } from 'src/app/modals/enums/change-module/change-module.enum';
import { NZInputValidationType } from 'src/app/modals/enums/nzinput-validation-type.enum';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { ActionEvent } from 'src/app/modals/enums/action-event/action-event.enum';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { DisplayConstant } from 'src/shared/constants/display-constants/display-constant';
import { PlaceholderConstant } from 'src/shared/constants/placeholder-constants/placeholder-constant';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddCategoryComponent implements OnInit, OnDestroy {

  isSpinning = false;
  subscriptions: Subscription[] = [];
  category: Category = new Category();
  categoryCopy: Category = new Category();
  businessUnits: BusinessUnit[] = [];
  serviceList: Service[] = [];
  filterData: FilterData = { field: 'status', value: 'active', op: FilterOp.in };
  imageLoading: boolean;
  categoryImage: string;
  sortData: SortData = {};
  categoryId: string;
  files: UploadFile[] = [];
  beforeUpload;
  firstLoad: boolean = true;
  selectBusinessUnit: string;
  statusDropdown: AppDropdown[] = [];
  changes: Change[] = [];
  changedType: string;
  selectedServices: any;
  orgId: string;
  categoryNameValidationStatus: NZInputValidationType;
  categoryName$ = new Subject<string>();
  maximumSelections: number;

  // placeholders
  categoryNamePlaceholder: string;
  categoryBusinessUnitPlaceholder: string;
  categoryCodePlaceholder: string;
  categoryServicesPlaceholder: string;
  categoryStatusPlaceholder: string;

  constructor(
    private addCategoryService: AddCategoryService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private router: Router,
    private messageService: MessageService,
    private apolloService: Apollo,
    private changeService: ChangeService
  ) { }

  ngOnInit() {
    this.setPlaceholders();
    this.setStatusDropdown();
    this.setOrgId();
    // this.getServices();
    this.getRouteParams();
    // this.getServiceList();
    this.setCategoryNameInputSubscription();
    this.changedType = this.getChangedType();
    this.setMaximumSelections();
  }

  setPlaceholders() {
    this.categoryNamePlaceholder = PlaceholderConstant.CATEGORY_NAME;
    this.categoryBusinessUnitPlaceholder = PlaceholderConstant.BUSINESS_UNIT;
    this.categoryCodePlaceholder = PlaceholderConstant.CATEGORY_CODE;
    this.categoryServicesPlaceholder = PlaceholderConstant.SERVICES;
    this.categoryStatusPlaceholder = PlaceholderConstant.STATUS;
  }

  onCategoryNameInput(): void {
    this.categoryName$.next(this.category.name);
  }

  setCategoryNameInputSubscription() {
    this.subscriptions.push(
      this.categoryName$
        .pipe(
          debounceTime(750),
          distinctUntilChanged()
        )
        .subscribe((categoryName: string) => {
          categoryName = (categoryName) ? categoryName.trim() : categoryName;
          if (categoryName) {
            if (this.categoryId && categoryName === this.categoryCopy.name) {
              this.categoryNameValidationStatus = NZInputValidationType.success;
            } else {
              this.categoryNameValidationStatus = NZInputValidationType.validating;
              this.checkCategoryNameValidity(categoryName);
            }
          } else {
            this.categoryNameValidationStatus = NZInputValidationType.error;
          }
        }, (error) => {
          // handle error
        })
    );
  }

  checkCategoryNameValidity(value: string) {
    this.subscriptions.push(
      // this.addCategoryService.checkIfCodeAndNameExist(this.orgId, value, null).subscribe(
      this.addCategoryService.checkIfCodeAndNameExist(this.orgId, value).subscribe(
        (response: any) => {
          if (response && response.data && response.data.checkIfCategoryTaken) {
            this.categoryNameValidationStatus = NZInputValidationType.error;
          } else {
            this.categoryNameValidationStatus = NZInputValidationType.success;
          }
        }, (error) => {
          this.categoryNameValidationStatus = NZInputValidationType.error;
        }

      )
    );
  }

  setStatusDropdown() {
    this.statusDropdown = [];
    this.statusDropdown = Utils.createDropdownForNewEnum(GeneralStatus, false, false, false, false);
  }

  setOrgId() {
    this.subscriptions.push(
      this.authenticationService.currentUser.subscribe((user: User) => {
        // const user: User = Utils.getItemFromLocalStorage('user');
        if (user && user.organization) {
          this.orgId = user.organization.id;
          // this.getBusinessUnits();
        } else {
          this.orgId = undefined;
        }
      })
    );
  }

  getRouteParams() {
    this.subscriptions.push(
      this.route.params.subscribe(
        (params: Params) => {
          if (params.id) {
            this.categoryId = params.id;
            this.getCategory();
          } else {
            this.categoryId = undefined;
            this.getServiceList();
            this.getBusinessUnits();
            this.category.status = this.statusDropdown.filter(item => item.value === Utils.getEnumKey(GeneralStatus, GeneralStatus.active))[0].value;
            this.changeService.setInitialCategory(Utils.cloneDeep(this.category));
          }
        }
      )
    );
  }

  getServiceList() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.addCategoryService.getServices(this.orgId, this.getListPaginationObject(), this.getServicesSortObject(), null, this.getListFilterDataForActiveStatus(), this.getSelectedCategoryServiceIds())
        .valueChanges
        .subscribe(
          (response) => {
            if (response) {
              this.serviceList = response['data']['listServices']['data'];
              this.setSelectedServices();
              // setTimeout(() => {
              //   this.patchService();
              // }, 300);
              // this.serviceList = SortUtil.sortArrayWithCombinedField(this.serviceList, ['name']);
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

  getSelectedCategoryServiceIds() {
    let ids: string[] = [];
    if (this.category && this.category.services && this.category.services.length > 0) {
      ids = this.category.services.map(service => service.id);
    }
    return ids;
  }

  getServicesSortObject() {
    const sortData: SortData[] = [];
    const sort: SortData = {
      sortColumn: 'name',
      sortOrder: 'asc'
    };
    sortData.push(sort);
    return sortData;
  }

  /**
   * @description Get List of business units
   * @author Rajeev Kumar
   * @date 2020-06-19
   * @memberof AddCategoryComponent
   */
  getBusinessUnits() {
    this.isSpinning = true;
    const sortData: SortData[] = [{ sortColumn: 'name', sortOrder: 'asc' }];
    const paginationData: PaginationData = { page: 1, size: 100 };
    this.subscriptions.push(
      this.addCategoryService.getBusinessUnits(this.orgId, this.getListPaginationObject(), this.getBusinessUnitSortObject(), null, this.getListFilterDataForActiveStatus(), this.getSelectedBusinessUnitIds())
        .valueChanges.subscribe(
          (response) => {
            if (response) {
              this.businessUnits = response['data']['listBusinessUnits']['data'];
              this.setSelectedBusinessUnit();
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

  getListPaginationObject() {
    return Utils.createListPaginationObject();
  }

  getSelectedBusinessUnitIds() {
    let ids: string[] = [];
    if (this.category && this.category.businessUnit && this.category.businessUnit.id !== undefined && this.category.businessUnit.id !== null) {
      ids = [this.category.businessUnit.id];
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

  getCategory() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.addCategoryService.getCategory(this.categoryId)
        .valueChanges.subscribe((response) => {
          if (response) {
            this.category = response['data']['getCategory'];
            this.categoryCopy = JSON.parse(JSON.stringify(response['data']['getCategory']));
            this.getServiceList();
            this.getBusinessUnits();
            // this.setSelectedBusinessUnit();
            // this.setSelectedServices();
            this.changeService.setInitialCategory(Utils.cloneDeep(this.category));
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
        ));
  }

  setBusinessUnitId(category) {
    if (category && category.businessUnit && category.businessUnit.id) {
      this.category.businessUnit = category.businessUnit.id;
    }
  }

  setSelectedBusinessUnit() {
    if (this.category && this.category.businessUnit && this.category.businessUnit.id && this.businessUnits && this.businessUnits.length > 0) {
      this.category.businessUnit = this.businessUnits.filter(unit => unit.id === this.category.businessUnit.id)[0];
    } else {
      // do nothing
      this.category.businessUnit = null;
    }
  }

  patchService() {
    if (this.serviceList && this.serviceList.length > 0 && (this.category && this.category.services && this.category.services.length > 0)) {
      const service = this.serviceList.filter(s => this.category.services.findIndex(t => t.id === s.id) !== -1);
      if (service && service.length > 0) {
        this.category.services = service;
      }
    } else {
      // do nothing
    }
  }

  setSelectedServices() {
    if (this.category && this.category.services && this.category.services.length > 0 && this.serviceList && this.serviceList.length > 0) {
      const services = this.serviceList.filter(service => this.category.services.findIndex(serv => serv.id === service.id) !== -1);
      if (services && services.length > 0) {
        this.category.services = services;
      } else {
        // do nothing
        this.category.services = null;
      }
    } else {
      // do nothing
      this.category.services = null;
    }
  }



  setImageUrl(url: string) {
    this.updateChangesObject('imageUrl', 'Image Url', url, this.category.imageUrl, ActionEvent.UPDATE);
    this.category.imageUrl = url;
  }

  updateChangesObject(fieldName: string, fieldDisplayName: string, newValue: any, oldValue: any, action: string) {
    let changes = this.changeService.getChanges();
    const index = changes.findIndex(change => change.fieldName === fieldName);
    switch (action) {
      case ActionEvent.UPDATE: {
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

  onSubmitForm() {
    this.isSpinning = true;

    if (this.categoryId) {
      this.updateCategory();
    } else {
      this.addCategory();
    }
  }

  updateCategory() {
    this.changes = this.changeService.getChanges();
    this.subscriptions.push(
      this.addCategoryService.updateCategory(this.category, this.changes).subscribe(
        (response) => {
          if (response) {
            this.apolloService.getClient().resetStore().then(val => {
              this.messageService.success(AppMessages.CATEGORY_UPDATED);
              this.navigateToCategoryList();
              this.isSpinning = false;
            });
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
        })
    );
  }

  addCategory() {
    this.subscriptions.push(
      this.addCategoryService.createCategory(this.category).subscribe(
        (response) => {
          if (response) {
            this.apolloService.getClient().resetStore().then(val => {
              this.messageService.success(AppMessages.CATEGORY_ADDED);
              this.navigateToCategoryList();
              this.isSpinning = false;
            });
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
        })
    );
  }

  navigateToCategoryList() {
    this.router.navigate([AppUrlConstants.SLASH + AppUrlConstants.PRICEBOOK + AppUrlConstants.SLASH + AppUrlConstants.CATEGORIES]);
  }

  onCancel() {
    this.router.navigateByUrl('/priceBook/categories');
  }

  handleImageLoading(status: boolean) {
    this.imageLoading = status;
  }

  getChangedType() {
    return ChangeModule.CATEGORY;
  }

  setMaximumSelections() {
    this.maximumSelections = DisplayConstant.MAX_SELECTION;
  }

  ngOnDestroy() {
    // unsubscribing all the subscriptions
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
