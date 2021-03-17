import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ExtendedFormControl} from "../../../../core/utils/extended-form-control.utils";
import {APP_ROUTES, EMAIL_REGEX, OTP_REGEX, SESSION_KEY} from "../../../../core/utils/constants.utils";
import {AuthService} from "../../../../core/service/auth.service";
import {handleError} from "../../../../core/utils/common.utils";
import {JwtService} from "../../../../core/service/jwt.service";
import {WizardComponent} from "angular-archwizard";
import {LocalStorageService} from "../../../../core/service/local-storage.service";
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  otpForm: FormGroup;
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;

  constructor(public authService: AuthService, private jwtService: JwtService, private localStorageService: LocalStorageService, 
      private fb: FormBuilder, private router: Router, private toastr: ToastrService) {
    this.loginForm = this.fb.group({
      role: new FormControl('Admin', [Validators.required]),
      email: new ExtendedFormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)], 'email'),
      password: new ExtendedFormControl('', [Validators.required, Validators.minLength(6)], 'password'),
      className: 'login'
    });

    this.otpForm = this.fb.group({
      otp: new ExtendedFormControl('', [Validators.required, Validators.pattern(OTP_REGEX)], 'otp'),
      className: 'otp'
    });
  }

  ngOnInit(): void {
  }

  login() {
    this.authService
      .login(this.loginForm.get("email").value, this.loginForm.get("password").value, this.loginForm.get("role").value)
      .then(response => {
        this.jwtService.saveToken(response['data']['token']);
        if (response['data']['redirect_to'] == 'OTP') {
          this.localStorageService.saveData(SESSION_KEY.LOGGED_IN, 'false');
          this.wizard.goToNextStep()
        } else {
          this.localStorageService.saveData(SESSION_KEY.LOGGED_IN, 'true');
          this.router.navigate([APP_ROUTES.DASHBOARD]);
        }
      })
      .catch(error => {
        handleError(error, this.loginForm);
      });
  }

  verifyOtp() {
    this.authService.verifyOTP(this.otpForm.get("otp").value)
      .then(response => {
        this.jwtService.saveToken(response['data']['token']);
        this.localStorageService.saveData(SESSION_KEY.LOGGED_IN, 'true')
        this.router.navigate([APP_ROUTES.DASHBOARD]);
      })
      .catch(error => {
        handleError(error, this.otpForm);
      })
  }

  resendOtp() {
    this.authService.resendOtp()
      .then(response => {
        if (response['reason'] == "ALREADY_LOGGED_IN") {
          this.router.navigate([APP_ROUTES.DASHBOARD]);
        }
        else {
          this.jwtService.saveToken(response['data']['token']);
        }
      })
      .catch(error => {
        this.toastr.error(error['error']['message']);
      })
  }

  logout() {
    this.authService.logout();
    this.wizard.goToPreviousStep();
    this.loginForm.reset();
  }

  redirectToForgotPassword() {
    return APP_ROUTES.AUTH_FORGOT_PASSWORD;
  }
}
