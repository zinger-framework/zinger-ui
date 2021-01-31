import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {InterceptorProviders} from './interceptor/interceptor';
import {AuthService} from './service/auth.service';
import {JwtService} from './service/jwt.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [AuthService, InterceptorProviders, JwtService]
})
export class CoreModule {
}
