import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LoginModule } from './features/login/login.module';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './core/component/page-not-found/page-not-found.component';
import { HeaderComponent } from './core/component/header/header.component';
import { InterceptorProviders } from './core/interceptor/interceptor';
import { AuthService } from './core/service/auth.service'
import { JwtService } from './core/service/jwt.service'
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './features/profile/profile.component';
import { SidebarComponent } from './core/component/sidebar/sidebar.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    HeaderComponent,
    ProfileComponent,
    SidebarComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    LoginModule,
    NgbModule
  ],
  providers: [AuthService, InterceptorProviders, JwtService],
  bootstrap: [AppComponent]
})
export class AppModule { }
