import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {API_ENDPOINTS} from '../utils/constants.utils';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends ApiService {

  getProfile() {
    return this.get(API_ENDPOINTS.USER_PROFILE);
  }

  updateProfile(request_body) {
    return this.post(API_ENDPOINTS.USER_PROFILE_MODIFY, request_body);
  }

  updatePassword(current_pwd, new_pwd, confirm_pwd) {
    const requestBody = {
      current_password: current_pwd,
      new_password: new_pwd,
      confirm_password: confirm_pwd
    };
    return this.post(API_ENDPOINTS.USER_PROFILE_RESET_PASSWORD, requestBody);
  }
}
