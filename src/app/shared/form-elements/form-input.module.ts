import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {FormInputComponent} from './form-input/form-input.component';

@NgModule({
  declarations: [FormInputComponent],
  exports: [
    FormInputComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class FormInputModule {
}
