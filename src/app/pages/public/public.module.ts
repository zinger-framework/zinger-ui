import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {AuthModule} from './auth/auth.module';

import {PublicComponent} from './public.component';
import {HeaderComponent} from './header/header.component';
import {AccordionHeaderComponent} from './accordion-header/accordion-header.component';
import {NgbAccordionModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    HeaderComponent,
    PublicComponent,
    AccordionHeaderComponent
  ],
  exports: [
    PublicComponent,
    AccordionHeaderComponent
  ],
  imports: [
    CommonModule,
    AuthModule,
    RouterModule,
    NgbAccordionModule
  ]
})
export class PublicModule {
}
