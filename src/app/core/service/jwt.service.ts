import { Injectable } from '@angular/core';

@Injectable()
export class JwtService {

  metaData: JSON;

  getToken(): String {
    return window.localStorage['authorization'];
  }

  saveToken(token: String) {
    window.localStorage['authorization'] = token;
  }

  destroyToken() {
    window.localStorage.removeItem('authorization');
  }

  isLoggedIn(){
    return this.getToken() != null;
  }
}
