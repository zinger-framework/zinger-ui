import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";

import {PublicModule} from "./public/public.module";
import {PrivateModule} from "./private/private.module";

import {PlatformComponent} from './platform.component';

@NgModule({
  declarations: [PlatformComponent],
  exports: [
    PlatformComponent
  ],
  imports: [
    PublicModule,
    PrivateModule,
    CommonModule,
    RouterModule
  ]
})
export class PlatformModule {
}
