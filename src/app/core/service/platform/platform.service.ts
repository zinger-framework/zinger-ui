import {Injectable} from '@angular/core';
import {HttpHeaders, HttpParams} from "@angular/common/http";

import {ApiService} from '../api.service';
import {API_ENDPOINTS, OPTION_KEY} from "../../utils/constants.utils";

@Injectable({
  providedIn: 'root'
})
export class PlatformService extends ApiService {
  private publicAPIs = [API_ENDPOINTS.AUTH_OTP_FORGOT_PASSWORD, API_ENDPOINTS.AUTH_RESET_PASSWORD, API_ENDPOINTS.AUTH_LOGIN, API_ENDPOINTS.AUTH_OTP_SIGNUP, API_ENDPOINTS.AUTH_SIGNUP];
  private loginOtpAPIs = [API_ENDPOINTS.AUTH_OTP_LOGIN, API_ENDPOINTS.AUTH_VERIFY_OTP, API_ENDPOINTS.AUTH_LOGOUT];

  get(path: string, params: HttpParams = new HttpParams(), options: {} = {}): Promise<Object> {
    options[OPTION_KEY.SET_AUTH_TOKEN] = this.canSetAuthToken(path)
    return super.get(path, params, options);
  }

  post(path: string, body: Object, options: {} = {}): Promise<Object> {
    options[OPTION_KEY.SET_AUTH_TOKEN] = this.canSetAuthToken(path)
    return super.post(path, body, options);
  }

  put(path: string, body: Object, options: {} = {}): Promise<Object> {
    options[OPTION_KEY.SET_AUTH_TOKEN] = this.canSetAuthToken(path)
    return super.put(path, body, options);
  }

  sendFormData(path: string, body: Object, options: {} = {}): Promise<Object> {
    options[OPTION_KEY.SET_AUTH_TOKEN] = this.canSetAuthToken(path)
    return super.sendFormData(path, body, options);
  }

  delete(path, options: {} = {}): Promise<Object> {
    options[OPTION_KEY.SET_AUTH_TOKEN] = this.canSetAuthToken(path)
    return super.delete(path, options);
  }

  private canSetAuthToken(path: string): HttpHeaders {
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
    return setAuthToken;
  }
}
