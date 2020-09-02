import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class LoginCanActivateService implements CanActivate {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  // tslint:disable-next-line: max-line-length
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // const currentUser = this.authenticationService.currentUserValue;
    const isPermissionSet = this.authenticationService.isPermissionSetValue;
    // user is already logged in
    // if (currentUser) {
    if (isPermissionSet) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }

}
