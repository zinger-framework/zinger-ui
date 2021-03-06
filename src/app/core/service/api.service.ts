import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {JwtService} from './jwt.service'
import {API_ENDPOINTS} from "../utils/constants.utils";

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient,private jwtService: JwtService) {
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
    return this.http.get(`${API_ENDPOINTS.ADMIN_URL}${path}`, { headers: this.setHeaders() })
      .toPromise();
  }

  put(path: string, body: Object = {}){
    return this.http.put(
      `${API_ENDPOINTS.ADMIN_URL}${path}`,
      JSON.stringify(body),
      { headers: this.setHeaders() }
    )
      .toPromise();

  }

  post(path: string, body: Object = {}){
    return this.http.post(
      `${API_ENDPOINTS.ADMIN_URL}${path}`,
      JSON.stringify(body),
      { headers: this.setHeaders() }
    )
      .toPromise();
  }

  delete(path){
    return this.http.delete(
      `${API_ENDPOINTS.ADMIN_URL}${path}`,
      { headers: this.setHeaders() }
    )
      .toPromise();
  }
}
