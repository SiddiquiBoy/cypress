import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CanActivateResetPasswordGuard implements CanActivate {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const isPermissionSet = this.authenticationService.isPermissionSetValue;
      if (isPermissionSet) {
        this.router.navigate(['/']);
        return false;
      }
      return true;
  }
}
