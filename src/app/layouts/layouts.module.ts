import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PrivateComponent} from './private/private.component';
import {HeaderComponent} from './public/header/header.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {SidebarComponent} from './private/sidebar/sidebar.component';
import {PublicComponent} from './public/public.component';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    PrivateComponent,
    PageNotFoundComponent,
    HeaderComponent,
    SidebarComponent,
    PublicComponent
  ],
  exports: [
    SidebarComponent,
    HeaderComponent,
    PrivateComponent,
    PublicComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class LayoutsModule {
}
