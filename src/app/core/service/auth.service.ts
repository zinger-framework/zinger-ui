import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {JwtService} from "./jwt.service";

@Injectable()
export class AuthService {
  constructor (
    private apiService: ApiService,
    private jwtService: JwtService
  ) {}

  forgot_password_otp(email){
    const requestBody = { email: email };
    return this.apiService.post('auth/forgot_password/send_otp', requestBody);
  }

  reset_password(otp,pwd,confirm_pwd){
    const requestBody = { auth_token: this.jwtService.getToken(), otp: otp, password: pwd, password_confirmation: confirm_pwd }
    return this.apiService.post('auth/forgot_password/reset_password', requestBody)
  }
}
