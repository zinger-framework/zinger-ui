import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {AuthService} from '../../../../core/service/auth.service'
import {JwtService} from "../../../../core/service/jwt.service";
import {Router} from "@angular/router";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {WizardComponent} from "angular-archwizard";
import {APP_ROUTES} from "../../../../core/utils/constants.utils"

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, AfterViewInit {

  @ViewChild(WizardComponent) public wizard: WizardComponent;
  parentElement: HTMLElement;
  canExitFirstStep = false;
  canExitSecondStep = false;
  forgotPwdForm: FormGroup;
  apiError = {'email': "", 'otp': "", 'password': ""};
  FC_email: AbstractControl;
  FC_otp: AbstractControl;
  FC_pwd: AbstractControl;
  FC_confirmPwd: AbstractControl;
  @ViewChild("parent") private parentRef: ElementRef<HTMLElement>;

  constructor(private authService: AuthService, private  jwtService: JwtService, private router: Router, private fb: FormBuilder) {
    this.createForm();
    this.FC_email = this.forgotPwdForm.get('otpForm.email');
    this.FC_otp = this.forgotPwdForm.get('otp');
    this.FC_pwd = this.forgotPwdForm.get('password');
    this.FC_confirmPwd = this.forgotPwdForm.get('confirmPassword');
  }

  createForm() {
    const emailPattern = /^\S+@\S+\.[a-z]+$/i
    const otpPattern = /^[0-9]{6}$/g
    this.forgotPwdForm = this.fb.group({
      otpForm: new FormGroup({
        email: new FormControl('', [Validators.required, Validators.pattern(emailPattern)])
      }),
      otp: new FormControl('', [Validators.required, Validators.pattern(otpPattern)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6), this.validatePassword])
    });
  }

  validatePassword(control: AbstractControl): { [key: string]: any } | null {
    if (control.value && control.root.get('password') && control.value != control.root.get('password').value) {
      return {'passwordNotEqual': 'Confirm Password doesn\'t match'};
    }
    return null;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.parentElement = this.parentRef.nativeElement;
  }

  sendOtp() {
    this.resetApiError()
    this.authService.forgot_password_otp(this.forgotPwdForm.get('otpForm.email').value)
      .then((response) => {
        this.jwtService.saveToken(response['data']['auth_token'])
        this.parentElement.querySelector("#email").setAttribute("readonly", "true")
      })
      .catch((error) => {
        this.handleError(error)
      })
  }

  resetPassword() {
    this.resetApiError()
    let inputPwd = this.forgotPwdForm.get('password').value;
    let inputConfirmPwd = this.forgotPwdForm.get('confirmPassword').value;
    let inputOtp = this.forgotPwdForm.get('otp').value;

    this.authService.reset_password(inputOtp, inputPwd, inputConfirmPwd)
      .then(response => {
        this.router.navigate([APP_ROUTES.DASHBOARD])
      })
      .catch(error => {
        this.handleError(error,(args: string)=>{
            console.log(args);
            if(args == 'otp')
              this.wizard.goToPreviousStep();
        })
      })
  }

  handleError(error: any,callbackFunction?: (arg: string) => void){
    if(error['error']['reason']!=null){
      let reasonKey = Object.keys(error['error']['reason'])[0];
      if(error['error']['reason'][reasonKey].constructor.name=="Array")
          this.apiError[reasonKey] = error['error']['reason'][reasonKey][0];
      else
          this.apiError[reasonKey] = error['error']['reason'][reasonKey];
      if(callbackFunction!=null)
        callbackFunction(reasonKey);
    }else{
      console.log("here 1")
        if(error['status']==429){
          this.parentRef.nativeElement.querySelector("div.api-error").innerHTML = error['error']['message'];
        }
    }
  }

  exitFirstStep() {
    return this.forgotPwdForm.get('otp').valid && this.forgotPwdForm.get('otpForm.email').valid && this.jwtService.isAuthTokenPresent();
  }

  resetApiError() {
    this.apiError = {'email': "", 'otp': "", 'password': ""};
  }
}
