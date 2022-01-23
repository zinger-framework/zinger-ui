import {Component, ViewChild} from '@angular/core';
import {BaseComponent} from '../../../../../base.component';
import {AuthService} from '../../../../../core/service/platform/auth.service';
import {JwtService} from '../../../../../core/service/jwt.service';
import {Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {APP_ROUTES, EMAIL_REGEX, OTP_REGEX, PASSWORD_LENGTH} from '../../../../../core/utils/constants.utils';
import {handleError} from '../../../../../core/utils/common.utils';
import $ from 'jquery';
import {ExtendedFormControl} from '../../../../../core/utils/extended-form-control.utils';
import {WizardComponent} from 'angular-archwizard';

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent extends BaseComponent {
  forgotPwdForm: FormGroup;
  otpForm: FormGroup;

  @ViewChild(WizardComponent)
  public wizard: WizardComponent;

  constructor(private authService: AuthService, private jwtService: JwtService, private router: Router, private fb: FormBuilder) {
    super();
    this.otpForm = this.fb.group({
      email: new ExtendedFormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)], 'email'),
      className: 'forgot-password-otp'
    });
    this.forgotPwdForm = this.fb.group({
      otp: new ExtendedFormControl('', [Validators.required, Validators.pattern(OTP_REGEX)], 'otp'),
      password: new ExtendedFormControl('', [Validators.required, Validators.minLength(PASSWORD_LENGTH)], 'password'),
      confirm_password: new ExtendedFormControl('', [Validators.required, Validators.minLength(PASSWORD_LENGTH), this.validatePassword], 'confirm_password'),
      className: 'forgot-password'
    });
  }

  validatePassword(control: AbstractControl): { [key: string]: any } | null {
    if (control.value && control.root.get('password') && control.value != control.root.get('password').value) {
      return {'passwordNotEqual': 'Confirm Password doesn\'t match'};
    }
  }

  sendOtp() {
    this.authService.sendForgotPasswordOtp(this.otpForm.get('email').value)
      .then((response) => {
        this.jwtService.saveToken(response['data']['auth_token']);
        $('form.forgot-password-otp div.form-group-email input').attr('readonly', true);
        if ($('form.forgot-password form-input.d-none')[0] != null) {
          $('form.forgot-password form-input.d-none')[0].classList.remove('d-none');
        }
      })
      .catch((error) => {
        handleError(error, this.otpForm);
      });
  }

  resetPassword() {
    let inputPwd = this.forgotPwdForm.get('password').value;
    let inputConfirmPwd = this.forgotPwdForm.get('confirm_password').value;
    let inputOtp = this.forgotPwdForm.get('otp').value;

    this.authService.resetPassword(inputOtp, inputPwd, inputConfirmPwd)
      .then(response => {
        this.router.navigate([APP_ROUTES.AUTH_LOGIN]);
      })
      .catch(error => {
        let errorMsg = handleError(error, this.forgotPwdForm);
        if (errorMsg['otp'] != null) {
          this.wizard.goToPreviousStep();
        }
      });
  }

  exitFirstStep() {
    return this.forgotPwdForm.get('otp').valid && this.otpForm.valid && this.jwtService.getAuthToken() != null;
  }
}
