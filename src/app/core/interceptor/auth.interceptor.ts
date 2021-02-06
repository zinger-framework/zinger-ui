import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {JwtService} from '../service/jwt.service';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  private publicAPIs = ['/auth/login'];

  constructor(private jwtService: JwtService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request.headers.set('Content-Type', 'application/json');
    if (!this.publicAPIs.includes(request.url)) {
      request.headers.set('Authorization', this.jwtService.getToken());
    }

    return next.handle(request).map(event => {
      return event;
    }).catch((err: any) => {
      if (err instanceof HttpErrorResponse) {
        this.handleError(err);
        return err;
      }
    });
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
