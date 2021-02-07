import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {
  }

  login(email: string, password: string) {
    const requestBody = JSON.stringify({emails: 'harsha1@gmail.com', mobile: email, password});
    return this.http.post('http://api.zinger.pw/v2/auth/login/password', requestBody).toPromise();
  }

  forgot_password(){
    console.log("Forgot Password called")
    const requestBody = JSON.stringify({emails: 'harsha1@gmail.com'});
    return this.http.post('http://admin.zinger.pw/auth/forgot_password/send_otp', requestBody).toPromise();
  }
}
