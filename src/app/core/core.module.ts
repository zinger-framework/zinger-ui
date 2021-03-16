import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiService} from './service/api.service';
import {JwtService} from './service/jwt.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthService} from './service/auth.service';
import {LocalStorageService} from "./service/local-storage.service";

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [LocalStorageService, JwtService, AuthService,
    [{provide: HTTP_INTERCEPTORS, useClass: ApiService, multi: true}]
  ]
})
export class CoreModule {
}
