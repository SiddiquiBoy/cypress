import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { Project } from 'src/app/modals/project/project';
import { Customer } from 'src/app/modals/customer/customer';
import { AppDropdown } from 'src/app/modals/app-dropdown/app-dropdown';
import { Utils } from 'src/shared/utilities/utils';
import { IconConstants } from 'src/shared/constants/icon-constants/icon-constants';
import { AddCustomerService } from '../services/add-customer.service';
import { Subscription } from 'rxjs';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';
import { ChangeService } from 'src/shared/services/change/change.service';
import { ActionEvent } from 'src/app/modals/enums/action-event/action-event.enum';
import { Change } from 'src/app/modals/change/change';
import { PlaceholderConstant } from 'src/shared/constants/placeholder-constants/placeholder-constant';

@Component({
  selector: 'app-customer-projects',
  templateUrl: './customer-projects.component.html',
  styleUrls: ['./customer-projects.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  encapsulation: ViewEncapsulation.None
})
export class CustomerProjectsComponent implements OnInit, OnDestroy {

  _customer: Customer = new Customer();
  @Input() set customer(customer) {
    this._customer = customer;
  }

  get customer() {
    return this._customer;
  }

  @Input() changedType: string;

  @Output() eEmitIsProjectTabValid = new EventEmitter<any>();

  subscriptions: Subscription[] = [];
  statusDropdown: AppDropdown[] = [];
  addButtonIcon: string;
  removeButtonIcon: string;
  isProjTabValid = false;

  // placeholders
  customerProjectNamePlaceholder: string;
  customerProjectCodePlaceholder: string;
  customerProjectStatusPlaceholder: string;

  constructor(
    private addCustomerService: AddCustomerService,
    private changeService: ChangeService
  ) { }

  ngOnInit() {
    this.setPlaceholders();
    this.addButtonIcon = IconConstants.PLUS_CIRCLE;
    this.removeButtonIcon = IconConstants.DELETE;
    this.setDropdowns();

    this.subscriptions.push(
      this.addCustomerService.isProjectTabValid$.subscribe((val) => {
        this.isProjTabValid = val;
      })
    );
  }

  setPlaceholders() {
    this.customerProjectNamePlaceholder = PlaceholderConstant.PROJECT_NAME;
    this.customerProjectCodePlaceholder = PlaceholderConstant.PROJECT_CODE;
    this.customerProjectStatusPlaceholder = PlaceholderConstant.STATUS;
  }

  setDropdowns() {
    this.setStatusDropdown();
  }

  setStatusDropdown() {
    this.statusDropdown = [];
    this.statusDropdown = Utils.createDropdownForNewEnum(GeneralStatus, false, false, false, false);
  }

  isProjectTabValid() {
    this.eEmitIsProjectTabValid.emit(true);
  }

  addInitialProject() {
    const project: Project = new Project();
    project.status = this.statusDropdown.filter(item => item.value === Utils.getEnumKey(GeneralStatus, GeneralStatus.active))[0].value;
    this.customer.projects.push(project);
    // this.customer.projects = Utils.cloneDeep(this.customer.projects);
  }

  addProject() {
    this.addInitialProject();
  }

  removeProject(index: number) {
    this.customer.projects.splice(index, 1);
    this.customer.projects = Utils.cloneDeep(this.customer.projects);
    this.updateChangesObject('projects', index, ActionEvent.DELETE);
  }

  updateChangesObject(partialFieldName: string, index: number, action: string) {
    let changes = this.changeService.getChanges();
    if (index !== undefined && index !== null) {
      switch (action) {
        case ActionEvent.DELETE: {
          changes = changes.filter(change => !change.fieldName.includes(partialFieldName + '/' + index));
          changes = this.updateChangesObjectForOtherIndices(partialFieldName, index, changes);
          break;
        }
        default: {
          changes = changes.filter(change => !change.fieldName.includes(partialFieldName + '/' + index));
          changes = this.updateChangesObjectForOtherIndices(partialFieldName, index, changes);
        }
      }
      this.setChangesObject(changes);
    } else {
      // do nothing
    }
  }

  updateChangesObjectForOtherIndices(partialFieldName: string, index: number, changes: Change[]): Change[] {
    const unIndexedChanges = changes.filter(change => !change.fieldName.includes(partialFieldName + '/'));
    const indexedChanges = changes.filter(change => change.fieldName.includes(partialFieldName + '/'));
    indexedChanges.forEach((change) => {
      const indexToChange = Utils.getIndexFromChange(change);
      if (indexToChange !== -1 && indexToChange > index) {
        change.fieldName = change.fieldName.replace(partialFieldName + '/' + indexToChange, partialFieldName + '/' + (indexToChange - 1));
      } else {
        // do nothing
      }
    });
    return [...unIndexedChanges, ...indexedChanges];
  }

  setChangesObject(changes: Change[]): void {
    this.changeService.setChanges(changes);
    this.changeService.setMapFromChanges(this.changedType, changes);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}

