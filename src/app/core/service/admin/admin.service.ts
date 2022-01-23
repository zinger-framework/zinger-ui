import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";

import {ApiService} from '../api.service';
import {ToastrService} from "ngx-toastr";
import {JwtService} from "../jwt.service";
import {API_ENDPOINTS, OPTION_KEY} from "../../utils/constants.utils";


@Injectable({
  providedIn: 'root'
})
export class AdminService extends ApiService {
  private publicAPIs = [API_ENDPOINTS.AUTH_RESET_PASSWORD, API_ENDPOINTS.AUTH_LOGIN, API_ENDPOINTS.AUTH_SIGNUP];
  private loginOtpAPIs = [API_ENDPOINTS.AUTH_VERIFY_OTP, API_ENDPOINTS.AUTH_LOGOUT];

  constructor(http: HttpClient, router: Router, jwtService: JwtService, toastr: ToastrService) {
    super(http, router, jwtService, toastr);
    this.baseUrl = API_ENDPOINTS.ADMIN_URL
  }

  get(path: string, params: HttpParams = new HttpParams(), options: {} = {}): Promise<Object> {
    return super.get(path, params, this.getOptions(path));
  }

  post(path: string, body: Object, options: {} = {}): Promise<Object> {
    return super.post(path, body, this.getOptions(path, body));
  }

  put(path: string, body: Object, options: {} = {}): Promise<Object> {
    return super.put(path, body, this.getOptions(path));
  }

  sendFormData(path: string, body: Object, options: {} = {}): Promise<Object> {
    return super.sendFormData(path, body, this.getOptions(path));
  }

  delete(path, options: {} = {}): Promise<Object> {
    return super.delete(path, this.getOptions(path));
  }

  private getOptions(path: string, params: {} = {}) {
    let options = {}, setAuthToken;
    if (this.loginOtpAPIs.includes(path) || (path == API_ENDPOINTS.AUTH_OTP && params['purpose'] == 'TWO_FA')) {
      if (this.jwtService.getAuthToken() != null) {
        setAuthToken = true;
      }
    } else if (!(this.publicAPIs.includes(path) ||
      (path == API_ENDPOINTS.AUTH_OTP && ['FORGOT_PASSWORD', 'SIGNUP'].includes(params['purpose'])))) {
      if (this.jwtService.isLoggedIn()) {
        setAuthToken = true;
      }
    } else {
      setAuthToken = false;
    }
    options[OPTION_KEY.SET_AUTH_TOKEN] = setAuthToken
    return options;
  }
}
