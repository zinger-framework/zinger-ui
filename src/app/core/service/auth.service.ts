import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {JwtService} from './jwt.service';
import {API_ENDPOINTS} from '../utils/constants.utils';

@Injectable()
export class AuthService {
  constructor(
    private apiService: ApiService,
    private jwtService: JwtService
  ) {
  }

  forgot_password_otp(email) {
    const requestBody = {email: email};
    return this.apiService.post(API_ENDPOINTS.AUTH_FORGOT_PASSWORD_SEND_OTP, requestBody);
  }

  reset_password(otp, pwd, confirm_pwd) {
    const requestBody = {
      auth_token: this.jwtService.getToken(),
      otp: otp,
      password: pwd,
      password_confirmation: confirm_pwd
    };
    return this.apiService.post(API_ENDPOINTS.AUTH_FORGOT_PASSWORD_RESET_PASSWORD, requestBody);
  }
}
