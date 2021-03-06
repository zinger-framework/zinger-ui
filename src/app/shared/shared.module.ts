import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {FormInputModule} from "./form-elements/form-input.module";

import {CardComponent} from './card/card.component';
import {ImagePreviewComponent} from './image-preview/image-preview.component';
import {AccordionHeaderComponent} from "./accordion-header/accordion-header.component";
import {CommentComponent} from './comment/comment.component';
import {BreadcrumbComponent} from './breadcrumb/breadcrumb.component';
import {AppRoutingModule} from "../app-routing.module";
import {ReasonModalComponent} from './reason-modal/reason-modal.component';

@NgModule({
  declarations: [CardComponent, ImagePreviewComponent, AccordionHeaderComponent, CommentComponent, BreadcrumbComponent, ReasonModalComponent],
  exports: [
    CardComponent,
    ImagePreviewComponent,
    AccordionHeaderComponent,
    CommentComponent,
    BreadcrumbComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormInputModule,
    AppRoutingModule
  ]
})
export class SharedModule {
}
