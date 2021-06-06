import {NgModule} from '@angular/core';
import {AdminModule} from "./admin/admin.module";
import {PlatformModule} from "./platform/platform.module";

@NgModule({
  declarations: [],
  exports: [
    AdminModule,
    PlatformModule
  ],
  imports: [
    AdminModule,
    PlatformModule
  ]
})

export class PagesModule {
}
