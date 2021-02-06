import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './features/auth/login/login.component';
import {ForgotPasswordComponent} from './features/auth/forgot-password/forgot-password.component';
import {AuthComponent} from './features/auth/auth.component';
import {ProfileComponent} from './features/profile/profile.component';
import {DashboardComponent} from './features/dashboard/dashboard.component';
import {PageNotFoundComponent} from './layouts/page-not-found/page-not-found.component'

const routes: Routes = [
  {path: 'profile', component: ProfileComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'auth', component: AuthComponent, children:[
    {path: 'login', component: LoginComponent},
    {path: 'forgot_password', component: ForgotPasswordComponent}
  ]},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
