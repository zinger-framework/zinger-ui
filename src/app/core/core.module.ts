import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

import {ApiService} from './service/api.service';
import {LocalStorageService} from "./service/local-storage.service";
import {JwtService} from './service/jwt.service';
import {AuthGuardService as AdminGuardService} from "./service/admin/auth-guard.service";
import {AuthGuardService as PlatformGuardService} from "./service/platform/auth-guard.service";

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [LocalStorageService, JwtService, AdminGuardService, PlatformGuardService,
    [{provide: HTTP_INTERCEPTORS, useClass: ApiService, multi: true}]
  ]
})
export class CoreModule {
}
