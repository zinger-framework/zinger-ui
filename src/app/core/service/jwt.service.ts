import {Injectable} from '@angular/core';

import {LocalStorageService} from "./local-storage.service";
import {SESSION_KEY} from '../utils/constants.utils'

@Injectable({
  providedIn: 'root'
})
export class JwtService extends LocalStorageService {

  getAuthToken(): string {
    return this.getData(SESSION_KEY.AUTHORIZATION)
  }

  saveToken(token: string) {
    this.saveData(SESSION_KEY.AUTHORIZATION, token)
  }

  destroyToken() {
    this.destroyData(SESSION_KEY.AUTHORIZATION);
    this.destroyData(SESSION_KEY.LOGGED_IN);
  }

  isLoggedIn() {
    return this.getAuthToken() != null && this.getData(SESSION_KEY.LOGGED_IN) == 'true';
  }
}
