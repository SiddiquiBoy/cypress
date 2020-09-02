import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { BusinessUnit } from 'src/app/modals/business-unit/business-unit';
import { NgForm } from '@angular/forms';
import { BusinessunitAddService } from './services/businessunit-add.service';
import { Tag } from 'src/app/modals/tag/tag';
import { Apollo } from 'apollo-angular';
import { Utils } from 'src/shared/utilities/utils';
import { Subscription, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { DateUtil } from 'src/shared/utilities/date-util';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { Router, ActivatedRoute } from '@angular/router';
import { AppDropdown } from 'src/app/modals/app-dropdown/app-dropdown';
import { User } from 'src/app/modals/user/user';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { ChangeService } from 'src/shared/services/change/change.service';
import { Change } from 'src/app/modals/change/change';
import { ChangeModule } from 'src/app/modals/enums/change-module/change-module.enum';
import { NZInputValidationType } from 'src/app/modals/enums/nzinput-validation-type.enum';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { Country } from 'src/app/modals/country/country';
import { State } from 'src/app/modals/state/state';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { DisplayConstant } from 'src/shared/constants/display-constants/display-constant';
import { PlaceholderConstant } from 'src/shared/constants/placeholder-constants/placeholder-constant';

@Component({
  selector: 'app-businessunit-add',
  templateUrl: './businessunit-add.component.html',
  styleUrls: ['./businessunit-add.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BusinessunitAddComponent implements OnInit {
  @ViewChild('buForm', { static: true }) buForm: NgForm;
  businessUnit: BusinessUnit = new BusinessUnit();
  businessUnitCopy: BusinessUnit = new BusinessUnit();
  statusDropdown: AppDropdown[] = [];
  subscriptions: Subscription[] = [];
  tags: Tag[];
  customPaginationData: PaginationData = {};
  countries: Country[] = [];
  states: State[] = [];
  selectedValue: any;
  isSpinning: boolean;
  activeTab: boolean;
  sortData: SortData = {};
  formValidate: boolean;
  current = 0;
  index = 'details';
  editID: string;
  getData: any;
  changes: Change[] = [];
  changedType: string;
  orgId: string;
  dateFormat: string;
  maximumSelections: number;
  activeIndex = 0;
  private cd: ChangeDetectorRef;


  stepToFormValidity: Map<number, boolean> = new Map();
  stepToFormPristine: Map<number, boolean> = new Map();
  isFormValid$: Subject<boolean> = new Subject<boolean>();
  isFormValid = false;
  isFormPristine = true;
  isVendorFetched$: Subject<boolean> = new Subject<boolean>();
  isTagsFetched = false;

  showConfirmDialog = false;
  confirmDialogMessage = 'Changes will not be saved. Do you wish to proceed?';

  buNameValidationStatus: NZInputValidationType;
  buEmailValidationStatus: NZInputValidationType;
  buPhoneValidationStatus: NZInputValidationType;
  buName$ = new Subject<string>();
  buEmail$ = new Subject<string>();
  buPhone$ = new Subject<string>();

  // placeholders
  businessUnitInternalNamePlaceholder: string;
  businessUnitOfficialNamePlaceholder: string;
  businessUnitTagsPlaceholder: string;
  businessUnitEmailPlaceholder: string;
  businessUnitPhoneNumberPlaceholder: string;
  businessUnitMinimumPostDatePlaceholder: string;
  businessUnitStatusPlaceholder: string;
  businessUnitAddressStreetPlaceholder: string;
  businessUnitAddressCountryPlaceholder: string;
  businessUnitAddressStatePlaceholder: string;
  businessUnitAddressCityPlaceholder: string;
  businessUnitAddressZipCodePlaceholder: string;

  constructor(
    private apolloService: Apollo,
    private activateRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private router: Router,
    private businessunitAddService: BusinessunitAddService,
    private changeService: ChangeService
  ) { }


  ngOnInit() {
    this.setActiveIndex();

    this.setInitialValueForStepMap();
    this.setInitialValueForPristineMap()
    this.setPlaceholders();
    this.statusDropdown = Utils.createDropdownForNewEnum(GeneralStatus, false, false, false, false);
    this.dateFormat = DateUtil.inputDefaultDateFormat;
    // this.countries = countries;
    this.changedType = this.getChangedType();
    this.getRouteById();
    // this.getTags();
    this.setOrgId();
    this.setCountryAndState();
    this.setMaximumSelections();


    this.subscriptions.push(
      this.isFormValid$.subscribe((val) => {
        this.isFormValid = val;
        this.detectChanges();
      })
    );
    // Subcriptions for Email unique validation
    this.subscriptions.push(
      this.buEmail$
        .pipe(
          debounceTime(750),
          distinctUntilChanged()
        )
        .subscribe((buEmail: string) => {
          buEmail = (buEmail) ? buEmail.trim() : buEmail;

          if (buEmail) {
            if (this.editID && buEmail === this.businessUnitCopy.email) {
              this.buEmailValidationStatus = NZInputValidationType.success;
            } else {
              this.buEmailValidationStatus = NZInputValidationType.validating;
              this.checkBuEmailValidity(buEmail);
            }
          } else {
            this.buEmailValidationStatus = NZInputValidationType.error;
          }
        }, (error) => {
          // handle error
        })
    );

    // Subcription for phone unique validation
    this.subscriptions.push(
      this.buPhone$
        .pipe(
          debounceTime(750),
          distinctUntilChanged()
        )
        .subscribe((buPhone: string) => {
          buPhone = (buPhone) ? buPhone.trim() : buPhone;
          if (buPhone) {
            buPhone = Utils.phoneRemoveSpecialChars(buPhone);
            if (this.editID && buPhone === this.businessUnitCopy.phone) {
              this.buPhoneValidationStatus = NZInputValidationType.success;
            } else {
              this.buPhoneValidationStatus = NZInputValidationType.validating;
              this.checkBuPhoneValidity(buPhone);
            }
          } else {
            this.buPhoneValidationStatus = NZInputValidationType.error;
          }
        }, (error) => {
          // handle error
        })
    );

    // Subscription for unique name validation
    this.subscriptions.push(
      this.buName$
        .pipe(
          debounceTime(750),
          distinctUntilChanged()
        )
        .subscribe((buName: string) => {
          buName = (buName) ? buName.trim() : buName;
          if (buName) {
            if (this.editID && buName === this.businessUnitCopy.name) {
              this.buNameValidationStatus = NZInputValidationType.success;
            } else {
              this.buNameValidationStatus = NZInputValidationType.validating;
              this.checkBuNameValidity(buName);
            }
          } else {
            this.buNameValidationStatus = NZInputValidationType.error;
          }
        }, (error) => {
          // handle error
        })
    );
  }

  setPlaceholders() {
    // this.businessUnitInternalNamePlaceholder = PlaceholderConstant.BUSINESS_UNIT_INTERNAL_NAME;
    // this.businessUnitOfficialNamePlaceholder = PlaceholderConstant.BUSINESS_UNIT_OFFICIAL_NAME;
    // this.businessUnitTagsPlaceholder = PlaceholderConstant.TAGS;
    // this.businessUnitEmailPlaceholder = PlaceholderConstant.EMAIL;
    // this.businessUnitPhoneNumberPlaceholder = PlaceholderConstant.PHONE_NUMBER;
    // this.businessUnitMinimumPostDatePlaceholder = PlaceholderConstant.DATE;
    // this.businessUnitStatusPlaceholder = PlaceholderConstant.STATUS;
    // this.businessUnitAddressStreetPlaceholder = PlaceholderConstant.STREET;
    // this.businessUnitAddressCountryPlaceholder = PlaceholderConstant.COUNTRY;
    // this.businessUnitAddressStatePlaceholder = PlaceholderConstant.STATE;
    // this.businessUnitAddressCityPlaceholder = PlaceholderConstant.CITY;
    // this.businessUnitAddressZipCodePlaceholder = PlaceholderConstant.ZIP_CODE;
  }

  setActiveIndex(index?: number) {
    if (index !== null && index !== undefined) {
      this.activeIndex = index;
    } else {
      this.activeIndex = 0;
    }
  }


  getRouteById() {
    this.activateRoute.params.subscribe((data) => {
      if (data) {
        this.editID = data['id'];
        if (this.editID) {
          this.getBusinessUnit();
        } else {
          this.businessUnit.status = this.statusDropdown.filter(item => item.value === Utils.getEnumKey(GeneralStatus, GeneralStatus.active))[0].value;
          this.changeService.setInitialBusinessUnit(Utils.cloneDeep(this.businessUnit));
          this.getTags();
        }
      }
    });
  }

  setCountryAndState() {
    this.countries = Utils.getCountries();
    this.setSelectedCountry();
  }

  setSelectedCountry() {
    if (this.businessUnit && this.businessUnit.country) {
      const cntry = this.countries.filter(country => country.name === this.businessUnit.country)[0];
      if (cntry) {
        this.businessUnit.country = cntry.name;
        this.onCountrySelect();
      }
    } else {
      this.setIfSingleCountryInList();
    }
  }

  setIfSingleCountryInList() {
    if (this.countries && this.countries.length && this.countries.length === 1) {
      this.businessUnit.country = this.countries[0].name;
      this.onCountrySelect();
    }
  }

  onCountrySelect() {
    this.setStatesDropdown();
  }

  setStatesDropdown() {
    if (this.businessUnit.country) {
      const cntry = this.countries.filter(country => country.name === this.businessUnit.country)[0];
      this.states = cntry.states;
    }
    this.setSelectedState();
  }

  setSelectedState() {
    if (this.businessUnit && this.businessUnit.country) {
      const cntry = this.countries.filter(country => country.name === this.businessUnit.country)[0];
      const cntryState = cntry.states.filter(state => state.name === this.businessUnit.state)[0];
      if (cntryState) {
        this.businessUnit.state = cntryState.name;
      }
    }
  }

  handleChange(event) { }

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

  onBuNameInput(): void {
    this.buName$.next(this.businessUnit.name);
  }

  onBuEmailInput(): void {
    const validateEmail = Utils.validateEmail(this.businessUnit.email);
    if (validateEmail) {
      this.buEmail$.next(this.businessUnit.email);
    } else {
      this.buEmail$.next('');
    }
  }
  onBuPhoneInput(): void {
    const phone = this.businessUnit.phone;
    if (phone.length > 13) {
      this.buPhone$.next(phone.replace(/[^a-zA-Z0-9]/g, ''));
    } else {
      this.buPhone$.next('');
    }
  }

  checkBuNameValidity(name: string) {
    this.subscriptions.push(
      this.businessunitAddService.checkIfEmailPhoneAndNameExist(this.orgId, name, null, null).subscribe(
        (response: any) => {
          if (response && response.data && response.data.checkIfBusinessUnitTaken) {
            this.buNameValidationStatus = NZInputValidationType.error;
          } else {
            this.buNameValidationStatus = NZInputValidationType.success;
          }
        }, (error) => {
          this.buNameValidationStatus = NZInputValidationType.error;
        })
    );
  }

  checkBuEmailValidity(email: string) {
    this.subscriptions.push(
      this.businessunitAddService.checkIfEmailPhoneAndNameExist(this.orgId, null, email, null).subscribe(
        (response: any) => {
          if (response && response.data && response.data.checkIfBusinessUnitTaken) {
            this.buEmailValidationStatus = NZInputValidationType.error;
          } else {
            this.buEmailValidationStatus = NZInputValidationType.success;
          }
        }, (error) => {
          this.buEmailValidationStatus = NZInputValidationType.error;
        })
    );
  }
  checkBuPhoneValidity(phone: string) {
    this.subscriptions.push(
      this.businessunitAddService.checkIfEmailPhoneAndNameExist(this.orgId, null, null, phone).subscribe(
        (response: any) => {
          if (response && response.data && response.data.checkIfBusinessUnitTaken) {
            this.buPhoneValidationStatus = NZInputValidationType.error;
          } else {
            this.buPhoneValidationStatus = NZInputValidationType.success;
          }
        }, (error) => {
          this.buPhoneValidationStatus = NZInputValidationType.error;
        })
    );
  }

  getBusinessUnit() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.businessunitAddService.getBusinessUnit(this.editID).valueChanges.subscribe((response: any) => {

        this.businessUnit = response['data']['getBusinessUnit'];
        this.businessUnitCopy = JSON.parse(JSON.stringify(response['data']['getBusinessUnit']));
        this.getTags();
        this.changeService.setInitialBusinessUnit(Utils.cloneDeep(this.businessUnit));
        this.setSelectedBUTags();
        this.isSpinning = false;
      })
    )
  }

  setSelectedBUTags() {
    if (this.tags && this.tags.length > 0 && this.businessUnit && this.businessUnit.tags && this.businessUnit.tags.length > 0) {
      this.businessUnit.tags = (this.tags.filter(tag => this.businessUnit.tags.findIndex(jTag => jTag.id === tag.id) !== -1));
    }
  }

  getTags() {
    this.isSpinning = true;
    // const sortData: SortData[] = [{ sortColumn: 'name', sortOrder: 'asc' }];
    // const paginationData: PaginationData = { page: 1, size: 100 };
    this.subscriptions.push(
      this.authenticationService.currentUser.subscribe((token: User) => {
        // const token = Utils.getItemFromLocalStorage('user');
        this.subscriptions.push(
          this.businessunitAddService.getTags(token.organization.id, this.getTagsSortObject(), this.getListPaginationObject(), null, this.getListFilterDataForActiveStatus(), this.getSelectedBusinessUnitTagIds()).valueChanges
            .subscribe(
              (response: any) => {
                if (response) {
                  this.tags = response['data']['listTags']['data'];
                  // this.getRouteById();
                  this.isTagsFetched = true
                  this.setSelectedBUTags();
                  this.isSpinning = false;
                } else {
                  this.isSpinning = false;
                }
              },
              (error) => {
                const errorObj = ErrorUtil.getErrorObject(error);
                this.isSpinning = false;
                this.isTagsFetched = true;
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
      })
    );
  }

  getListFilterDataForActiveStatus() {
    return Utils.createListFilterDataForActiveStatus();
  }

  getListPaginationObject() {
    return Utils.createListPaginationObject();
  }

  getTagsSortObject() {
    const sortData: SortData[] = [];
    const sort: SortData = {
      sortColumn: 'name',
      sortOrder: 'asc'
    };
    sortData.push(sort);
    return sortData;
  }

  getSelectedBusinessUnitTagIds() {
    let ids: string[] = [];
    if (this.businessUnit && this.businessUnit.tags && this.businessUnit.tags.length > 0) {
      ids = this.businessUnit.tags.map(tag => tag.id);
    }
    return ids;
  }

  onSubmit() {
    this.isSpinning = true;
    if (this.editID) {
      this.updateBusinessUnit();
    } else {
      this.addBusinessUnit();
    }
  }

  addBusinessUnit() {
    this.subscriptions.push(
      this.businessunitAddService.createBusinessUnit(this.businessUnit).subscribe(
        (response) => {
          if (response) {
            this.apolloService.getClient().resetStore().then(val => {
              this.navigateToBusinessUnitsList();
              this.isSpinning = false;
              this.messageService.success(AppMessages.BUSINESS_UNIT_ADDED);
            });
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
        })
    );
  }

  updateBusinessUnit() {
    this.changes = this.changeService.getChanges();
    this.subscriptions.push(
      this.businessunitAddService.updateBusinessUnit(this.businessUnit, this.editID, this.changes)
        .subscribe(
          (response) => {
            if (response) {
              this.apolloService.getClient().resetStore().then(val => {
                this.navigateToBusinessUnitsList();
                this.isSpinning = false;
                this.messageService.success(AppMessages.BUSINESS_UNIT_UPDATED);
              });
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
          })
    );
  }

  phoneValidation(e: any) {
    Utils.usPhoneFormat(e);
  }

  getChangedType() {
    return ChangeModule.BUSINESS_UNIT;
  }

  getMappedIds(tags: Tag[]): string[] {
    if (tags) {
      return tags.map(tag => tag.id);
    } else {
      return [];
    }
  }

  navigateToBusinessUnitsList() {
    this.router.navigate([AppUrlConstants.SLASH + AppUrlConstants.SETTINGS + AppUrlConstants.SLASH + AppUrlConstants.OPERATIONS + AppUrlConstants.SLASH + AppUrlConstants.BUSINESS_UNIT]);
  }


  pre(): void {
    this.current -= 1;
    this.changeContent();
  }

  next(): void {
    this.current += 1;
    this.changeContent();
  }

  changeContent(): void {
    switch (this.current) {
      case 0: {
        this.index = 'details';
        break;
      }
      case 1: {
        this.index = 'address';
        break;
      }
      default: {
        this.index = 'error';
      }
    }
  }

  setMaximumSelections() {
    this.maximumSelections = DisplayConstant.MAX_SELECTION;
  }

  setInitialValueForStepMap() {
    this.stepToFormValidity.set(0, this.editID ? true : false);
    this.stepToFormValidity.set(1, this.editID ? true : false);
    // this.stepToFormValidity.set(3, false);
  }

  setInitialValueForPristineMap() {
    this.stepToFormPristine.set(0, true);
    this.stepToFormPristine.set(1, true);
    // this.stepToFormPristine.set(3, true);
  }

  onIndexChange(index) {
    this.setValueForStepMap(this.activeIndex, (this.buForm.form.disabled || this.buForm.form.valid));
    this.setValueForPristineMap(this.activeIndex, this.buForm.form.pristine);
    this.activeIndex = index;
    this.setFormValidity();
    this.setFormPristinity();
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
    this.setValueForStepMap(this.activeIndex, (this.buForm.form.disabled || this.buForm.valid));
    this.setFormValidity();
    this.setFormPristinity();
    // return this.customerForm.form.valid;
  }

  isCurrentTabPristine() {
    this.setValueForPristineMap(this.activeIndex, this.buForm.form.pristine);
  }


  isDetailTabValid() {
    if (this.editID) {
      this.businessunitAddService.isDetailTabValid$.next(this.buForm.form.valid);
    } else {
      this.businessunitAddService.isDetailTabValid$.next(this.buForm.form.valid && !this.buForm.form.pristine);
    }
    this.businessunitAddService.isDetailTabValid$.next(this.buForm.form.valid && !this.buForm.form.pristine);
  }

  setValueForStepMap(key: number, value: boolean) {
    this.stepToFormValidity.set(key, value);
  }

  setValueForPristineMap(key: number, value: boolean) {
    this.stepToFormPristine.set(key, value);
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
      this.navigateToBusinessUnitsList();
    }
  }

  onOkClick() {
    this.showConfirmDialog = false;
    this.isFormPristine = true;
    this.onCancel();
  }

  onCancelClick() {
    this.showConfirmDialog = false;
  }


  detectChanges() {
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }


}
