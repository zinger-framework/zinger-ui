import {Injectable} from '@angular/core';

import {AdminService} from "./admin.service";
import {API_ENDPOINTS} from '../../utils/constants.utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends AdminService {
  sendForgotPasswordOtp(email) {
    const requestBody = {purpose: 'FORGOT_PASSWORD', email: email};
    return this.post(API_ENDPOINTS.AUTH_OTP, requestBody);
  }

  verifyAccount(key, value) {
    const requestBody = {purpose: 'VERIFY_ACCOUNT', [key]: value}
    return this.post(API_ENDPOINTS.AUTH_OTP, requestBody);
  }

  resendLoginOtp() {
    const requestBody = {purpose: 'LOGIN'}
    return this.post(API_ENDPOINTS.AUTH_OTP, requestBody)
  }

  sendSignupOtp(email) {
    const requestBody = {purpose: 'SIGNUP', email: email}
    return this.post(API_ENDPOINTS.AUTH_OTP, requestBody);
  }

  resetPassword(otp, pwd, confirm_pwd) {
    const requestBody = {
      auth_token: this.jwtService.getAuthToken(),
      otp: otp,
      password: pwd,
      password_confirmation: confirm_pwd
    };
    return this.post(API_ENDPOINTS.AUTH_RESET_PASSWORD, requestBody);
  }

  login(email, password) {
    const requestBody = {
      email: email,
      password: password
    };
    return this.post(API_ENDPOINTS.AUTH_LOGIN, requestBody);
  }

  verifyLoginOtp(otp) {
    const requestBody = {otp: otp}
    return this.post(API_ENDPOINTS.AUTH_VERIFY_OTP, requestBody);
  }

  signup(name, otp, password, password_confirmation) {
    const requestBody = {
      auth_token: this.jwtService.getAuthToken(),
      otp: otp,
      password: password,
      password_confirmation: password_confirmation,
      name: name
    }
    return this.post(API_ENDPOINTS.AUTH_SIGNUP, requestBody);
  }

  logout() {
    return this.delete(API_ENDPOINTS.AUTH_LOGOUT).finally(() => {
      super.logout();
    })
  }
}
