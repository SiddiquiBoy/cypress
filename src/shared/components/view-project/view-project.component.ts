import { Component, OnInit, OnDestroy, ViewEncapsulation } from "@angular/core";
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { ViewProjectService } from './services/view-project.service';
import { Project } from 'src/app/modals/project/project';
import { Utils } from 'src/shared/utilities/utils';
import { ErrorUtil } from 'src/shared/utilities/error-util';


@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ViewProjectComponent implements OnInit, OnDestroy {

  isSpinning: boolean;
  subscriptions: Subscription[] = [];
  project: Project = new Project();
  projectId: string;

  constructor(
    private viewProjectService: ViewProjectService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.getRouteParams()
  }

  getRouteParams() {
    this.subscriptions.push(
      this.activatedRoute.params.subscribe(
        (params: Params) => {
          if (params.viewid) {
            this.projectId = params.viewid;
            this.getProject();
          } else {
            this.projectId = undefined;
          }
        })
    );
  }

  getProject() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.viewProjectService.getProject(this.projectId).valueChanges.subscribe(
        (response) => {
          if (response) {
            this.project = response['data']['getProject'];
            this.project = Utils.cloneDeep(this.project);
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

  refreshData(isRefreshData: boolean) {
    if (isRefreshData) {
      this.getProject();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
