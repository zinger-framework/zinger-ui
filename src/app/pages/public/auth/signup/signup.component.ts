import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ExtendedFormControl} from '../../../../core/utils/extended-form-control.utils';
import {
  APP_ROUTES,
  EMAIL_REGEX,
  NAME_REGEX,
  OTP_REGEX,
  PASSWORD_LENGTH,
  SESSION_KEY
} from '../../../../core/utils/constants.utils';
import {AuthService} from '../../../../core/service/auth.service';
import {JwtService} from '../../../../core/service/jwt.service';
import $ from 'jquery';
import {handleError} from '../../../../core/utils/common.utils';
import {WizardComponent} from 'angular-archwizard';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupOtpForm: FormGroup;
  signupForm: FormGroup;
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;

  constructor(private fb: FormBuilder, private authService: AuthService, private jwtService: JwtService, private router: Router) {

    this.signupOtpForm = this.fb.group({
      email: new ExtendedFormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)], 'email'),
      className: 'signup-otp'
    });

    this.signupForm = this.fb.group({
      name: new ExtendedFormControl('', [Validators.required, Validators.pattern(NAME_REGEX)], 'name'),
      otp: new ExtendedFormControl('', [Validators.required, Validators.pattern(OTP_REGEX)], 'otp'),
      password: new ExtendedFormControl('', [Validators.required, Validators.minLength(PASSWORD_LENGTH)], 'password'),
      confirm_password: new ExtendedFormControl('', [Validators.required, Validators.minLength(PASSWORD_LENGTH), this.validatePassword], 'confirm_password'),
      className: 'signup'
    });
  }

  validatePassword(control: AbstractControl): { [key: string]: any } | null {
    if (control.value && control.root.get('password') && control.value != control.root.get('password').value) {
      return {'passwordNotEqual': 'Confirm Password doesn\'t match'};
    }
  }

  ngOnInit(): void {
  }

  signUp() {
    let otp = this.signupForm.get('otp').value;
    let name = this.signupForm.get('name').value;
    let password = this.signupForm.get('password').value;
    let confirm_password = this.signupForm.get('confirm_password').value;
    this.authService.signup(name, otp, password, confirm_password)
      .then(response => {
        this.jwtService.saveToken(response['data']['token']);
        this.jwtService.saveData(SESSION_KEY.LOGGED_IN, 'true');
        this.router.navigate([APP_ROUTES.DASHBOARD]);
      })
      .catch(error => {
        let errorMsg = handleError(error, this.signupForm);
        if (errorMsg['otp'] != null) this.wizard.goToPreviousStep();
      });
  }

  sendOtp() {
    this.authService.sendSignupOtp(this.signupOtpForm.get('email').value)
      .then(response => {
        this.jwtService.saveToken(response['data']['auth_token']);
        $('form.signup-otp div.form-group-email input').attr('readonly', true);
        let otpInput = $('form.signup form-input.d-none')[0]
        if (otpInput != null) otpInput.classList.remove('d-none');
      })
      .catch(error => {
        handleError(error, this.signupOtpForm);
      });
  }

  exitFirstStep() {
    return this.signupOtpForm.valid && this.signupForm.get('otp').valid && this.jwtService.getAuthToken() != null;
  }
}
