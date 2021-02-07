import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {CoreModule} from './core/core.module';
import {PagesModule} from './pages/pages.module';
import {SharedModule} from './shared/shared.module';
import {LayoutsModule} from './layouts/layouts.module';
import {PrivateModule} from './pages/private/private.module';
import {PublicModule} from './pages/public/public.module';

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
    PrivateModule,
    PublicModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
