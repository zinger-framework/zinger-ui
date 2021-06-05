import {Injectable} from '@angular/core';

import {AdminService} from "./admin.service";
import {API_ENDPOINTS} from '../../utils/constants.utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends AdminService {
  forgot_password_otp(email) {
    const requestBody = {email: email};
    return this.post(API_ENDPOINTS.AUTH_OTP_FORGOT_PASSWORD, requestBody);
  }

  reset_password(otp, pwd, confirm_pwd) {
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

  verifyOTP(otp) {
    const requestBody = {otp: otp}
    return this.post(API_ENDPOINTS.AUTH_VERIFY_OTP, requestBody);
  }

  verifyMobile(mobile) {
    const requestBody = {mobile: mobile}
    return this.post(API_ENDPOINTS.AUTH_OTP_VERIFY_MOBILE, requestBody);
  }

  resendOtp() {
    return this.post(API_ENDPOINTS.AUTH_OTP_LOGIN, {})
  }

  sendSignupOtp(email) {
    const requestBody = {email: email}
    return this.post(API_ENDPOINTS.AUTH_OTP_SIGNUP, requestBody);
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
