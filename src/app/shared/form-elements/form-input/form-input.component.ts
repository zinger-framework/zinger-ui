import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {AbstractControl, ControlContainer, FormGroupDirective, ValidationErrors, ValidatorFn} from '@angular/forms';
import {buildMessage, setErrorMessage} from '../../../core/utils/common.utils'

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
      this.getValidationError()
    });
  }

  getValidationError() {
    if (this.control && this.control.invalid && this.control.touched) {
      const errors: ValidationErrors | ValidatorFn = this.control.errors;
      setErrorMessage(buildMessage(this.control.errors), this.formName, this.name);
    }else{
      setErrorMessage("", this.formName, this.name);
    }
  }
}
