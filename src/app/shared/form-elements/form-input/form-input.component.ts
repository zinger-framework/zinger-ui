import {Component, Input, OnInit} from '@angular/core';
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
export class FormInputComponent implements OnInit {
  @Input() inputType: string;
  @Input() placeholder: string;
  @Input() name: string;
  @Input() isRequired = true;

  constructor() { }

  ngOnInit(): void { }
}
