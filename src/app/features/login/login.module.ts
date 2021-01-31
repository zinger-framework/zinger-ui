import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import {ArchwizardModule} from 'angular-archwizard';

@NgModule({
  declarations: [LoginComponent, ForgotPasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    ArchwizardModule
  ]
})
export class LoginModule { }
