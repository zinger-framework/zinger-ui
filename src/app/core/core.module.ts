import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiService} from './service/api.service';
import {JwtService} from './service/jwt.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {ApiInterceptorService} from './interceptor/api.interceptor';
import {AuthService} from "./service/auth.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [ApiService, JwtService, AuthService,
    [{provide: HTTP_INTERCEPTORS, useClass: ApiInterceptorService, multi: true}]
  ]
})
export class CoreModule {
}
