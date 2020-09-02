import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { BehaviorSubject, Observable } from 'rxjs';
import { Role } from 'src/app/modals/enums/role/role.enum';
import { User } from 'src/app/modals/user/user';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { Utils } from 'src/shared/utilities/utils';
import { MessageService } from '../message-service/message.service';

/**
 * @description auth service for the app
 * @author Pulkit Bansal
 * @date 2020-04-30
 * @export
 * @class AuthenticationService
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<any>;
  private permissionSet$: BehaviorSubject<boolean>;
  isPermissionSet$: Observable<boolean>;
  private permissions: string[] = [];
  private isError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isErrorThrown$: Observable<boolean>;
  // private role: string;
  public currentUser: Observable<any>;
  // to show the info notification when navigating to unauthorized route
  public firstRedirect = false;
  public isRememberMe: boolean;
  public organizationUpdated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public isRelogin = false;

  jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(
    private http: HttpClient,
    private router: Router,
    private apolloService: Apollo,
    private messageService: MessageService
  ) {
    // To check & retrieve data from web storage in case user refreshes or
    // reopens the browser/tab.
    if (Utils.getItemFromSessionStorage('user')) {
      this.isRememberMe = false;
    } else {
      this.isRememberMe = true;
    }
    let userFromWebStorage;
    let permissionsFromWebStorage;
    if (!this.isRememberMe) {
      userFromWebStorage = Utils.getItemFromSessionStorage('user');
      permissionsFromWebStorage = Utils.getItemFromSessionStorage('permissionGrants');
    } else {
      userFromWebStorage = Utils.getItemFromLocalStorage('user');
      permissionsFromWebStorage = Utils.getItemFromLocalStorage('permissionGrants');
    }
    this.currentUserSubject = new BehaviorSubject<any>(userFromWebStorage);
    this.currentUser = this.currentUserSubject.asObservable();
    this.permissionSet$ = new BehaviorSubject<boolean>(permissionsFromWebStorage);
    this.isPermissionSet$ = this.permissionSet$.asObservable();
    this.isErrorThrown$ = this.isError$.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get isPermissionSetValue(): boolean {
    return this.permissionSet$.value;
  }

  /**
   * @description logging in a user
   * this is logging in user who is in the array of users.json
   * @author Pulkit Bansal
   * @date 2020-04-28
   * @param {string} username
   * @param {string} password
   * @memberof AuthenticationService
   */
  login(username?: string, password?: string, rememberMe?: boolean, grantType?: string, refreshToken?: string) {
    this.isRememberMe = rememberMe;
    this.apolloService.mutate<any>({
      mutation: gql`
        mutation Login($login: LoginInput!) {
          login(login: $login) {
            id
            refreshToken
            accessToken
            permissionGrants
            role
          }
        }
        `,
      fetchPolicy: 'no-cache',
      variables: {
        login: {
          email: (username !== undefined && username !== null) ? username : null,
          password: (password !== undefined && password !== null) ? password : null,
          grantType: (grantType !== undefined && grantType !== null) ? grantType : 'password',
          refreshToken: (refreshToken !== undefined && refreshToken !== null) ? refreshToken : null
        }
      }
    }).subscribe(
      (response) => {
        if (response) {
          if (!this.isRememberMe) {
            Utils.setItemInSessionStorage('accessToken', response['data']['login']['accessToken']);
            if (!refreshToken) {
              Utils.setItemInSessionStorage('refreshToken', response['data']['login']['refreshToken']);
            } else {
              // do nothing
            }
            Utils.setItemInSessionStorage('permissionGrants', response['data']['login']['permissionGrants']);
          } else {
            Utils.setItemInLocalStorage('accessToken', response['data']['login']['accessToken']);
            if (!refreshToken) {
              Utils.setItemInLocalStorage('refreshToken', response['data']['login']['refreshToken']);
            } else {
              // do nothing
            }
            Utils.setItemInLocalStorage('permissionGrants', response['data']['login']['permissionGrants']);
          }
          this.getUser();
        }
      },
      (error) => {
        this.isError$.next(true);
        const errorObj = ErrorUtil.getErrorObject(error);
        this.messageService.error(errorObj.message);
        if (errorObj.logout) {
          this.logout();
        }
      }
    );
  }

  // fetchUser(): any {
  //   return this.apolloService.watchQuery({
  //     query: gql`
  //       {
  //         me {
  //           id
  //           username
  //           firstName
  //           lastName
  //           officePhone
  //           roles
  //           homePhone
  //           email
  //           organization {
  //             id
  //             email
  //             name
  //             contact
  //             address
  //             city
  //             state
  //             pincode
  //             country
  //             imageUrl
  //           }
  //         }
  //       }
  //     `,
  //     fetchPolicy: 'no-cache'
  //   });
  // }

  fetchUser(): any {
    return this.apolloService.watchQuery({
      query: gql`
        {
          me {
            id
            username
            firstName
            lastName
            officePhone
            roles
            homePhone
            email
            organization {
              id
              email
              name
              contact
              addresses {
                id
                street
                state
                city
                country
                postalCode
              }
              imageUrl
            }
          }
        }
      `,
      fetchPolicy: 'no-cache'
    });
  }

  setUserInBrowserStorage(user: User) {
    if (!this.isRememberMe) {
      Utils.setItemInSessionStorage('user', user);
    } else {
      Utils.setItemInLocalStorage('user', user);
    }
  }

  getUser() {
    this.fetchUser().valueChanges
      .subscribe(
        (response: any) => {
          const user = response.data.me;
          this.setUserInBrowserStorage(user);
          this.currentUserSubject.next(user);
          this.setPermissions();
        },
        (error) => {
          this.isError$.next(true);
          const errorObj = ErrorUtil.getErrorObject(error);
          if (errorObj.message !== ErrorUtil.AUTH_TOKEN_EXPIRED) {
            this.messageService.error(errorObj.message);
          } else {
            // do nothing
          }
          if (errorObj.logout) {
            this.logout();
          }
        }
      );
  }

  /**
   * @description to set the permission for the user
   * @author Pulkit Bansal
   * @date 2020-05-26
   * @param {string[]} permissions
   * @private
   * @memberof AuthenticationService
   */
  private setPermissions() {
    let permissionGrantToken;
    if (!this.isRememberMe) {
      permissionGrantToken = Utils.getItemFromSessionStorage('permissionGrants');
    } else {
      permissionGrantToken = Utils.getItemFromLocalStorage('permissionGrants');
    }
    if (this.jwtHelper.decodeToken(permissionGrantToken)) {
      this.permissions = this.jwtHelper.decodeToken(permissionGrantToken)['permissions'];
    } else {
      this.permissions = [];
    }
    this.permissionSet$.next(true);
    if (this.isRelogin) {
      this.reRoute();
    }
  }

  reRoute() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([this.router.url]);
    setTimeout(() => {
      this.router.routeReuseStrategy.shouldReuseRoute = (future, curr) => future.routeConfig === curr.routeConfig;
      this.router.onSameUrlNavigation = 'ignore';
    }, 100);
  }

  /**
   * @description to get the list of permissions
   * @author Pulkit Bansal
   * @date 2020-05-26
   * @returns
   * @memberof AuthenticationService
   */
  getPermissions() {
    let token;
    if (!this.isRememberMe) {
      token = Utils.getItemFromSessionStorage('permissionGrants');
    } else {
      token = Utils.getItemFromLocalStorage('permissionGrants');
    }
    if (this.jwtHelper.decodeToken(token)) {
      this.permissions = this.jwtHelper.decodeToken(token)['permissions'];
    } else {
      this.permissions = [];
    }
    return this.permissions;
  }

  // getRole() {
  //   return this.role;
  // }

  /**
   * @description getting users from json
   * this will be changed and all data will be fetched from apis
   * @author Pulkit Bansal
   * @date 2020-04-28
   * @returns {Observable<User[]>}
   * @memberof AuthenticationService
   */
  getUsersFromJson(): Observable<User[]> {
    return this.http.get<User[]>('assets/jsons/users.json');
  }

  /**
   * @description to check the role to verify permission
   * this should be chaged to permission instead of role
   * @author Pulkit Bansal
   * @date 2020-05-06
   * @param {string} role
   * @returns {boolean}
   * @memberof AuthenticationService
   */
  checkRole(role: Role): boolean {
    if (this.currentUserValue && this.currentUserValue.roles && this.currentUserValue.roles.indexOf(role) !== -1) {
      return true;
    } else {
      return false;
    }
  }

  checkPermission(permission: string): boolean {
    let token;
    if (!this.isRememberMe) {
      token = Utils.getItemFromSessionStorage('permissionGrants');
    } else {
      token = Utils.getItemFromLocalStorage('permissionGrants');
    }
    if (this.jwtHelper.decodeToken(token)) {
      this.permissions = this.jwtHelper.decodeToken(token)['permissions'];
    } else {
      this.permissions = [];
    }
    const index = this.permissions.indexOf(permission);
    const revIndex = this.permissions.lastIndexOf(permission);
    // to check that the permission is unique in the list
    if (index !== -1 && index === revIndex) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @description to logout the user and remove local storage
   * @author Pulkit Bansal
   * @date 2020-04-28
   * @memberof AuthenticationService
   */
  logout(logout = false) {
    if (logout) {
      this.isRelogin = false;
      Utils.removeItemFromLocalStorage('user');
      Utils.removeItemFromLocalStorage('accessToken');
      Utils.removeItemFromLocalStorage('refreshToken');
      Utils.removeItemFromLocalStorage('permissionGrants');

      Utils.removeItemFromSessionStorage('user');
      Utils.removeItemFromSessionStorage('accessToken');
      Utils.removeItemFromSessionStorage('refreshToken');
      Utils.removeItemFromSessionStorage('permissionGrants');

      ErrorUtil.resetRefreshToken();

      this.currentUserSubject.next(undefined);
      this.permissionSet$.next(undefined);
      this.router.navigate(['/login']);
    } else {
      if (ErrorUtil.isRefreshTokenExpired()) {
        this.logout(true);
      } else {
        this.login(null, null, this.isRememberMe, 'refreshToken', Utils.getItemFromLocalStorage('refreshToken'));
        // window.location.reload();
        // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        // console.log('before', this.router.onSameUrlNavigation);
        // this.router.onSameUrlNavigation = 'reload';
        // this.router.navigate([this.router.url]);
        // setTimeout(() => {
        //   // this.router.routeReuseStrategy.shouldReuseRoute = (future, curr) => future.routeConfig === curr.routeConfig;
        //   this.router.onSameUrlNavigation = 'ignore';
        // });
        this.isRelogin = true;
      }
    }
  }

}

