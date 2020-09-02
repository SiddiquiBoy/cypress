import { Injectable, InjectionToken, Injector } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams, HttpHeaders } from '@angular/common/http';
import { IQueryParams } from 'src/app/modals/query-params/Iqueryparams';
import { Observable, Observer } from 'rxjs';

// this is the base url for the environment
export const BASE_URL = new InjectionToken<string>('BASE_URL');

/**
 * @description this service will be used to wrap all api calls
 * @author Pulkit Bansal
 * @date 2020-04-30
 * @export
 * @class BaseService
 * @template TGet
 * @template TPost
 * @template TFilter
 */
@Injectable({
  providedIn: 'root'
})
export class BaseService<TGet, TPost, TFilter> {

  public urlPath: string;
  public baseUrl = '';

  constructor(
    protected httpClient: HttpClient,
    public injector: Injector
  ) {
    this.urlPath = this.getUrl();
  }


  getUrl(): string {
    this.baseUrl = this.injector.get(BASE_URL);
    return this.baseUrl + '/' + this.urlPath;
  }

  get(queryParams?: IQueryParams, subpath?: string, responseType?: string): Observable<any> {
    if (navigator.onLine) {
      // tslint:disable-next-line: deprecation
      return Observable.create((observer: Observer<TGet>) => {
        this._get(queryParams, subpath, responseType).subscribe((response: any) => {
          observer.next(response);
        }, (err) => {
          observer.error(err);
        }, () => {
          observer.complete();
        });
      });
    }
  }

  _get(queryParams?: IQueryParams, subpath?: string, responseType?: string): Observable<Response | HttpEvent<Response>> {
    subpath = subpath || '';
    const url = (subpath === '') ? this.getUrl() + subpath : this.getUrl() + '/' + subpath;
    // const url = this.getUrl() + subpath;
    // const options = this.getHttpOptions(queryParams);
    const options = this.getHttpOptions(queryParams, null, responseType);
    return this.httpClient.get<Response>(url, options);
  }

  getById(id: any, queryParams?: IQueryParams, subpath?: string, responseType?: string): Observable<TGet> {
    if (navigator.onLine) {
      // tslint:disable-next-line: deprecation
      return Observable.create((observer: Observer<TGet>) => {
        this._getById(id, queryParams, subpath, responseType).subscribe((response: any) => {
          observer.next(response);
        }, (err) => {
          observer.error(err);
        }, () => {
          observer.complete();
        });
      });
    }

  }

  _getById(id: string, queryParams?: IQueryParams, subpath?: string, responseType?: string) {
    subpath = subpath || '';
    const url = (subpath === '') ? this.getUrl() + subpath + '/' + id : this.getUrl() + '/' + subpath + '/' + id;
    // const url = this.getUrl() + subpath + '/' + id;
    const options = this.getHttpOptions(queryParams);
    return this.httpClient.get<Response>(url, options);
  }

  create(item: any, queryParams?: IQueryParams, subPath?: string, headers?: any, responseType?: any): Observable<any> {
    if (navigator.onLine) {
      // tslint:disable-next-line: deprecation
      return Observable.create((observer: Observer<any>) => {
        // tslint:disable-next-line: max-line-length
        this._post(item, queryParams, subPath, headers ? headers : null, responseType ? responseType : 'json').subscribe((response: any) => {
          observer.next(response);
        }, (err) => {
          observer.error(err);
        }, () => {
          observer.complete();
        });
      });
    }
  }

  _post(postModel: TPost, queryParams?: IQueryParams, subpath?: string, headers?: any, responseType?: string) {
    subpath = subpath || '';
    // const url = this.getUrl() + subpath;
    const url = (subpath === '') ? this.getUrl() + subpath : this.getUrl() + '/' + subpath;
    const options = this.getHttpOptions(queryParams, headers ? headers : null, responseType ? responseType : 'json');
    return this.httpClient.post(url, postModel, options);
  }

  patch(item: any, queryParams?: IQueryParams, subPath?: string) {
    if (navigator.onLine) {
      // tslint:disable-next-line: deprecation
      return Observable.create((observer: Observer<any>) => {
        this._patch(item, queryParams, subPath).subscribe((response: any) => {
          observer.next(response);
          // this.createMessage(response, 'update');
        }, (err) => {
          observer.error(err);
        }, () => {
          observer.complete();
        });
      });
    }
  }

  _patch(postModel: TPost, queryParams?: IQueryParams, subpath?: string) {
    /* subpath = subpath || '';
    const url = this.getUrl() + subpath; */
    const url = (subpath && subpath.length) > 0 ? this.getUrl() + '/' + subpath : this.getUrl();
    const options = this.getHttpOptions(queryParams);
    return this.httpClient.patch(url, postModel, options);
  }

  delete(id, item: any, queryParams?: IQueryParams, subPath?: string, headers?: any, responseType?: any): Observable<any> {
    if (navigator.onLine) {
      // tslint:disable-next-line: deprecation
      return Observable.create((observer: Observer<any>) => {
        this._delete(id, item, queryParams, subPath).subscribe((response: any) => {
          observer.next(response);
        }, (err) => {
          observer.error(err);
        }, () => {
          observer.complete();
        });
      });
    }
  }

  _delete(id, postModel?: TPost, queryParams?: IQueryParams, subpath?: string) {
    const url = subpath.length > 0 ? this.getUrl() + '/' + subpath : this.getUrl();
    const options = this.getHttpOptions(queryParams);
    return this.httpClient.request('DELETE', url, { body: postModel, responseType: 'json' });
  }

  // tslint:disable-next-line: ban-types
  buildHttpParams(paramObject: Object): HttpParams {
    paramObject = this.buildQueryParams(paramObject);
    let params: HttpParams = new HttpParams();
    for (const key in paramObject) {

      if (paramObject.hasOwnProperty(key) && paramObject[key]) {
        params = params.set(key, paramObject[key].toString());
      }
    }
    return params;
  }

  buildQueryParams(queryParams) {
    return queryParams = Object.assign({}, this.getDefaultQueryParams(), queryParams);
  }

  getDefaultQueryParams() {
    return {};
  }

  buildHeaders(header) {
    return header = Object.assign({}, this.getDefaultHeaders(), header);
  }

  getHttpOptions(queryParams, header?: any, responseType?: any) {
    return {
      params: this.buildHttpParams(queryParams),
      headers: this.buildHttpHeader(header),
      responseType: responseType ? responseType : 'json'
    };
  }

  // tslint:disable-next-line: ban-types
  buildHttpHeader(headerObject: Object): HttpHeaders {
    // headerObject = this.buildHeaders(headerObject);
    let headers: HttpHeaders = new HttpHeaders();
    for (const key in headerObject) {

      if (headerObject.hasOwnProperty(key) && headerObject[key]) {
        headers = headers.set(key, headerObject[key].toString());
      }
    }
    return headers;
  }

  getDefaultHeaders() {
    return new HttpHeaders();
  }

}
