import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiService} from './service/api.service';
import {JwtService} from './service/jwt.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptorService} from './interceptor/api.interceptor';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [ApiService, JwtService,
    [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}]
  ]
})
export class CoreModule {
}
