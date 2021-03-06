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
import {APP_ROUTES, OPTION_KEY} from '../utils/constants.utils';

@Injectable({
  providedIn: 'root',
})
export class ApiService implements HttpInterceptor {
  protected baseUrl = ''

  constructor(protected http: HttpClient, protected router: Router, protected jwtService: JwtService, protected toastr: ToastrService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        map(event => {
          if (event['body'] && event['body']['message'] != 'success')
            this.toastr.success(event['body']['message']);
          return event;
        }),
        catchError((error: HttpErrorResponse) => {
          let errorMsg = '';
          if (!(error.error instanceof ErrorEvent)) {
            switch (error.status) {
              case 0:
                errorMsg = 'Please check your internet connection';
                break;
              case 401:
                switch (error.error.reason) {
                  case 'UNAUTHORIZED':
                    this.logout();
                    errorMsg = error.error.message;
                    break;
                  case 'OTP_UNVERIFIED':
                    this.router.navigate([APP_ROUTES.AUTH_LOGIN]);
                    errorMsg = error.error.message;
                    break;
                }
                break;
              case 403:
                if (error.error.reason == 'UNAUTHORIZED') {
                  this.logout();
                  errorMsg = error.error.message;
                }
                break;
              case 500:
                errorMsg = 'Something went wrong. Please try again later';
                break;
            }
          }
          if (errorMsg.length > 0) {
            this.toastr.error(errorMsg);
            return new Observable<HttpEvent<any>>();
          } else {
            this.toastr.error(error.error.message);
            return throwError(error);
          }
        })
      );
  }

  get(path: string, params = new HttpParams(), options = {}) {
    return this.http.get(`${this.baseUrl}${path}`, {headers: this.setHeaders({...options, ...{[OPTION_KEY.CONTENT_TYPE]: 'application/json'}})})
      .toPromise();
  }

  put(path: string, body: Object, options = {}) {
    return this.http.put(
      `${this.baseUrl}${path}`,
      JSON.stringify(body),
      {headers: this.setHeaders({...options, ...{[OPTION_KEY.CONTENT_TYPE]: 'application/json'}})}
    ).toPromise();
  }

  post(path: string, body: Object, options = {}) {
    return this.http.post(
      `${this.baseUrl}${path}`,
      JSON.stringify(body),
      {headers: this.setHeaders({...options, ...{[OPTION_KEY.CONTENT_TYPE]: 'application/json'}})}
    ).toPromise();
  }

  sendFormData(path: string, body: Object, options = {}) {
    return this.http.post(
      `${this.baseUrl}${path}`, body,
      {headers: this.setHeaders({...options, ...{[OPTION_KEY.CONTENT_TYPE]: ''}})}
    ).toPromise();
  }

  delete(path, options = {}) {
    return this.http.delete(`${this.baseUrl}${path}`, {headers: this.setHeaders({...options, ...{[OPTION_KEY.CONTENT_TYPE]: 'application/json'}})})
      .toPromise()
  }

  logout() {
    this.jwtService.destroyToken();
    this.router.navigate([APP_ROUTES.AUTH_LOGIN]);
  }

  protected setHeaders(options): HttpHeaders {
    const headersConfig = {'Accept': 'application/json'}
    if (options[OPTION_KEY.CONTENT_TYPE] != '')
      headersConfig['Content-Type'] = options[OPTION_KEY.CONTENT_TYPE]

    if (options[OPTION_KEY.SET_AUTH_TOKEN] == true)
      headersConfig['Authorization'] = this.jwtService.getAuthToken();
    else if (options[OPTION_KEY.SET_AUTH_TOKEN] != false) {
      this.toastr.error('Please login to continue');
      this.router.navigate([APP_ROUTES.AUTH_LOGIN]);
    }
    return new HttpHeaders(headersConfig);
  }
}
