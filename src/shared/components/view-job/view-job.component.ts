import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { JobService } from 'src/app/pages/job/services/job.service';
import { ViewJobService } from './services/view-job.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { Job } from 'src/app/modals/job/job';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';

@Component({
  selector: 'app-view-job',
  templateUrl: './view-job.component.html',
  styleUrls: ['./view-job.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewJobComponent implements OnInit, OnDestroy {

  jobId: string;

  subscriptions: Subscription[] = [];
  job: Job = new Job();

  isSpinning: boolean = false;

  constructor(
    private viewJobService: ViewJobService,
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
            this.jobId = params.id;
            this.getJob();
          } else {
            this.jobId = undefined;
          }
        }
      )
    );
  }

  getJob() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.viewJobService.getJob(this.jobId).valueChanges.subscribe(
        (response: any) => {
          if (response && response.data && response.data.getJob) {
            this.isSpinning = false;
            this.job = response.data.getJob;
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

  refreshData(isRefreshData: boolean) {
    if (isRefreshData) {
      this.getJob();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
