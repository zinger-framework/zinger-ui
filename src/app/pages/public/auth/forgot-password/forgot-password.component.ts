import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../../../core/service/auth.service'
import {JwtService} from "../../../../core/service/jwt.service";
import {Router} from "@angular/router";
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';

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
  apiError = { 'email': "", 'otp': "", 'password': "" };

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
      confirmPassword: new FormControl('',[Validators.required,Validators.minLength(6),this.validatePassword])
    });
  }

  validatePassword(control: AbstractControl): {[key: string]: any} | null  {
    if (control.value && control.root.get('password') && control.value != control.root.get('password').value) {
      return { 'passwordNotEqual': 'Password do not match' };
    }
    return null;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.parentElement = this.parentRef.nativeElement;
  }

  sendOtp(){
    this.authService.forgot_password_otp(this.forgotPwdForm.get('otpForm.email').value)
      .then((response) => {
        this.jwtService.saveToken(response['data']['auth_token'])
        this.parentElement.querySelector("#email").setAttribute("readonly","true")
         this.hide_error(this.parentElement,'feedback')
        this.apiError['email'] = "";
      })
      .catch((error) => {
        this.apiError['email'] = error['error']['reason'] + ":"+ new Date().getTime();
        // this.show_error(this.parentElement,"error-email",error['error']['reason'])
      })
  }

  resetPassword(){
    let inputPwd = this.forgotPwdForm.get('password').value;
    let inputConfirmPwd = this.forgotPwdForm.get('confirmPassword').value;
    let inputOtp = this.forgotPwdForm.get('otp').value;

    this.authService.reset_password(inputOtp,inputPwd,inputConfirmPwd)
      .then(response => {
        this.hide_error(this.parentElement,'feedback')
        this.router.navigate(['/dashboard'])
      })
      .catch(error => {
        // this.show_error(this.parentElement,"feedback",error['error']['reason'])
        this.show_error(this.parentElement,"error-password_confirmation",error['error']['reason'])
      })
  }

  exitFirstStep(){
    return this.forgotPwdForm.get('otp').valid && this.forgotPwdForm.get('otpForm.email').valid && this.jwtService.isAuthTokenPresent();
  }

  public show_error(parentElement: HTMLElement,param,reason) {
    // parentElement.querySelector("div#"+param).innerHTML = "<div>"+reason+"</div>";
  }
  public hide_error(parentElement: HTMLElement,param){
    // parentElement.querySelector("div#"+param).innerHTML = "";
  }

}
