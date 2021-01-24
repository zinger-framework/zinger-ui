import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {  throwError } from 'rxjs';


@Injectable({
  providedIn: "root",
})
export class AuthService {

  isAuthenticated:boolean = false;

  constructor(private http: HttpClient) {}

  login(email: string, password: string){
    let requestBody = JSON.stringify({"emails":"harsha1@gmail.com","mobile": email,"password": password})
    let loginPromise = this.http.post('http://api.zinger.pw/v2/auth/login/password',requestBody).toPromise()
    return loginPromise
  }

  handleError(errorResponse:any){
    if (errorResponse.error instanceof ErrorEvent) {
      return throwError(errorResponse.error.message)
    } else {
      switch (errorResponse.status) {
        case 400:
          return throwError(errorResponse.error.message)
        case 401:
          return throwError(errorResponse.error.message)
        case 404:
          return throwError(errorResponse.error.message)
        case 409:
          return throwError(errorResponse.error.message)
        case 500:
          return throwError(errorResponse.error.message)
        default:
          return throwError(errorResponse.error.message);
      }
    }
  }
}
