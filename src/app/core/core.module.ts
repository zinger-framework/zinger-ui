import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiService} from './service/api.service';
import {JwtService} from './service/jwt.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthService} from "./service/auth.service";
import {FormValidationMessageService} from './validation/form-validation-message.service';
import {FormValidationMessageDirective} from './validation/form-validation-message.directive';

@NgModule({
  declarations: [FormValidationMessageDirective],
  imports: [
    CommonModule
  ],
  exports: [
    FormValidationMessageDirective
  ],
  providers: [JwtService, AuthService, FormValidationMessageService,
    [{provide: HTTP_INTERCEPTORS, useClass: ApiService, multi: true}]
  ]
})
export class CoreModule {
}
