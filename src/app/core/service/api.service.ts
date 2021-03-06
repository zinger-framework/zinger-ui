import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {JwtService} from './jwt.service'
import {API_ENDPOINTS} from "../utils/constants.utils";

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private publicAPIs = [API_ENDPOINTS.AUTH_FORGOT_PASSWORD_SEND_OTP,API_ENDPOINTS.AUTH_FORGOT_PASSWORD_RESET_PASSWORD];
  constructor(private http: HttpClient,private jwtService: JwtService) {
  }

  private setHeaders(path: string): HttpHeaders {
    const headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (!this.publicAPIs.includes(path)) {
      headersConfig['Authorization'] = this.jwtService.getToken();
      console.log("path included "+path);
    }else{
      console.log("path not included "+path);
    }

    return new HttpHeaders(headersConfig);
  }

  get(path: string, params = new HttpParams()) {
    // need to add search: params options here
    return this.http.get(`${API_ENDPOINTS.ADMIN_URL}${path}`, { headers: this.setHeaders(path) })
      .toPromise();
  }

  put(path: string, body: Object = {}){
    return this.http.put(
      `${API_ENDPOINTS.ADMIN_URL}${path}`,
      JSON.stringify(body),
      { headers: this.setHeaders(path) }
    )
      .toPromise();

  }

  post(path: string, body: Object = {}){
    return this.http.post(
      `${API_ENDPOINTS.ADMIN_URL}${path}`,
      JSON.stringify(body),
      { headers: this.setHeaders(path) }
    )
      .toPromise();
  }

  delete(path){
    return this.http.delete(
      `${API_ENDPOINTS.ADMIN_URL}${path}`,
      { headers: this.setHeaders(path) }
    )
      .toPromise();
  }
}
