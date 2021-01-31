import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HeaderComponent} from './header/header.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {SidebarComponent} from './sidebar/sidebar.component';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    HeaderComponent,
    SidebarComponent
  ],
  exports: [
    SidebarComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule
  ]
})
export class LayoutsModule {
}
