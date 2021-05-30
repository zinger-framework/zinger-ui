import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {FormInputModule} from "./form-elements/form-input.module";

import {CardComponent} from './card/card.component';
import {ImagePreviewComponent} from './image-preview/image-preview.component';
import {AccordionHeaderComponent} from "./accordion-header/accordion-header.component";

@NgModule({
  declarations: [CardComponent, ImagePreviewComponent, AccordionHeaderComponent],
  exports: [
    CardComponent,
    ImagePreviewComponent,
    AccordionHeaderComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormInputModule
  ]
})
export class SharedModule {
}
