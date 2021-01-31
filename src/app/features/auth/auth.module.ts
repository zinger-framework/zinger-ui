import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {ArchwizardModule} from 'angular-archwizard';
import {RouterModule} from '@angular/router';
import {NgbButtonsModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [LoginComponent, ForgotPasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ArchwizardModule,
    RouterModule,
    NgbButtonsModule
  ]
})
export class AuthModule {
}
