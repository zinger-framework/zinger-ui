import {Injectable} from '@angular/core';
import {LocalStorageService} from "./local-storage.service";
import {SESSION_KEY} from '../utils/constants.utils'

@Injectable()
export class JwtService {
  constructor(private localStorageService: LocalStorageService) {
  }

  getAuthToken(): string {
    return this.localStorageService.getData(SESSION_KEY.AUTHORIZATION)
  }

  saveToken(token: string) {
    this.localStorageService.saveData(SESSION_KEY.AUTHORIZATION, token)
  }

  destroyToken() {
    this.localStorageService.destroyData(SESSION_KEY.AUTHORIZATION);
    this.localStorageService.destroyData(SESSION_KEY.LOGGED_IN);
  }

  isLoggedIn() {
    return this.getAuthToken() != null && this.localStorageService.getData(SESSION_KEY.LOGGED_IN) == 'true';
  }
}
