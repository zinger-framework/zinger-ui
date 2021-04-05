import {Component} from '@angular/core';
import {BaseComponent} from "../../../base.component";
import {ProfileService} from "../../../core/service/profile.service"
import {ToastrService} from "ngx-toastr";
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ExtendedFormControl} from "../../../core/utils/extended-form-control.utils";
import {EMAIL_REGEX, MOBILE_REGEX, NAME_REGEX, PASSWORD_LENGTH} from "../../../core/utils/constants.utils";
import {handleError} from "../../../core/utils/common.utils";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent extends BaseComponent {
  name: string;
  email: string;
  mobile: string;
  enable: boolean;
  selectedRole: string;
  profileForm: FormGroup;
  resetPwdForm: FormGroup;
  profileApiResponse: JSON;

  constructor(private profileService: ProfileService, private fb: FormBuilder, private toastr: ToastrService) {
    super();
    this.profileForm = this.fb.group({
      name: new ExtendedFormControl('', [Validators.required, Validators.pattern(NAME_REGEX)], 'name'),
      mobile: new ExtendedFormControl('', [Validators.required, Validators.pattern(MOBILE_REGEX)], 'mobile'),
      email: new ExtendedFormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)], 'email'),
      two_fa_enabled: new ExtendedFormControl('', [Validators.required], 'two_fa'),
      role: new ExtendedFormControl('', [Validators.required], 'role'),
      className: 'profile'
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
        this.updateProfileForm(response,true);
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
    this.profileService.updateProfile({two_fa_enabled: this.profileForm.get('two_fa_enabled').value})
      .then(response => {
        this.updateProfileForm(response);
      })
      .catch(error => {
        handleError(error, this.profileForm);
    })
  }

  updateProfile() {
    let requestObj = {};
    Object.keys(this.profileForm.value).map(k => {
      if (this.profileForm.value[k] != this.profileApiResponse[k])
        requestObj[k] = this.profileForm.get(k).value
    });

    if (Object.keys(requestObj).length == 0) return;

    this.profileService.updateProfile(requestObj)
      .then(response => {
        this.updateProfileForm(response);
      })
      .catch(error => {
        handleError(error, this.profileForm)
      });
  }

  updateProfileForm(response,initialization = false){
    Object.keys(response['data']).map(k => {
      this.profileForm.get(k).setValue(response['data'][k]);
    })
    this.profileApiResponse = this.profileForm.value;
    if(initialization){
      this.profileForm.get('role').setValue('Employee');
      return;
    }
    if (this.profileForm.get('two_fa_enabled').value == true) {
      this.profileService.logout();
    }
  }
}
