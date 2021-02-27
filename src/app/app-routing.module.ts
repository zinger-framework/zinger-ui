import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './pages/public/auth/login/login.component';
import {ForgotPasswordComponent} from './pages/public/auth/forgot-password/forgot-password.component';
import {AuthComponent} from './pages/public/auth/auth.component';
import {ProfileComponent} from './pages/private/profile/profile.component';
import {DashboardComponent} from './pages/private/dashboard/dashboard.component';
import {PageNotFoundComponent} from './layouts/page-not-found/page-not-found.component';

const routes: Routes = [
  {path: 'profile', component: ProfileComponent},
  {path: 'dashboard', component: DashboardComponent},
  {
    path: 'auth', component: AuthComponent, children: [
      {path: 'login', component: LoginComponent},
      {path: 'forgot_password', component: ForgotPasswordComponent}
    ]
  },
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
