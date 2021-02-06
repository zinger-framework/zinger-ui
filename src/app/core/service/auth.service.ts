import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  login(email: string, password: string) {
    const requestBody = JSON.stringify({emails: 'harsha1@gmail.com', mobile: email, password});
    return this.http.post('http://api.zinger.pw/v2/auth/login/password', requestBody).toPromise();
  }
}
