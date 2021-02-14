import {Injectable} from '@angular/core';

@Injectable()
export class JwtService {
  getToken(): string {
    return window.localStorage.authorization;
  }

  saveToken(token: string) {
    window.localStorage.authorization = token;
  }

  destroyToken() {
    window.localStorage.removeItem('authorization');
  }

  isAuthTokenPresent() {
    return this.getToken() != null;
  }
}
