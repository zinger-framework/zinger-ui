import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuthModule} from './auth/auth.module';
import {ProfileComponent} from './profile/profile.component';
import {DashboardComponent} from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    ProfileComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    AuthModule
  ]
})
export class FeaturesModule {
}
