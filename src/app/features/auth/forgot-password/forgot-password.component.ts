import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../../core/service/auth.service'
import {JwtService} from "../../../core/service/jwt.service";
import {Router} from "@angular/router";

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit,AfterViewInit {

  @ViewChild("parent") private parentRef: ElementRef<HTMLElement>;
  inputEmail: string = '';
  inputOtp: string = '';
  inputPwd: string = '';
  inputConfirmPwd: string = '';
  parentElement: HTMLElement;
  canExitFirstStep = false;
  canExitSecondStep = false;

  constructor(private authService: AuthService, private  jwtService: JwtService,private router: Router) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.parentElement = this.parentRef.nativeElement;
  }


  sendOtp(){
    if(this.inputEmail.length <= 0 || !this.inputEmail.match(/^\S+@\S+\.[a-z]+$/i)) {
      this.show_error(this.parentElement,'email', ['Please provide a valid email']);
      return;
    }
    this.authService.forgot_password_otp(this.inputEmail)
      .then((response) => {
        console.log("auth token: ",response['data']['auth_token'])
        this.jwtService.saveToken(response['data']['auth_token'])
        this.parentElement.querySelector("#email").setAttribute("readonly","true")
        this.hide_error(this.parentElement,'email')
      })
      .catch((error) => {
        this.show_error(this.parentElement,"email",error['error']['reason'])
      })
  }

  resetPassword(){
    let error = null;
    if(this.inputPwd.length < 6)
      error = { param: 'password', message: 'Password should contain atleast 6 characters' }
    else if (this.inputPwd != this.inputConfirmPwd)
      error = { param: 'password_confirmation', message: "Confirm Password doesn't match" }

    if(error!=null){
      this.show_error(this.parentElement,error['param'],error['message'])
      return;
    }

    this.authService.reset_password(this.inputOtp,this.inputPwd,this.inputConfirmPwd)
      .then(response => {
        this.hide_error(this.parentElement,'password')
        this.hide_error(this.parentElement,'password_confirmation')
        console.log(response)
        this.router.navigate(['/dashboard'])
      })
      .catch(error => {
        console.log("checking error: ",error)
        this.show_error(this.parentElement,"password_confirmation",error['error']['reason'])
      })
  }

  exitFirstStep(event: any){
    let error = null;
    if(this.inputEmail.length <= 0 || !this.inputEmail.match(/^\S+@\S+\.[a-z]+$/i))
      error = { param: 'email', message: 'Please provide a valid email' }
    else if(!this.jwtService.isAuthTokenPresent())
      error = { param: 'email', message: "Please click 'Get OTP' button to receive OTP" }
    else if(!this.inputOtp.match(/^[0-9]{6}$/g))
      error = { param: 'otp', message: 'Please provide a valid OTP' }

    if(error!=null){
      this.show_error(this.parentElement,error['param'],error['message'])
      return;
    }
    this.canExitFirstStep = true;
  }

  public show_error(parentElement: HTMLElement,param,reason) {
    parentElement.querySelector("div.form-group-"+param).classList.add("has-danger");
    parentElement.querySelector("div.form-group input#"+param).classList.add("form-control-danger");
    parentElement.querySelector("div#error-"+param).innerHTML = "\t"+reason;
  }
  public hide_error(parentElement: HTMLElement,param){
    parentElement.querySelector("div.form-group-"+param).classList.remove('has-danger');
    parentElement.querySelector("div.form-group input#"+param).classList.remove('form-control-danger');
    parentElement.querySelector("div#error-"+param).innerHTML = "";
  }

}
