import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {ApiService} from "./service/api.service";

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [[{provide: HTTP_INTERCEPTORS, useClass: ApiService, multi: true}]]
})
export class CoreModule {
}
