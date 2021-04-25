import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {LoginComponent} from './pages/public/auth/login/login.component';
import {ForgotPasswordComponent} from './pages/public/auth/forgot-password/forgot-password.component';
import {AuthComponent} from './pages/public/auth/auth.component';
import {ProfileComponent} from './pages/private/profile/profile.component';
import {DashboardComponent} from './pages/private/dashboard/dashboard.component';
import {PageNotFoundComponent} from './layouts/page-not-found/page-not-found.component';
import {AuthGuardService} from "./core/service/auth-guard.service";
import {SignupComponent} from "./pages/public/auth/signup/signup.component";
import {ShopDetailsComponent} from "./pages/private/shop-details/shop-details.component";

const routes: Routes = [
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService]},
  {path: 'addShop', component: ShopDetailsComponent, canActivate: [AuthGuardService]},
  {path: 'updateShop', component: ShopDetailsComponent, canActivate: [AuthGuardService]},
  {
    path: 'auth', component: AuthComponent, children: [
      {path: 'login', component: LoginComponent, canActivate: [AuthGuardService], data: {page: 'PUBLIC'}},
      {path: 'forgot_password', component: ForgotPasswordComponent, canActivate: [AuthGuardService], data: {page: 'PUBLIC'}},
      {path: 'signup', component: SignupComponent, canActivate: [AuthGuardService], data: {page: 'PUBLIC'}}
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
