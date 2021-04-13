import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {API_ENDPOINTS} from '../utils/constants.utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiService {

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

  login(email, password, user_type) {
    const requestBody = {
      email: email,
      password: password,
      user_type: user_type
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
    return this.post(API_ENDPOINTS.AUTH_OTP_LOGIN)
  }

  sendSignupOtp(email) {
    const requestBody = {email: email}
    return this.post(API_ENDPOINTS.AUTH_OTP_SIGNUP, requestBody);
  }

  signup(name, otp, pwd, pwd_confirmation) {
    const requestBody = {
      auth_token: this.jwtService.getAuthToken(),
      otp: otp,
      password: pwd,
      password_confirmation: pwd_confirmation,
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
