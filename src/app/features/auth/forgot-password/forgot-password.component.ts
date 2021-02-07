import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../core/service/api.service'
@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
  }

  sendOtp(){
    console.log("OTP called")
    this.apiService.login("harsha1@gmail.com","test")
  }
}
