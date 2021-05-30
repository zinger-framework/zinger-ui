import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './layouts/page-not-found/page-not-found.component';
import {ADMIN_ROUTES} from "./core/routes/admin.routes";
import {PLATFORM_ROUTES} from "./core/routes/platform.routes";

const routeConfig = { 'admin': ADMIN_ROUTES, 'platform': PLATFORM_ROUTES }
const defaultRoutes: Routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];
export const SUB_DOMAIN = window.location.hostname.split('.')[0];
@NgModule({
  imports: [RouterModule.forRoot(routeConfig[SUB_DOMAIN].concat(defaultRoutes))],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
