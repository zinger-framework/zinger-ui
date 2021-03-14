import {Component, ViewChild} from '@angular/core';
import {AuthService} from '../../../../core/service/auth.service';
import {JwtService} from '../../../../core/service/jwt.service';
import {Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {APP_ROUTES, EMAIL_REGEX, OTP_REGEX} from '../../../../core/utils/constants.utils';
import {handleError} from '../../../../core/utils/common.utils';
import $ from 'jquery';
import {ExtendedFormControl} from '../../../../core/utils/extended-form-control.utils';
import {WizardComponent} from 'angular-archwizard';

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  canExitFirstStep = false;
  canExitSecondStep = false;
  forgotPwdForm: FormGroup;
  otpForm: FormGroup;
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;

  constructor(private authService: AuthService, private  jwtService: JwtService, private router: Router, private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.otpForm = this.fb.group({
      email: new ExtendedFormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)],
        'forgot-password-otp', 'email')
    });
    this.forgotPwdForm = this.fb.group({
      otp: new ExtendedFormControl('', [Validators.required, Validators.pattern(OTP_REGEX)], 'forgot-password', 'otp'),
      password: new ExtendedFormControl('', [Validators.required, Validators.minLength(6)], 'forgot-password', 'password'),
      confirm_password: new ExtendedFormControl('', [Validators.required, Validators.minLength(6), this.validatePassword], 'forgot-password', 'confirm_password')
    });
  }

  validatePassword(control: AbstractControl): { [key: string]: any } | null {
    if (control.value && control.root.get('password') && control.value != control.root.get('password').value) {
      return {'passwordNotEqual': 'Confirm Password doesn\'t match'};
    }
  }

  sendOtp() {
    this.authService.forgot_password_otp(this.otpForm.get('email').value)
      .then((response) => {
        this.jwtService.saveToken(response['data']['auth_token']);
        $('form.forgot-password-otp div.form-group-email input').attr('readonly', true);
      })
      .catch((error) => {
        handleError(error, this.otpForm, {'class_name': 'forgot-password-otp'});
      });
  }

  resetPassword() {
    let inputPwd = this.forgotPwdForm.get('password').value;
    let inputConfirmPwd = this.forgotPwdForm.get('confirm_password').value;
    let inputOtp = this.forgotPwdForm.get('otp').value;

    this.authService.reset_password(inputOtp, inputPwd, inputConfirmPwd)
      .then(response => {
        this.router.navigate([APP_ROUTES.DASHBOARD]);
      })
      .catch(error => {
        let errorMsg = handleError(error, this.forgotPwdForm, {'class_name': 'forgot-password'});
        if (errorMsg['otp'] != null) {
          this.wizard.goToPreviousStep();
        }
      });
  }

  exitFirstStep() {
    return this.forgotPwdForm.get('otp').valid && this.otpForm.valid && this.jwtService.isAuthTokenPresent();
  }
}
