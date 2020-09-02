import { Directive, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';

/**
 * @description to show/hide ui elements based on user permission
 * @author Pulkit Bansal
 * @date 2020-05-26
 * @export
 * @class PermissionDirective
 */
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[permission]'
})
export class PermissionDirective {

  permissions: string[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
  ) {
    this.permissions = this.authenticationService.getPermissions();
  }

  @Input('permission') set myPermission(permission: string) {
    const index = this.permissions.indexOf(permission);
    const revIndex = this.permissions.lastIndexOf(permission);
    // to check that the permission is unique in the list
    if (index !== -1 && index === revIndex) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

}
