import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

/**
 * @description to custom preload the lazy modules
 * @author Pulkit Bansal
 * @date 2020-05-05
 * @export
 * @class AppCustomPreloader
 * @implements {PreloadingStrategy}
 */
export class AppCustomPreloader implements PreloadingStrategy {
  // tslint:disable-next-line: ban-types
  preload(route: Route, load: Function): Observable<any> {
    return route.data && route.data.preload ? load() : of(null);
  }
}
