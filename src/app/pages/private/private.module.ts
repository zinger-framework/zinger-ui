import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgSelectModule} from '@ng-select/ng-select';

import {SharedModule} from '../../shared/shared.module';
import {NgApexchartsModule} from 'ng-apexcharts';
import {UiSwitchModule} from 'ngx-ui-switch';

import {PrivateComponent} from './private.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {HeaderComponent} from './header/header.component';
import {ProfileComponent} from './profile/profile.component';
import {ReactiveFormsModule} from "@angular/forms";
import {ShopDetailsComponent} from './shop-details/shop-details.component';
import {NgbAccordionModule} from "@ng-bootstrap/ng-bootstrap";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {PublicModule} from "../public/public.module";

@NgModule({
  declarations: [
    PrivateComponent,
    SidebarComponent,
    DashboardComponent,
    HeaderComponent,
    ProfileComponent,
    ShopDetailsComponent
  ],
  exports: [
    PrivateComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    NgApexchartsModule,
    UiSwitchModule,
    NgSelectModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    NgxMaterialTimepickerModule,
    PublicModule
  ]
})
export class PrivateModule {
}
