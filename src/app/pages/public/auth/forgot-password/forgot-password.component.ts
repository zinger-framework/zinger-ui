import {
  AfterViewInit,
  Component
} from '@angular/core';
import {AuthService} from '../../../../core/service/auth.service'
import {JwtService} from "../../../../core/service/jwt.service";
import {Router} from "@angular/router";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {APP_ROUTES} from "../../../../core/utils/constants.utils"
import {handleError} from "../../../../core/utils/common.utils"

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent{
  canExitFirstStep = false;
  canExitSecondStep = false;
  forgotPwdForm: FormGroup;
  otpForm: FormGroup;

  constructor(private authService: AuthService, private  jwtService: JwtService, private router: Router, private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    const emailPattern = /^\S+@\S+\.[a-z]+$/i
    const otpPattern = /^[0-9]{6}$/g
    this.otpForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.pattern(emailPattern)])
    })
    this.forgotPwdForm = this.fb.group({
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

  sendOtp() {
    this.resetApiError()
    this.authService.forgot_password_otp(this.forgotPwdForm.get('otpForm.email').value)
      .then((response) => {
        this.jwtService.saveToken(response['data']['auth_token'])
        // this.parentElement.querySelector("#otp-fm-email").setAttribute("readonly", "true")
      })
      .catch((error) => {
        handleError(error, "forgot-password-otp", { force_error_key: 'email' })
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
        // let data = handleError(error,"reset-pwd-fm",this.parentRef)
        // if(data['key'] == 'otp') this.wizard.goToPreviousStep();
      })
  }

  exitFirstStep() {
    return this.forgotPwdForm.get('otp').valid && this.forgotPwdForm.get('otpForm.email').valid && this.jwtService.isAuthTokenPresent();
  }

  resetApiError() {
  }

  resetApiError1(event: Event) {
    console.log(event);
  }
}
