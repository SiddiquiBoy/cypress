import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ChangeDetectorRef } from "@angular/core";
import { Apollo } from 'apollo-angular';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { AppDropdown } from 'src/app/modals/app-dropdown/app-dropdown';
import { Subscription, Subject } from 'rxjs';
import { Tag } from 'src/app/modals/tag/tag';
import { User } from 'src/app/modals/user/user';
import { Utils } from 'src/shared/utilities/utils';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { Country } from 'src/app/modals/country/country';
import { State } from 'src/app/modals/state/state';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { takeUntil } from 'rxjs/operators';
import { ChangeService } from 'src/shared/services/change/change.service';
import { Change } from 'src/app/modals/change/change';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { ChangeModule } from 'src/app/modals/enums/change-module/change-module.enum';
import { Vendor } from 'src/app/modals/vendor/vendor';
import { AddVendorService } from 'src/shared/components/add-vendor/service/add-vendor-service';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { DisplayConstant } from 'src/shared/constants/display-constants/display-constant';
import { PlaceholderConstant } from 'src/shared/constants/placeholder-constants/placeholder-constant';
import { NgForm } from '@angular/forms';
import { ActiveInactiveStatus } from 'src/app/modals/enums/active-inactive-status/active-inactive-status.enum';

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class AddVendorComponent implements OnInit {
  @ViewChild('vendorForm', null) vendorForm: NgForm;

  _vendorId: string;
  @Input() set vendorId(vendorId: string) {
    this._vendorId = vendorId;
    if (vendorId) {
      this.getVendor();
    }
  }

  get vendorId() {
    return this._vendorId;
  }

  vendor: Vendor = new Vendor();
  tags: Tag[];
  countries: Country[] = [];
  states: State[] = [];

  isSpinning = false;
  subscriptions: Subscription[] = [];
  statusDropdown: AppDropdown[] = [];
  activeIndex: number; // the current index of the tab
  stepToFormValidity: Map<number, boolean> = new Map();
  stepToFormPristine: Map<number, boolean> = new Map();
  isFormValid$: Subject<boolean> = new Subject<boolean>();
  isFormValid = false;
  isFormPristine = true;
  isVendorFetched$: Subject<boolean> = new Subject<boolean>();
  isTagsFetched = false;


  showConfirmDialog = false;
  confirmDialogMessage = 'Changes will not be saved. Do you wish to proceed?';

  changes: Change[] = [];
  changedType: string;

  maximumSelections: number;

  // placeholders
  vendorNamePlaceholder: string;
  vendorStatusPlaceholder: string;
  vendorCountryPlaceholder: string;
  vendorStatePlaceholder: string;
  vendorCityPlaceholder: string;
  vendorStreetPlaceholder: string;
  vendorLandmarkPlaceholder: string;
  vendorZipCodePlaceholder: string;
  vendorContactFirstNamePlaceholder: string;
  vendorContactLastNamePlaceholder: string;
  vendorContactEmailPlaceholder: string;
  vendorContactTagsPlaceholder: string;
  vendorContactPhonePlaceholder: string;
  vendorContactFaxPlaceholder: string;
  vendorContactMemoPlaceholder: string;

  constructor(
    private apolloService: Apollo,
    private activateRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private router: Router,
    private changeService: ChangeService,
    private addVendorService: AddVendorService,
    private cd: ChangeDetectorRef,

  ) { }

  ngOnInit() {
    this.setPlaceholders();
    this.setActiveIndex();


    this.statusDropdown = Utils.createDropdownForNewEnum(GeneralStatus, false, false, false, false);
    this.vendor.status = this.statusDropdown.filter(item => item.value === Utils.getEnumKey(GeneralStatus, GeneralStatus.active))[0].value;
    // this.getTags();
    this.setCountryAndState();
    this.getRouteParams();
    this.setChangedType();
    this.setMaximumSelections();
    this.setDropdowns();
    this.setInitialValueForStepMap();
    this.setInitialValueForPristineMap()
    this.changedType = this.getChangedType();

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

  setInitialValueForStepMap() {
    this.stepToFormValidity.set(0, this.vendorId ? true : false);
    this.stepToFormValidity.set(1, this.vendorId ? true : false);
    // this.stepToFormValidity.set(3, false);
  }

  setInitialValueForPristineMap() {
    this.stepToFormPristine.set(0, true);
    this.stepToFormPristine.set(1, true);
    // this.stepToFormPristine.set(3, true);
  }

  onIndexChange(index) {
    this.setValueForStepMap(this.activeIndex, (this.vendorForm.form.disabled || this.vendorForm.form.valid));
    this.setValueForPristineMap(this.activeIndex, this.vendorForm.form.pristine);
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
    this.setValueForStepMap(this.activeIndex, (this.vendorForm.form.disabled || this.vendorForm.form.valid));
    this.setFormValidity();
    this.setFormPristinity();
    // return this.customerForm.form.valid;
  }

  isDetailTabValid() {
    if (this.vendorId) {
      this.addVendorService.isDetailTabValid$.next(this.vendorForm.form.valid);
    } else {
      this.addVendorService.isDetailTabValid$.next(this.vendorForm.form.valid && !this.vendorForm.form.pristine);
    }
    this.addVendorService.isDetailTabValid$.next(this.vendorForm.form.valid && !this.vendorForm.form.pristine);
  }


  setValueForStepMap(key: number, value: boolean) {
    this.stepToFormValidity.set(key, value);
  }

  setValueForPristineMap(key: number, value: boolean) {
    this.stepToFormPristine.set(key, value);
  }

  setChangedType() {
    this.changedType = ChangeModule.VENDOR;
  }

  isCurrentTabPristine() {
    this.setValueForPristineMap(this.activeIndex, this.vendorForm.form.pristine);
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
      this.navigateToVendorsList();
    }
  }

  setPlaceholders() {
    this.vendorNamePlaceholder = PlaceholderConstant.VENDOR_NAME;
    this.vendorStatusPlaceholder = PlaceholderConstant.STATUS;
    this.vendorCountryPlaceholder = PlaceholderConstant.COUNTRY;
    this.vendorStatePlaceholder = PlaceholderConstant.STATE;
    this.vendorCityPlaceholder = PlaceholderConstant.CITY;
    this.vendorStreetPlaceholder = PlaceholderConstant.STREET;
    this.vendorLandmarkPlaceholder = PlaceholderConstant.LANDMARK;
    this.vendorZipCodePlaceholder = PlaceholderConstant.ZIP_CODE;
    this.vendorContactFirstNamePlaceholder = PlaceholderConstant.FIRST_NAME;
    this.vendorContactLastNamePlaceholder = PlaceholderConstant.LAST_NAME;
    this.vendorContactEmailPlaceholder = PlaceholderConstant.EMAIL;
    this.vendorContactTagsPlaceholder = PlaceholderConstant.TAGS;
    this.vendorContactPhonePlaceholder = PlaceholderConstant.PHONE_NUMBER;
    this.vendorContactFaxPlaceholder = PlaceholderConstant.FAX_NUMBER;
    this.vendorContactMemoPlaceholder = PlaceholderConstant.MEMO;
  }


  getChangedType() {
    return ChangeModule.VENDOR;
  }

  detectChanges() {
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  setCountryAndState() {
    this.countries = Utils.getCountries();
    this.setSelectedCountry();
  }

  setSelectedCountry() {
    if (this.vendor && this.vendor.country) {
      const cntry = this.countries.filter(country => country.name === this.vendor.country)[0];
      if (cntry) {
        this.vendor.country = cntry.name;
        this.onCountrySelect();
      }
    } else {
      this.setIfSingleCountryInList();
    }
  }

  setIfSingleCountryInList() {
    if (this.countries && this.countries.length && this.countries.length === 1) {
      this.vendor.country = this.countries[0].name;
      this.onCountrySelect();
    }
  }

  onCountrySelect() {
    this.setStatesDropdown();
  }

  setStatesDropdown() {
    if (this.vendor.country) {
      const cntry = this.countries.filter(country => country.name === this.vendor.country)[0];
      this.states = cntry.states;
    }
    this.setSelectedState();
  }

  setSelectedState() {
    if (this.vendor && this.vendor.country) {
      const cntry = this.countries.filter(country => country.name === this.vendor.country)[0];
      const cntryState = cntry.states.filter(state => state.name === this.vendor.state)[0];
      if (cntryState) {
        this.vendor.state = cntryState.name;
      }
    }
  }

  getRouteParams() {
    this.subscriptions.push(
      this.activateRoute.params.subscribe((params: Params) => {
        if (params.id) {
          this.vendorId = params.id;
          this.getVendor();
        } else {
          if (!this.vendorId) {
            this.getTags();
            this.vendorId = undefined;
            this.changeService.setInitialJob(Utils.cloneDeep(this.vendor));
          }
        }
      })
    );
  }


  getVendor() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.addVendorService.getVendor(this.vendorId).valueChanges.pipe(takeUntil(this.isVendorFetched$)).subscribe((response: any) => {
        if (response) {
          this.vendor = response['data']['getVendor'];
          this.getTags();
          this.changeService.setInitialVendor(Utils.cloneDeep(this.vendor));
          this.isVendorFetched$.next(true);
          this.setAllDropdowns();
          this.isSpinning = false;
          this.setInitialValueForStepMap()
        } else {
          this.isSpinning = false;
        }
      },
        (error: any) => {
          const errorObj = ErrorUtil.getErrorObject(error);
          // this.isJobTimeCorrected = true;
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
  getTags() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.authenticationService.currentUser.subscribe((token: User) => {
        this.subscriptions.push(
          this.addVendorService.getTags(token.organization.id, this.getTagsSortObject(), this.getListPaginationObject(), null, this.getListFilterDataForActiveStatus(), this.getSelectedTagIds()).valueChanges
            .subscribe(
              (response: any) => {
                if (response && response.data && response.data.listTags) {
                  this.tags = response['data']['listTags']['data'];
                  this.isSpinning = false;
                  if (!this.tags.length) {
                    this.messageService.info(AppMessages.CREATE_TAG);
                  }
                  this.isTagsFetched = true;
                  this.isSpinning = false;
                } else {
                  this.isTagsFetched = true;
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

  getSelectedTagIds() {
    let ids: string[] = [];
    if (this.vendor && this.vendor.tags && this.vendor.tags.length > 0) {
      ids = this.vendor.tags.map(tag => tag.id);
    }
    return ids;
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

  onSubmit() {
    this.changes = this.changeService.getChanges();
    if (this.vendorId) {
      this.updateVendor();
    } else {
      this.createVendor();
    }
  }

  createVendor() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.addVendorService.createVendor(this.vendor).subscribe(
        (response) => {
          if (response) {
            this.apolloService.getClient().resetStore().then(val => {
              this.navigateToVendorList();
              this.messageService.success(AppMessages.VENDOR_ADDED);
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

  updateVendor() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.addVendorService.updateVendor(this.vendor, this.changes).subscribe(
        (response) => {
          if (response) {
            this.messageService.success(AppMessages.VENDOR_UPDATED);
            this.navigateToVendorList();
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

  setAllDropdowns() {
    this.setSelectedTags();
    this.setSelectedCountry();
  }

  setSelectedTags() {
    if (this.tags && this.tags.length > 0 && this.vendor.tags && this.vendor.tags.length > 0) {
      const tags = this.tags.filter(tag => this.vendor.tags.findIndex(t => t.id === tag.id) !== -1);
      if (tags && tags.length > 0) {
        this.vendor.tags = tags;
      }
    } else {
      // do nothing
    }
  }

  navigateToVendorList() {
    this.router.navigate(
      [AppUrlConstants.SLASH + AppUrlConstants.VENDORS]
    );
  }


  navigateToVendorsList() {
    this.router.navigate([AppUrlConstants.SLASH + AppUrlConstants.VENDORS]);
  }

  setMaximumSelections() {
    this.maximumSelections = DisplayConstant.MAX_SELECTION;
  }

  onOkClick() {
    this.showConfirmDialog = false;
    this.isFormPristine = true;
    this.onCancel();
  }

  onCancelClick() {
    this.showConfirmDialog = false;
  }
}
