import {Component, TemplateRef, ViewChild} from '@angular/core';
import {BaseComponent} from "../../../base.component";
import {ProfileService} from "../../../core/service/profile.service"
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ExtendedFormControl} from "../../../core/utils/extended-form-control.utils";
import {EMAIL_REGEX, MOBILE_REGEX, NAME_REGEX, OTP_REGEX, PASSWORD_LENGTH} from "../../../core/utils/constants.utils";
import {handleError, setErrorMessage} from "../../../core/utils/common.utils";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from "../../../core/service/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent extends BaseComponent {
  profileForm: FormGroup;
  verifyMobileForm: FormGroup;
  resetPwdForm: FormGroup;
  profileApiResponse: JSON;
  authToken = '';
  @ViewChild('verifyMobileModal', {read: TemplateRef}) verifyMobileModal: TemplateRef<any>;

  constructor(private profileService: ProfileService, private authService: AuthService, private fb: FormBuilder, private modalService: NgbModal) {
    super();
    this.profileForm = this.fb.group({
      name: new ExtendedFormControl('', [Validators.required, Validators.pattern(NAME_REGEX)], 'name'),
      mobile: new ExtendedFormControl('', [Validators.required, Validators.pattern(MOBILE_REGEX)], 'mobile'),
      email: new ExtendedFormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)], 'email'),
      two_fa_enabled: new ExtendedFormControl('', [Validators.required], 'two_fa'),
      className: 'profile'
    })

    this.verifyMobileForm = this.fb.group({
      otp: new ExtendedFormControl('', [Validators.required, Validators.pattern(OTP_REGEX)], 'otp'),
      className: 'verify-mobile'
    })

    this.resetPwdForm = this.fb.group({
      current_password: new ExtendedFormControl('', [Validators.required, Validators.minLength(PASSWORD_LENGTH)], 'current_password'),
      new_password: new ExtendedFormControl('', [Validators.required, Validators.minLength(PASSWORD_LENGTH)], 'new_password'),
      confirm_password: new ExtendedFormControl('', [Validators.required, Validators.minLength(PASSWORD_LENGTH), this.validatePassword], 'confirm_password'),
      className: 'reset-password'
    })
  }

  validatePassword(control: AbstractControl): { [key: string]: any } | null {
    if (control.value && control.root.get('new_password') && control.value != control.root.get('new_password').value) {
      return {'passwordNotEqual': 'Confirm Password doesn\'t match'};
    }
  }

  ngOnInit(): void {
    this.profileService.getProfile()
      .then(response => {
        this.updateProfileForm(response, true);
      })
      .catch(error => {
        handleError(error, this.profileForm);
      })
  }

  updatePassword() {
    this.profileService.updatePassword(this.resetPwdForm.get('current_password').value, this.resetPwdForm.get('new_password').value, this.resetPwdForm.get('confirm_password').value)
      .then(response => {
        this.profileService.logout();
      })
      .catch(error => {
        handleError(error, this.resetPwdForm);
      });
  }

  updateTwoFactor() {
    if (this.profileApiResponse['mobile'] == null && this.profileForm.get('two_fa_enabled').value) {
      setErrorMessage('Please update mobile number to enable 2FA', 'profile', 'mobile')
      this.profileForm.get('two_fa_enabled').setValue(false);
      return
    }
    this.profileService.updateProfile({two_fa_enabled: this.profileForm.get('two_fa_enabled').value})
      .then(response => {
        this.updateProfileForm(response);
      })
      .catch(error => {
        handleError(error, this.profileForm);
      })
  }

  verifyMobile() {
    this.updateProfile({auth_token: this.authToken, otp: this.verifyMobileForm.get('otp').value})
  }

  updateProfile(options = {}) {
    let requestObj = {};

    Object.keys(this.profileForm.value)
      .filter(k => this.profileForm.value[k] != this.profileApiResponse[k])
      .map(k => requestObj[k] = this.profileForm.get(k).value)

    if (Object.keys(requestObj).length == 0) return;
    if (requestObj['mobile'] != null && options['otp'] == null) return this.showOTPForm();

    this.profileService.updateProfile(Object.assign(requestObj, options))
      .then(response => {
        this.updateProfileForm(response);
        this.modalService.dismissAll();
      })
      .catch(error => {
        let reason = error['error']['reason']
        let form = (reason != null && typeof reason == 'object' && reason['otp'] != null) ? this.verifyMobileForm : this.profileForm;
        if (form == this.profileForm) this.modalService.dismissAll();
        handleError(error, form);
      });
  }

  updateProfileForm(response, initialization = false) {
    Object.keys(response['data']).map(k => {
      this.profileForm.get(k).setValue(response['data'][k]);
    })

    this.profileApiResponse = this.profileForm.value;

    if (this.profileForm.get('two_fa_enabled').value == true && !initialization) {
      this.profileService.logout();
    }
  }

  showOTPForm() {
    this.verifyMobileForm.reset({className: 'verify-mobile'});
    this.authToken = '';
    this.sendOtp();
    this.modalService.open(this.verifyMobileModal, {centered: true});
  }

  sendOtp() {
    this.authService.verifyMobile(this.profileForm.get('mobile').value)
      .then(response => {
        this.authToken = response['data']['auth_token'];
      })
      .catch(error => {
        handleError(error, this.verifyMobileForm);
      })
  }
}
