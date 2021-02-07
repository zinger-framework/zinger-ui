import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PrivateComponent} from './private.component';
import {SidebarComponent} from './sidebar/sidebar.component';


@NgModule({
  declarations: [
    PrivateComponent,
    SidebarComponent
  ],
  exports: [
    PrivateComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PrivateModule {
}
