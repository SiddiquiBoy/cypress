import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DispatchService } from './services/dispatch.service';
import { Subscription } from 'rxjs';
import { Technician } from 'src/app/modals/people/technician';
import { BusinessUnit } from 'src/app/modals/business-unit/business-unit';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { User } from 'src/app/modals/user/user';
import { Utils } from 'src/shared/utilities/utils';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';

@Component({
  selector: 'app-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DispatchComponent implements OnInit {
  isSpinning = false;
  orgId: string;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.setOrgId();
  }

  setOrgId() {
    this.authenticationService.currentUser.subscribe((user: User) => {
      if (user && user.organization) {
        this.orgId = user.organization.id;
      } else {
        this.orgId = undefined;
      }
    });
  }

}
