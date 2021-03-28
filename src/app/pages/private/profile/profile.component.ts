import {Component, OnChanges, SimpleChanges} from '@angular/core';
import {BaseComponent} from "../../../base.component";
import {ProfileService} from "../../../core/service/profile.service"
import {ToastrService} from "ngx-toastr";
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ExtendedFormControl} from "../../../core/utils/extended-form-control.utils";
import {EMAIL_REGEX, PASSWORD_LENGTH} from "../../../core/utils/constants.utils";
import $ from 'jquery';
import {handleError} from "../../../core/utils/common.utils";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent extends BaseComponent{
  name: string;
  email: string;
  mobile: string;
  enable: boolean;
  selectedRole: string;
  profileForm: FormGroup;
  resetPwdForm: FormGroup;
  profileApiResponse: JSON;
  roles = ['Admin', 'Manager', 'Delivery'];

  constructor(private profileService: ProfileService,private fb: FormBuilder,private toastr: ToastrService) {
    super();

    this.profileForm = this.fb.group({
      name: new ExtendedFormControl('', [Validators.required],'name'),
      mobile: new ExtendedFormControl('', [Validators.required],'mobile'),
      email: new ExtendedFormControl('', [Validators.required,Validators.pattern(EMAIL_REGEX)],'email'),
      two_fa_enabled: new ExtendedFormControl('', [Validators.required],'two_fa'),
      role: new ExtendedFormControl('', [Validators.required],'role'),
      className: 'profile'
    })

    this.resetPwdForm = this.fb.group({
      current_password: new ExtendedFormControl('', [Validators.required,Validators.minLength(PASSWORD_LENGTH)],'current_password'),
      new_password: new ExtendedFormControl('', [Validators.required,Validators.minLength(PASSWORD_LENGTH)],'new_password'),
      confirm_password: new ExtendedFormControl('', [Validators.required,Validators.minLength(PASSWORD_LENGTH),this.validatePassword],'confirm_password'),
      className: 'reset-password'
    })
  }

  validatePassword(control: AbstractControl): { [key: string]: any } | null {
    if (control.value && control.root.get('new_password') && control.value != control.root.get('new_password').value) {
      return {'passwordNotEqual': 'Confirm Password doesn\'t match'};
    }
  }

  ngOnInit(): void {
    // check what happens for slow connection -> add a loading icon
    this.profileService.getProfile()
      .then(response => {
        this.profileForm.get('name').setValue(response['data']['name']);
        this.profileForm.get('mobile').setValue("+91 "+response['data']['mobile']);
        this.profileForm.get('email').setValue(response['data']['email']);
        this.profileForm.get('two_fa_enabled').setValue(response['data']['two_fa_enabled']);
        this.profileForm.get('role').setValue('Employee');
      })
      .catch(error => {
        handleError(error,this.profileForm)
      })
      .finally(()=>{
        $('form.profile div.form-group-mobile input').attr('readonly', true);
        $('form.profile div.form-group-email input').attr('readonly', true);
        $('form.profile div.form-group-role input').attr('readonly', true);
        this.profileApiResponse = this.profileForm.value;
      })
  }

  updatePassword(){
    this.profileService.updatePassword(this.resetPwdForm.get('current_password').value,this.resetPwdForm.get('new_password').value,this.resetPwdForm.get('confirm_password').value)
      .then(response => {
        this.profileService.logout();
      })
      .catch(error => {
        handleError(error,this.resetPwdForm)
      });
  }

  updateProfile(){
    let requestObj = {};
    Object.keys(this.profileForm.value).map(k=> {
      if(this.profileForm.value[k]!=this.profileApiResponse[k])
        requestObj[k] = this.profileForm.value[k]
    });
    // console.log(requestObj)
  }

  updateMobile(){
    console.log("update mobile number")
  }

  updateEmail(){
    console.log("update email")
  }
}
