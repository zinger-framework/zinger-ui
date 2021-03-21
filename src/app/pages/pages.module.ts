import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PublicModule} from './public/public.module';
import {PrivateModule} from './private/private.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PublicModule,
    PrivateModule
  ]
})

export class PagesModule {
}
