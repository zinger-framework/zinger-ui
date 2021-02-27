import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../../core/service/api.service';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  authForm: FormGroup;

  constructor(public authService: ApiService, private fb: FormBuilder) {
    this.authForm = this.fb.group({
      role: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  submitForm() {
    const credentials = this.authForm.value;
    this.getFormValidationErrors();
    console.log('Credentials: ', credentials);
  }

  getFormValidationErrors() {
    Object.keys(this.authForm.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.authForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  }
}
