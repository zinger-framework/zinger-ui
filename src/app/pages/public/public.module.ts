import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {AuthModule} from './auth/auth.module';

import {PublicComponent} from './public.component';
import {HeaderComponent} from './header/header.component';

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
