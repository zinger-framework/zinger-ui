import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ArchwizardModule} from 'angular-archwizard';
import {RouterModule} from '@angular/router';
import {NgbButtonsModule} from '@ng-bootstrap/ng-bootstrap';

import {LoginComponent} from './login/login.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {AuthComponent} from './auth.component';
import {SharedModule} from '../../../shared/shared.module';

@NgModule({
  declarations: [LoginComponent, ForgotPasswordComponent, AuthComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ArchwizardModule,
    RouterModule,
    NgbButtonsModule,
    SharedModule
  ]
})
export class AuthModule {
}
