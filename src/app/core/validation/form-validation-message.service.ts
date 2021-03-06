import {Injectable} from '@angular/core';
import {FormControl, ControlContainer, AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {ErrorMessages} from "./error-messages";

@Injectable({
  providedIn: 'root'
})
export class FormValidationMessageService {
  controlName: string;
  control: FormControl;
  parent: ControlContainer;
  hasImplementationErrors = false;
  label: string;
  defaultLabel = 'Field';
  errorMessages = ErrorMessages;
  locale = "en"
  constructor() { }

  get currentControl(): AbstractControl {
    if (this.control instanceof FormControl) {
      return this.control;
    }

    if (this.parent.control.get(this.controlName) instanceof FormControl) {
      return this.parent.control.get(this.controlName);
    }
  }

  private get doNotShowMessage(): boolean {
    const currentControl: AbstractControl = this.currentControl;
    return currentControl.touched && currentControl.errors !== null;
  }

  getErrorMessage(): string {
    if (!this.doNotShowMessage) {
      return "";
    }

    const errors: ValidationErrors | ValidatorFn = this.currentControl.errors;
    return this.buildMessage({
      name: Object.keys(errors)[0],
      value: Object.values(errors)[0]
    });
  }

  getErrorMessages(): string[] {
    if (!this.doNotShowMessage) {
      return [];
    }

    const errors: ValidationErrors | ValidatorFn = this.currentControl.errors;
    const messages: string[] = [];

    for (const err of Object.keys(errors)) {
      messages.push(this.buildMessage({name: err, value: errors[err]}));
    }
    return messages;
  }

  private buildMessage(err: Error): string {
    let message = '';
    const errorMessage = this.getMessagesByLocale[err.name];

    if (errorMessage !== undefined) {
      message = errorMessage.message.replace(/{label}/g, this.label || this.defaultLabel);
      if (errorMessage.rExp !== undefined) {
        const errorValues: string[] = errorMessage.rExp.split('|');
        for (const errorValue of errorValues) {
          message = message.replace(new RegExp(`{${errorValue}}`, 'g'), err.value[errorValue]);
        }
      }
    } else {
      message = typeof err.value === 'string' ? err.value : JSON.stringify(err.value);
    }
    return message;
  }

  private get getMessagesByLocale() {
    const errorMessage = this.errorMessages;
    if (this.errorMessages[this.locale] === undefined) {
      throw new Error('No existe soporte para el idioma. [LOCALE_ID]');
    }
    return errorMessage[this.locale];
  }
}

interface Error {
  name: string;
  value: any;
}
