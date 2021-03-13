import {Injectable} from '@angular/core';
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
import {JwtService} from './jwt.service';
import {API_ENDPOINTS, APP_ROUTES} from '../utils/constants.utils';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiService implements HttpInterceptor {
  private publicAPIs = [API_ENDPOINTS.AUTH_FORGOT_PASSWORD_SEND_OTP, API_ENDPOINTS.AUTH_FORGOT_PASSWORD_RESET_PASSWORD];

  constructor(private http: HttpClient, private router: Router, private jwtService: JwtService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        map(event => {
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
                  console.log('Navigate to OTP screen');
                  errorMsg = error.error.message;
                }
              }
            } else if (error.status == 403) {
              if (error.error.reason == 'UNAUTHORIZED') {
                this.logout();
                errorMsg = error.error.message;
              }
            } else if (error.status == 500) {
              console.log('Something went wrong. Please try again later');
              errorMsg = 'Something went wrong. Please try again later';
            }
          }
          if (errorMsg.length > 0) {
            // toast(errorMsg)
            return new Observable<HttpEvent<any>>();
          } else {
            return throwError(error);
          }
        })
      );
  }

  get(path: string, params = new HttpParams()) {
    // need to add search: params options here
    return this.http.get(`${API_ENDPOINTS.ADMIN_URL}${path}`, {headers: this.setHeaders(path)})
      .toPromise();
  }

  put(path: string, body: Object = {}) {
    return this.http.put(
      `${API_ENDPOINTS.ADMIN_URL}${path}`,
      JSON.stringify(body),
      {headers: this.setHeaders(path)}
    ).toPromise();
  }

  post(path: string, body: Object = {}) {
    return this.http.post(
      `${API_ENDPOINTS.ADMIN_URL}${path}`,
      JSON.stringify(body),
      {headers: this.setHeaders(path)}
    ).toPromise();
  }

  delete(path) {
    return this.http.delete(
      `${API_ENDPOINTS.ADMIN_URL}${path}`,
      {headers: this.setHeaders(path)}
    ).toPromise();
  }

  private logout() {
    this.jwtService.destroyToken();
    this.router.navigate([APP_ROUTES.AUTH_LOGIN]);
  }

  private setHeaders(path: string): HttpHeaders {
    const headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (!this.publicAPIs.includes(path)) {
      if (this.jwtService.isAuthTokenPresent()) {
        headersConfig['Authorization'] = this.jwtService.getToken();
      } else {
        this.router.navigate([APP_ROUTES.AUTH_LOGIN]);
      }
    }
    return new HttpHeaders(headersConfig);
  }
}
