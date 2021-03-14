import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {JwtService} from './jwt.service';
import {API_ENDPOINTS} from '../utils/constants.utils';

@Injectable()
export class AuthService {
  constructor(private apiService: ApiService, private jwtService: JwtService) {
  }

  forgot_password_otp(email) {
    const requestBody = {email: email};
    return this.apiService.post(API_ENDPOINTS.AUTH_OTP_FORGOT_PASSWORD, requestBody);
  }

  reset_password(otp, pwd, confirm_pwd) {
    const requestBody = {
      auth_token: this.jwtService.getToken(),
      otp: otp,
      password: pwd,
      password_confirmation: confirm_pwd
    };
    return this.apiService.post(API_ENDPOINTS.AUTH_RESET_PASSWORD, requestBody);
  }

  login(email, password, user_type) {
    const requestBody = {
      email: email,
      password: password,
      user_type: user_type
    };
    return this.apiService.post(API_ENDPOINTS.AUTH_LOGIN, requestBody);
  }

  verifyOTP(otp) {
    const requestBody = {
      otp: otp
    }
    return this.apiService.post(API_ENDPOINTS.AUTH_VERIFY_OTP, requestBody);
  }

  sentLoginOTP() {
    return this.apiService.post(API_ENDPOINTS.AUTH_OTP_LOGIN)
  }

  logout() {
    return this.apiService.delete(API_ENDPOINTS.AUTH_LOGOUT);
  }
}
