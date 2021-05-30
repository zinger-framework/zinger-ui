import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

import {ApiService} from './service/api.service';
import {AuthService} from './service/auth.service';
import {LocalStorageService} from "./service/local-storage.service";
import {JwtService} from './service/jwt.service';
import {AuthGuardService} from "./service/auth-guard.service";
import {DefaultToPipe} from "./pipe/DefaultTo.pipe";

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [LocalStorageService, JwtService, AuthService, AuthGuardService,
    [{provide: HTTP_INTERCEPTORS, useClass: ApiService, multi: true}]
  ],
  exports: [
    DefaultToPipe
  ],
  declarations: [DefaultToPipe]
})
export class CoreModule {
}
