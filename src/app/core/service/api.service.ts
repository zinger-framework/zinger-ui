import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpParams,
  HttpRequest
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {ToastrService} from 'ngx-toastr';

import {JwtService} from './jwt.service';
import {API_ENDPOINTS, APP_ROUTES, OPTION_KEY} from '../utils/constants.utils';

@Injectable({
  providedIn: 'root',
})
export class ApiService implements HttpInterceptor {
  protected baseUrl = ''

  constructor(protected http: HttpClient, protected router: Router, protected jwtService: JwtService, protected toastr: ToastrService) {
    this.baseUrl = window.location.hostname.split('.')[0] == 'admin' ? API_ENDPOINTS.ADMIN_URL : API_ENDPOINTS.PLATFORM_URL
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        map(event => {
          if (event['body'] != null && event['body']['message'] != null && event['body']['message'] != 'success')
            this.toastr.success(event['body']['message']);
          return event;
        }),
        catchError((error: HttpErrorResponse) => {
          let errorMsg = '';
          if (!(error.error instanceof ErrorEvent)) {
            if (error.status == 0) {
              errorMsg = 'Please check your internet connection';
            } else if (error.status == 401) {
              switch (error.error.reason) {
                case 'UNAUTHORIZED': {
                  this.logout();
                  errorMsg = error.error.message;
                }
                case 'OTP_UNVERIFIED': {
                  this.router.navigate([APP_ROUTES.AUTH_LOGIN]);
                  errorMsg = error.error.message;
                }
              }
            } else if (error.status == 403) {
              if (error.error.reason == 'UNAUTHORIZED') {
                this.logout();
                errorMsg = error.error.message;
              }
            } else if (error.status == 500) {
              errorMsg = 'Something went wrong. Please try again later';
            }
          }
          if (errorMsg.length > 0) {
            this.toastr.error(errorMsg);
            return new Observable<HttpEvent<any>>();
          } else {
            if (error['error']['reason'] != null) {
              this.toastr.error(error['error']['message']);
            }
            return throwError(error);
          }
        })
      );
  }

  get(path: string, params = new HttpParams(), options = {}) {
    return this.http.get(`${this.baseUrl}${path}`, {headers: this.setHeaders(path, options[OPTION_KEY.SET_AUTH_TOKEN], 'application/json')})
      .toPromise();
  }

  put(path: string, body: Object, options = {}) {
    return this.http.put(
      `${this.baseUrl}${path}`,
      JSON.stringify(body),
      {headers: this.setHeaders(path, options[OPTION_KEY.SET_AUTH_TOKEN], 'application/json')}
    ).toPromise();
  }

  post(path: string, body: Object, options = {}) {
    return this.http.post(
      `${this.baseUrl}${path}`,
      JSON.stringify(body),
      {headers: this.setHeaders(path, options[OPTION_KEY.SET_AUTH_TOKEN], 'application/json')}
    ).toPromise();
  }

  sendFormData(path: string, body: Object, options = {}) {
    return this.http.post(
      `${this.baseUrl}${path}`, body,
      {headers: this.setHeaders(path, options[OPTION_KEY.SET_AUTH_TOKEN])}
    ).toPromise();
  }

  delete(path, options = {}) {
    return this.http.delete(`${this.baseUrl}${path}`, {headers: this.setHeaders(path, options[OPTION_KEY.SET_AUTH_TOKEN], 'application/json')})
      .toPromise()
  }

  logout() {
    this.jwtService.destroyToken();
    this.router.navigate([APP_ROUTES.AUTH_LOGIN]);
  }

  protected setHeaders(path: string, setAuthToken: any, contentType = ''): HttpHeaders {
    const headersConfig = {'Accept': 'application/json'}
    if (contentType != '')
      headersConfig['Content-Type'] = contentType

    if (setAuthToken == true) {
      headersConfig['Authorization'] = this.jwtService.getAuthToken();
    } else if (setAuthToken != false) {
      this.toastr.error('Please login to continue');
      this.router.navigate([APP_ROUTES.AUTH_LOGIN]);
    }
    return new HttpHeaders(headersConfig);
  }
}
