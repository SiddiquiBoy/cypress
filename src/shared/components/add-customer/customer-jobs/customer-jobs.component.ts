import { Component, OnInit, ViewEncapsulation, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { Job } from 'src/app/modals/job/job';
import { Customer } from 'src/app/modals/customer/customer';
import { Subscription } from 'rxjs';
import { AddCustomerService } from '../services/add-customer.service';
import { IconConstants } from 'src/shared/constants/icon-constants/icon-constants';

@Component({
  selector: 'app-customer-jobs',
  templateUrl: './customer-jobs.component.html',
  styleUrls: ['./customer-jobs.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  encapsulation: ViewEncapsulation.None
})
export class CustomerJobsComponent implements OnInit, OnDestroy {

  @Input() customer: Customer = new Customer();

  @Output() eEmitIsJobTabValid = new EventEmitter<any>();

  subscriptions: Subscription[] = [];
  addButtonIcon: string;
  removeButtonIcon: string;
  isJobTabValid = false;

  constructor(
    private addCustomerService: AddCustomerService
  ) { }

  ngOnInit() {
    this.addButtonIcon = IconConstants.PLUS_CIRCLE;
    this.removeButtonIcon = IconConstants.DELETE;

    this.subscriptions.push(
      this.addCustomerService.isJobTabValid$.subscribe((val) => {
        this.isJobTabValid = val;
      })
    );
  }

  isJobsTabValid() {
    this.eEmitIsJobTabValid.emit(true);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
