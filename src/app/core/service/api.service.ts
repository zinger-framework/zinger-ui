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
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ApiService implements HttpInterceptor {
  private publicAPIs = [API_ENDPOINTS.AUTH_OTP_FORGOT_PASSWORD, API_ENDPOINTS.AUTH_RESET_PASSWORD,
    API_ENDPOINTS.AUTH_LOGIN];
  private loginOtpAPIs = [API_ENDPOINTS.AUTH_OTP_LOGIN, API_ENDPOINTS.AUTH_VERIFY_OTP, API_ENDPOINTS.AUTH_LOGOUT];

  constructor(private http: HttpClient, private router: Router, private jwtService: JwtService, private toastr: ToastrService) {
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

  get(path: string, params = new HttpParams()) {
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

  logout() {
    this.jwtService.destroyToken();
    this.router.navigate([APP_ROUTES.AUTH_LOGIN]);
  }

  private setHeaders(path: string): HttpHeaders {
    const headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    let setAuthToken;
    if (this.loginOtpAPIs.includes(path)) {
      if (this.jwtService.getAuthToken() != null) {
        setAuthToken = true;
      }
    } else if (!this.publicAPIs.includes(path)) {
      if (this.jwtService.isLoggedIn()) {
        setAuthToken = true;
      }
    } else {
      setAuthToken = false;
    }

    if (setAuthToken == true) {
      headersConfig['Authorization'] = this.jwtService.getAuthToken();
    } else if (setAuthToken != false) {
      this.toastr.error('Please login to continue');
      this.router.navigate([APP_ROUTES.AUTH_LOGIN]);
    }
    return new HttpHeaders(headersConfig);
  }
}
