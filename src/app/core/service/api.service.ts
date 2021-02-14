import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {JwtService} from './jwt.service'
import {environment } from "../utils/constants.utils";

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient,private jwtService: JwtService) {
  }

  login(email: string, password: string) {
    const requestBody = JSON.stringify({email: 'harsha1@gmail.com', mobiles: email});
    return this.http.post('http://api.zinger.pw/v2/auth/login/password', requestBody).toPromise();
  }

  forgot_password(email){
    const requestBody = JSON.stringify({email: email});
    return this.http.post('http://admin.zinger.pw/auth/forgot_password/send_otp', requestBody).toPromise();
  }

  private setHeaders(): HttpHeaders {
    const headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (this.jwtService.getToken()) {
      headersConfig['Authorization'] = `Token ${this.jwtService.getToken()}`;
    }
    return new HttpHeaders(headersConfig);
  }

  get(path: string, params = new HttpParams()) {
    // need to add search: params options here
    return this.http.get(`${environment.api_url}${path}`, { headers: this.setHeaders() })
      .toPromise();
  }

  put(path: string, body: Object = {}){
    return this.http.put(
      `${environment.api_url}${path}`,
      JSON.stringify(body),
      { headers: this.setHeaders() }
    )
      .toPromise();

  }

  post(path: string, body: Object = {}){
    return this.http.post(
      `${environment.admin_url}${path}`,
      JSON.stringify(body),
      { headers: this.setHeaders() }
    )
      .toPromise();
  }

  delete(path){
    return this.http.delete(
      `${environment.api_url}${path}`,
      { headers: this.setHeaders() }
    )
      .toPromise();
  }
}
