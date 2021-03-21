import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {FormInputComponent} from './form-elements/form-input/form-input.component';
import {CardComponent} from './card/card.component';

@NgModule({
  declarations: [FormInputComponent, CardComponent],
  exports: [
    FormInputComponent,
    CardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class SharedModule {
}
