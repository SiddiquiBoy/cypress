import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { Company } from 'src/app/modals/company/company';
import { Change } from 'src/app/modals/change/change';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { ChangeService } from 'src/shared/services/change/change.service';
import { AddCompanyService } from './services/add-company.service';
import { User } from 'src/app/modals/user/user';
import { Utils } from 'src/shared/utilities/utils';
import { ChangeModule } from 'src/app/modals/enums/change-module/change-module.enum';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { NgForm } from '@angular/forms';
import { Role } from 'src/app/modals/enums/role/role.enum';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddCompanyComponent implements OnInit, OnDestroy {

  @ViewChild('addCompanyForm', null) addCompanyForm: NgForm;

  subscriptions: Subscription[] = [];
  orgId: string;
  companyId: string;
  company: Company = new Company();
  isSpinning = false;
  isImageLoading = false;
  changes: Change[] = [];
  changedType: string;
  activeIndex: number;
  stepToFormValidity: Map<number, boolean> = new Map();
  stepToFormPristine: Map<number, boolean> = new Map();
  isFormValid$: Subject<boolean> = new Subject<boolean>();
  isFormValid = false;
  isFormPristine = true;
  showConfirmDialog = false;
  confirmDialogMessage: string;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private changeService: ChangeService,
    private addCompanyService: AddCompanyService
  ) { }

  ngOnInit() {
    this.setOrgId();
    this.setConfirmDialogMessage();
    this.setChangedType();
    this.setActiveIndex();
    this.setInitialValueForStepMap();
    this.setInitialValueForPristineMap();

    this.subscriptions.push(
      this.addCompanyService.isCompanyImageUploading$.subscribe((val) => {
        this.isImageLoading = val;
      })
    );

    this.subscriptions.push(
      this.isFormValid$.subscribe((val) => {
        this.isFormValid = val;
      })
    );
  }

  setOrgId() {
    this.subscriptions.push(
      this.authenticationService.currentUser.subscribe((user: User) => {
        if (user && user.organization) {
          this.orgId = user.organization.id;
          this.getRouteParams();
        } else {
          this.orgId = undefined;
        }
      })
    );
  }

  setConfirmDialogMessage() {
    this.confirmDialogMessage = 'Changes will not be saved. Do you wish to proceed?';
  }

  setChangedType() {
    this.changedType = this.getChangedType();
  }

  setActiveIndex(index?: number) {
    if (index !== null && index !== undefined) {
      this.activeIndex = index;
    } else {
      this.activeIndex = 0;
    }
  }

  setInitialValueForStepMap() {
    this.stepToFormValidity.set(0, this.companyId ? true : false);
    this.stepToFormValidity.set(1, this.companyId ? true : false);
  }

  setInitialValueForPristineMap() {
    this.stepToFormPristine.set(0, true);
    this.stepToFormPristine.set(1, true);
  }

  getRouteParams() {
    this.subscriptions.push(
      this.activatedRoute.params.subscribe(
        (params: Params) => {
          if (params.id) {
            this.companyId = params.id;
            this.getCompany();
          } else {
            this.companyId = undefined;
            this.changeService.setInitialCompany(Utils.cloneDeep(this.company));
            // this.getAdmins();
          }
        })
    );
  }

  getCompany() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.addCompanyService.getCompanyWithEmployeesByRoles(this.companyId, [Role.ORGADMIN]).valueChanges.subscribe(
        (response) => {
          if (response) {
            this.company = response['data']['getOrganizationWithEmployeesByRoles'];
            console.log('comp', this.company);
            this.changeService.setInitialCompany(Utils.cloneDeep(this.company));
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

  onIndexChange(index) {
    this.setValueForStepMap(this.activeIndex, (this.addCompanyForm.form.disabled || this.addCompanyForm.form.valid));
    this.setValueForPristineMap(this.activeIndex, this.addCompanyForm.form.pristine);
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

  isCurrentTabValid() {
    this.setValueForStepMap(this.activeIndex, (this.addCompanyForm.form.disabled || this.addCompanyForm.form.valid));
    this.setFormValidity();
    this.setFormPristinity();
  }

  isAdminTabValid() {
    this.addCompanyService.isAdminTabValid$.next(this.addCompanyForm.form.valid && !this.addCompanyForm.form.pristine);
  }

  isCurrentTabPristine() {
    this.setValueForPristineMap(this.activeIndex, this.addCompanyForm.form.pristine);
  }

  onNextClick() {
    this.activeIndex += 1;
    this.onIndexChange(this.activeIndex);
  }

  onPrevClick() {
    this.activeIndex -= 1;
    this.onIndexChange(this.activeIndex);
  }

  onSubmit() {
    this.changes = this.changeService.getChanges();
    if (this.companyId) {
      this.updateCompany();
    } else {
      this.createCompany();
    }
  }

  createCompany() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.addCompanyService.createCompany(this.company).subscribe(
        (response) => {
          if (response) {
            this.messageService.success(AppMessages.COMPANY_ADDED);
            this.isSpinning = false;
            this.navigateToCompanyList();
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

  updateCompany() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.addCompanyService.updateCompany(this.company, this.changes).subscribe(
        (response) => {
          if (response) {
            this.messageService.success(AppMessages.COMPANY_UPDATED);
            this.isSpinning = false;
            this.navigateToCompanyList();
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

  onCancel() {
    if (!this.isFormPristine) {
      this.showConfirmDialog = true;
    } else {
      this.navigateToCompanyList();
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

  navigateToCompanyList() {
    this.router.navigate([AppUrlConstants.SLASH + AppUrlConstants.COMPANIES]);
  }

  getChangedType() {
    return ChangeModule.COMPANY;
  }

  ngOnDestroy() {
    // unsubscribing all the subscriptions
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
