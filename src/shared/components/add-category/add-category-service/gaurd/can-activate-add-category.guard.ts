import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { NotificationService } from 'src/shared/services/notification-service/notification.service';
import { MainUiService } from 'src/app/layout/main/services/ui-service/main-ui.service';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { RouterConstants } from 'src/shared/constants/router-constants/router-constants';

@Injectable({
  providedIn: 'root'
})
export class CanActivateAddCategoryGuard implements CanActivate {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private mainUiService: MainUiService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authenticationService.checkPermission(Permission.ADD_CATEGORY)) {
      if (this.authenticationService.firstRedirect) {
        this.authenticationService.firstRedirect = false;
      }
      return true;
    } else {
      if (!this.authenticationService.firstRedirect) {
        // this.notificationService.info('Permission Not Allowed', 'User does not have permission to visit the settings page');
      }
      const nextRoute: string = this.mainUiService.getNextRoute(RouterConstants.PRICE_BOOK_CATEGORIES);
      if (nextRoute) {
        this.router.navigate([nextRoute]);
      } else {
        this.notificationService.info('No Routes To Navigate', 'No Routes are defined for this user');
      }
      return false;
    }
  }

}
