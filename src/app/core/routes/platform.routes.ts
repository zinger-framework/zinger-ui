import {Routes} from "@angular/router";
import {ProfileComponent} from "../../pages/platform/private/profile/profile.component";
import {AuthGuardService} from "../service/platform/auth-guard.service";
import {DashboardComponent} from "../../pages/platform/private/dashboard/dashboard.component";
import {ShopDetailsComponent} from "../../pages/platform/private/shop-details/shop-details.component";
import {ShopListComponent} from "../../pages/platform/private/shop-list/shop-list.component";
import {ItemListComponent} from "../../pages/platform/private/item-list/item-list.component";
import {ItemDetailsComponent} from "../../pages/platform/private/item-details/item-details.component";
import {ItemConfigListComponent} from "../../pages/platform/private/item-config-list/item-config-list.component";
import {AuthComponent} from "../../pages/platform/public/auth/auth.component";
import {ForgotPasswordComponent} from "../../pages/platform/public/auth/forgot-password/forgot-password.component";
import {LoginComponent} from "../../pages/platform/public/auth/login/login.component";

export const PLATFORM_ROUTES: Routes = [
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService]},
  {path: 'shop/:id', component: ShopDetailsComponent, canActivate: [AuthGuardService]},
  {path: 'shop', component: ShopListComponent, canActivate: [AuthGuardService]},
  {path: 'shop/:shop_id/item', component: ItemListComponent, canActivate: [AuthGuardService]},
  {path: 'shop/:shop_id/item/:id', component: ItemDetailsComponent, canActivate: [AuthGuardService]},
  {path: 'config', component: ItemConfigListComponent, canActivate: [AuthGuardService]},
  {
    path: 'auth', component: AuthComponent, children: [
      {path: 'login', component: LoginComponent, canActivate: [AuthGuardService], data: {page: 'PUBLIC'}},
      {
        path: 'forgot_password',
        component: ForgotPasswordComponent,
        canActivate: [AuthGuardService],
        data: {page: 'PUBLIC'}
      }
    ]
  }
];
