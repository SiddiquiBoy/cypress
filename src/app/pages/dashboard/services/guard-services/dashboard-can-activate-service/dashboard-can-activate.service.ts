import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { NotificationService } from 'src/shared/services/notification-service/notification.service';
import { MainUiService } from 'src/app/layout/main/services/ui-service/main-ui.service';
import { RouterConstants } from 'src/shared/constants/router-constants/router-constants';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';

@Injectable({
  providedIn: 'root'
})
export class DashboardCanActivateService implements CanActivate {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private mainUiService: MainUiService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // if (this.authenticationService.checkRole('super-admin') || this.authenticationService.checkRole('admin')) {
    if (this.authenticationService.checkPermission(Permission.MENU_DASHBOARD)) {
      if (this.authenticationService.firstRedirect) {
        this.authenticationService.firstRedirect = false;
      }
      return true;
    } else {
      if (!this.authenticationService.firstRedirect) {
        // this.notificationService.info('Permission Not Allowed', 'User does not have permission to visit the dashboard page');
      }
      const nextRoute: string = this.mainUiService.getNextRoute(RouterConstants.DASHBOARD);
      if (nextRoute) {
        this.router.navigate([nextRoute]);
      } else {
        this.notificationService.info('No Routes To Navigate', 'No Routes are defined for this user');
      }
      return false;
    }
  }

}
