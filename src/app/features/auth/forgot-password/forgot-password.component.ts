import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../../core/service/auth.service'
import {JwtService} from "../../../core/service/jwt.service";
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit,AfterViewInit {

  @ViewChild("parent") private parentRef: ElementRef<HTMLElement>;
  parentElement: HTMLElement;
  canExitFirstStep = false;
  canExitSecondStep = false;
  forgotPwdForm: FormGroup;

  constructor(private authService: AuthService, private  jwtService: JwtService,private router: Router,private fb: FormBuilder) {
    this.createForm();
  }

  createForm(){
    const emailPattern = /^\S+@\S+\.[a-z]+$/i
    const otpPattern = /^[0-9]{6}$/g
    this.forgotPwdForm = this.fb.group({
      otpForm: new FormGroup({
        email: new FormControl('',[Validators.required,Validators.pattern(emailPattern)])
      }),
      otp: new FormControl('',[Validators.required,Validators.pattern(otpPattern)]),
      password: new FormControl('',[Validators.required,Validators.minLength(6)]),
      confirmPassword: new FormControl('',[Validators.required,Validators.minLength(6)])
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.parentElement = this.parentRef.nativeElement;
  }

  sendOtp(){
    let inputEmail = this.forgotPwdForm.get('otpForm.email').value;
    if(inputEmail.length <= 0 || !inputEmail.match(/^\S+@\S+\.[a-z]+$/i)) {
      this.show_error(this.parentElement,'email', ['Please provide a valid email']);
      return;
    }
    this.authService.forgot_password_otp(inputEmail)
      .then((response) => {
        console.log("auth token: ",response['data']['auth_token'])
        this.jwtService.saveToken(response['data']['auth_token'])
        this.parentElement.querySelector("#email").setAttribute("readonly","true")
        this.hide_error(this.parentElement,'email')
      })
      .catch((error) => {
        this.show_error(this.parentElement,"email",error['error'])
      })
  }

  resetPassword(){
    let error = null;
    let inputPwd = this.forgotPwdForm.get('password').value;
    let inputConfirmPwd = this.forgotPwdForm.get('confirmPassword').value;
    let inputOtp = this.forgotPwdForm.get('otp').value;

    if(inputPwd.length < 6)
      error = { param: 'password', message: 'Password should contain atleast 6 characters' }
    else if (inputPwd != inputConfirmPwd)
      error = { param: 'password_confirmation', message: "Confirm Password doesn't match" }

    if(error!=null){
      this.show_error(this.parentElement,error['param'],error['message'])
      return;
    }

    this.authService.reset_password(inputOtp,inputPwd,inputConfirmPwd)
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
    let inputEmail = this.forgotPwdForm.get('otpForm.email').value;
    let inputOtp = this.forgotPwdForm.get('otp').value;
    if(inputEmail.length <= 0 || !inputEmail.match(/^\S+@\S+\.[a-z]+$/i))
      error = { param: 'email', message: 'Please provide a valid email' }
    else if(!this.jwtService.isAuthTokenPresent())
      error = { param: 'email', message: "Please click 'Get OTP' button to receive OTP" }
    else if(!inputOtp.match(/^[0-9]{6}$/g))
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
