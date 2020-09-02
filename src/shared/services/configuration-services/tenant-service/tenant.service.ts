import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

/**
 * @description configuration service for the users
 * @author Pulkit Bansal
 * @date 2020-04-30
 * @export
 * @class TenantService
 */
@Injectable({
  providedIn: 'root'
})
export class TenantService {

  constructor(
    private http: HttpClient,
  ) { }

  /**
   * @description to get the logo of the client
   * @author Pulkit Bansal
   * @date 2020-04-28
   * @returns {Observable<any>}
   * @memberof TenantService
   */
  getTenantLogo(): Observable<any> {
    // return of('https://ng.ant.design/assets/img/logo.svg');
    // return of('assets/images/service_titan_logo.png');
    return of('assets/images/tenant-logo.png');
  }

  getOrganisationLogo(): Observable<any> {
    return of('assets/images/org-logo.png');
  }

}
