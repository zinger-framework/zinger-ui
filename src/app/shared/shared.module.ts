import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {FormInputComponent} from './form-elements/form-input/form-input.component';
import {CardComponent} from './card/card.component';
import {ImagePreviewComponent} from './form-elements/image-preview/image-preview.component';
import { CommentComponent } from './comment/comment.component';

@NgModule({
  declarations: [FormInputComponent, CardComponent, ImagePreviewComponent, CommentComponent],
  exports: [
    FormInputComponent,
    CardComponent,
    ImagePreviewComponent,
    CommentComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class SharedModule {
}
