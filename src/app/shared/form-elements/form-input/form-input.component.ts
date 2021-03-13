import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {AbstractControl, ControlContainer, FormGroupDirective} from '@angular/forms';
import {buildMessage, clearErrorMessage, setErrorMessage} from '../../../core/utils/common.utils';

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
export class FormInputComponent implements OnInit, AfterViewInit {
  @Input() inputType: string;
  @Input() placeholder: string;
  @Input() name: string;
  @Input() formName: string;
  @Input() control: AbstractControl;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.control.valueChanges.subscribe(data => {
      this.getValidationError();
    });
  }

  getValidationError() {
    if (this.control && this.control.invalid && this.control.touched) {
      setErrorMessage(buildMessage(this.control.errors, this.name), this.formName, this.name);
    } else {
      clearErrorMessage(this.formName, this.name);
    }
  }
}
