import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterCanActivateService implements CanActivate {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) { }

  // tslint:disable-next-line: max-line-length
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // const isPermissionSet = this.authenticationService.isPermissionSetValue;
    // if (isPermissionSet) {
    this.router.navigate(['/']);
    return false;
    // }
    // return true;
  }
}
