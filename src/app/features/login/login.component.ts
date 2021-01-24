import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Input() email: string;
  @Input() password: string;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  login(){
    console.log("Email: "+this.email+"\n Password: "+this.password);
    this.authService.login(this.email,this.password)
    .then(data => console.log("Data1: "+JSON.stringify(data)))
    .catch(error => console.log("Data1: "+JSON.stringify(error)))
    /* Go to Next Step
     1. Store the data in session storage
     2. Reload the form component alone
     3. Try to break the current form into components
    */

  }

}
