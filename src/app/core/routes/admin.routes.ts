import {Routes} from "@angular/router";
import {ProfileComponent} from "../../pages/admin/private/profile/profile.component";
import {AuthGuardService} from "../service/admin/auth-guard.service";
import {DashboardComponent} from "../../pages/admin/private/dashboard/dashboard.component";
import {ShopDetailsComponent} from "../../pages/admin/private/shop-details/shop-details.component";
import {ShopListComponent} from "../../pages/admin/private/shop-list/shop-list.component";
import {ItemDetailsComponent} from "../../pages/admin/private/item-details/item-details.component";
import {ItemListComponent} from "../../pages/admin/private/item-list/item-list.component";
import {OrderListComponent} from "../../pages/admin/private/order-list/order-list.component";
import {OrderDetailsComponent} from "../../pages/admin/private/order-details/order-details.component";
import {AuthComponent} from "../../pages/admin/public/auth/auth.component";
import {ForgotPasswordComponent} from "../../pages/admin/public/auth/forgot-password/forgot-password.component";
import {LoginComponent} from "../../pages/admin/public/auth/login/login.component";
import {SignupComponent} from "../../pages/admin/public/auth/signup/signup.component";

export const ADMIN_ROUTES: Routes = [
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService]},
  {path: 'shop/:id', component: ShopDetailsComponent, canActivate: [AuthGuardService]},
  {path: 'shop', component: ShopListComponent, canActivate: [AuthGuardService]},
  {path: 'shop/:shop_id/item', component: ItemListComponent, canActivate: [AuthGuardService]},
  {path: 'shop/:shop_id/item/:id', component: ItemDetailsComponent, canActivate: [AuthGuardService]},
  {path: 'shop/:shop_id/order', component: OrderListComponent, canActivate: [AuthGuardService]},
  {path: 'shop/:shop_id/order/:id', component: OrderDetailsComponent, canActivate: [AuthGuardService]},
  {
    path: 'auth', component: AuthComponent, children: [
      {path: 'login', component: LoginComponent, canActivate: [AuthGuardService], data: {page: 'PUBLIC'}},
      {
        path: 'forgot_password',
        component: ForgotPasswordComponent,
        canActivate: [AuthGuardService],
        data: {page: 'PUBLIC'}
      },
      {path: 'signup', component: SignupComponent, canActivate: [AuthGuardService], data: {page: 'PUBLIC'}}
    ]
  }
];
