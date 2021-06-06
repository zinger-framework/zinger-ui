import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {UiSwitchModule} from 'ngx-ui-switch';
import {ToastrModule} from 'ngx-toastr';
import {AppRoutingModule} from './app-routing.module';
import {CoreModule} from "./core/core.module";
import {LayoutsModule} from './layouts/layouts.module'
import {PagesModule} from './pages/pages.module';
import {SharedModule} from './shared/shared.module';

import {AppComponent} from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    CoreModule,
    PagesModule,
    SharedModule,
    LayoutsModule,
    UiSwitchModule.forRoot({
      size: 'medium',
      color: '#28a745',
      defaultBgColor: '#f56767'
    }),
    NgSelectModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      closeButton: true
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
