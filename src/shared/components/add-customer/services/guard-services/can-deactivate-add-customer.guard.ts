import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AddCustomerComponent } from '../../add-customer.component';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateAddCustomerGuard implements CanDeactivate<AddCustomerComponent> {

  canDeactivate(component: AddCustomerComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot,
    // tslint:disable-next-line: align
    nextState?: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    // if (!component.isFormPristine) {
    //   // component.showConfirmDialog = true;
    //   return false;
    // } else {
    //   component.router.navigate([nextState.url]);
    //   return true;
    // }
    return true;
  }


}
