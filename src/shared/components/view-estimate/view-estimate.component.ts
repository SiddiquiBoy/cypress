import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Estimate } from 'src/app/modals/estimate/estimate';
import { ActivatedRoute, Params } from '@angular/router';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { ViewEstimateService } from './services/view-estimate.service';
import { ErrorUtil } from 'src/shared/utilities/error-util';

@Component({
  selector: 'app-view-estimate',
  templateUrl: './view-estimate.component.html',
  styleUrls: ['./view-estimate.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewEstimateComponent implements OnInit, OnDestroy {

  estimateId: string;

  subscriptions: Subscription[] = [];
  estimate: Estimate = new Estimate();

  isSpinning: boolean = false;

  constructor(
    private viewEstimateService: ViewEstimateService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.getRouteParams();
  }

  getRouteParams() {
    this.subscriptions.push(
      this.activatedRoute.params.subscribe(
        (params: Params) => {
          if (params.id) {
            this.estimateId = params.id;
            this.getEstimate();
          } else {
            this.estimateId = undefined;
          }
        }
      )
    );
  }

  getEstimate() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.viewEstimateService.getEstimate(this.estimateId).valueChanges.subscribe(
        (response: any) => {
          if (response && response.data && response.data.getEstimate) {
            this.isSpinning = false;
            this.estimate = response.data.getEstimate;
          } else {
            this.isSpinning = false;
          }
        },
        (error: any) => {
          const errorObj = ErrorUtil.getErrorObject(error);
          this.isSpinning = false;
          this.messageService.error(errorObj.message);
          if (errorObj.logout) {
            this.authenticationService.logout();
          }
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
