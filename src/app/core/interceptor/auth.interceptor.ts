import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent,HttpHandler,HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(public authService: AuthService){
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("Login Service isAuthenticated: "+this.authService.isAuthenticated)
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin' : '*'
      })
    };
    request = request.clone(httpOptions);
    return next.handle(request);
  }
}
