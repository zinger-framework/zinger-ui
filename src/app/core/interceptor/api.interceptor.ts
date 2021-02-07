import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {JwtService} from '../service/jwt.service';
import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  private publicAPIs = ['/auth/login'];

  constructor(private jwtService: JwtService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("interceptor called")
    request.headers.set('Content-Type', 'application/json');
    if (!this.publicAPIs.includes(request.url)) {
      request.headers.set('Authorization', this.jwtService.getToken());
    }

    return next.handle(request)
      .pipe(
        map(event => {
          return event;
        }),
        catchError((error: HttpErrorResponse) => {
          let errorMsg = '';
          if (error.error instanceof ErrorEvent) {
            console.log('this is client side error');
            errorMsg = `Error: ${error.error.message}`;
          }
          else {
            console.log('this is server side error');
            errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
          }
          console.log(errorMsg);
          return throwError(errorMsg);
        })
      )
  }

  public handleError(errorResponse: any) {
    if (errorResponse.error instanceof ErrorEvent) {
      return throwError(errorResponse.error.message);
    } else {
      switch (errorResponse.status) {
        case 400:
          return throwError(errorResponse.error.message);
        case 401:
          return throwError(errorResponse.error.message);
        case 404:
          return throwError(errorResponse.error.message);
        case 409:
          return throwError(errorResponse.error.message);
        case 500:
          return throwError(errorResponse.error.message);
        default:
          return throwError(errorResponse.error.message);
      }
    }
  }
}
