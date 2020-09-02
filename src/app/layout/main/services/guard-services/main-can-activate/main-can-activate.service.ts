import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainCanActivateService implements CanActivate {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) { }

  // tslint:disable-next-line: max-line-length
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // const currentUser = this.authenticationService.currentUserValue;
    const isPermissionSet = this.authenticationService.isPermissionSetValue;

    // if (currentUser) {
    if (isPermissionSet) {
      // authorised so return true
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
