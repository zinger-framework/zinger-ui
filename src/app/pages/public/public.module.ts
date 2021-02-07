import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HeaderComponent} from './header/header.component';

import {AuthModule} from './auth/auth.module';
import {PublicComponent} from './public.component';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    HeaderComponent,
    PublicComponent
  ],
  exports: [
    PublicComponent
  ],
  imports: [
    CommonModule,
    AuthModule,
    RouterModule
  ]
})
export class PublicModule {
}
