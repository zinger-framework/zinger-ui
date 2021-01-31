import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './features/auth/login/login.component';
import {ForgotPasswordComponent} from './features/auth/forgot-password/forgot-password.component';
import {ProfileComponent} from './features/profile/profile.component';
import {DashboardComponent} from './features/dashboard/dashboard.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'forgot_password', component: ForgotPasswordComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'dashboard', component: DashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
