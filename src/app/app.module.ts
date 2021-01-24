import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LoginModule } from './features/login/login.module';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './core/component/page-not-found/page-not-found.component';
import { HeaderComponent } from './core/component/header/header.component';
import { interceptorProviders } from './core/interceptor/interceptor';
import { AuthService } from './core/service/auth.service'
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    LoginModule
  ],
  providers: [AuthService, interceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
