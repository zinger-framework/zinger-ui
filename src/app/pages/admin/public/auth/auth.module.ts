import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ArchwizardModule} from 'angular-archwizard';
import {RouterModule} from '@angular/router';
import {NgbButtonsModule} from '@ng-bootstrap/ng-bootstrap';

import {SharedModule} from '../../../../shared/shared.module';
import {CoreModule} from '../../../../core/core.module';
import {FormInputModule} from "../../../../shared/form-elements/form-input.module";

import {LoginComponent} from './login/login.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {AuthComponent} from './auth.component';
import {SignupComponent} from './signup/signup.component';

@NgModule({
  declarations: [LoginComponent, ForgotPasswordComponent, AuthComponent, SignupComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ArchwizardModule,
    RouterModule,
    NgbButtonsModule,
    SharedModule,
    CoreModule,
    FormInputModule
  ]
})
export class AuthModule {
}
