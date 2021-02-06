import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthService} from './service/auth.service';
import {JwtService} from './service/jwt.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptorService} from './interceptor/auth.interceptor';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [AuthService, JwtService,
    [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}]
  ]
})
export class CoreModule {
}
