import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgSelectModule} from '@ng-select/ng-select';
import {ReactiveFormsModule} from "@angular/forms";
import {NgApexchartsModule} from 'ng-apexcharts';
import {UiSwitchModule} from 'ngx-ui-switch';
import {NgbAccordionModule, NgbModule, NgbNavModule} from "@ng-bootstrap/ng-bootstrap";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {NgxDatatableModule} from '@swimlane/ngx-datatable';

import {SharedModule} from '../../../shared/shared.module';
import {FormInputModule} from "../../../shared/form-elements/form-input.module";

import {PrivateComponent} from './private.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {HeaderComponent} from './header/header.component';
import {ProfileComponent} from './profile/profile.component';
import {ShopDetailsComponent} from "./shop-details/shop-details.component";
import {ShopListComponent} from './shop-list/shop-list.component';
import {ItemListComponent} from './item-list/item-list.component';
import {ItemDetailsComponent} from './item-details/item-details.component';
import {ItemConfigListComponent} from './item-config-list/item-config-list.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';

@NgModule({
  declarations: [
    PrivateComponent,
    SidebarComponent,
    DashboardComponent,
    HeaderComponent,
    ProfileComponent,
    ShopDetailsComponent,
    ShopListComponent,
    ItemListComponent,
    ItemDetailsComponent,
    ItemConfigListComponent,
    OrderListComponent,
    OrderDetailsComponent
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
    FormInputModule,
    NgbNavModule,
    NgxDatatableModule,
    NgbModule
  ]
})
export class PrivateModule {
}
