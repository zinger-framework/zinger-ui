import {Component, Input} from '@angular/core';
import {ControlContainer, FormGroupDirective} from '@angular/forms';

@Component({
  selector: 'form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.css'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class FormInputComponent {
  @Input() inputType: string;
  @Input() placeholder: string;
  @Input() name: string;
  @Input() readonly: boolean = false;
  @Input() multiple: boolean = false;
  @Input() onChange: any = (t) => {};
}
