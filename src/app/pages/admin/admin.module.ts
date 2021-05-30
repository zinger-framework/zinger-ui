import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";

import {PublicModule} from "./public/public.module";
import {PrivateModule} from "./private/private.module";

import {AdminComponent} from './admin.component';

@NgModule({
  declarations: [AdminComponent],
  exports: [
    AdminComponent
  ],
    imports: [
        PublicModule,
        PrivateModule,
        CommonModule,
        RouterModule
    ]
})
export class AdminModule {
}
