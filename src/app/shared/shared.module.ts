import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {FormInputComponent} from './form-elements/form-input/form-input.component';
import {CardComponent} from './card/card.component';
import {ImagePreviewComponent} from './form-elements/image-preview/image-preview.component';
import { CommentComponent } from './comment/comment.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import {AppRoutingModule} from "../app-routing.module";

@NgModule({
  declarations: [FormInputComponent, CardComponent, ImagePreviewComponent, CommentComponent, BreadcrumbComponent],
  exports: [
    FormInputComponent,
    CardComponent,
    ImagePreviewComponent,
    CommentComponent,
    BreadcrumbComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppRoutingModule
  ]
})
export class SharedModule {
}
