import {Injectable} from '@angular/core';
import {AbstractControl, ControlContainer, FormControl, ValidationErrors, ValidatorFn} from '@angular/forms';
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
  locale = 'en';

  constructor() {
  }

  get currentControl(): AbstractControl {
    if (this.control instanceof FormControl) {
      return this.control;
    }

    if (this.parent.control.get(this.controlName) instanceof FormControl) {
      return this.parent.control.get(this.controlName);
    }
  }

  private get showMessage(): boolean {
    const currentControl: AbstractControl = this.currentControl;
    return currentControl.touched && currentControl.errors !== null;
  }

  private get getMessagesByLocale() {
    const errorMessage = this.errorMessages;
    if (this.errorMessages[this.locale] === undefined) {
      throw new Error('No existing error found. [LOCALE_ID]');
    }
    return errorMessage[this.locale];
  }

  getErrorMessage(): string {
    if (!this.showMessage) {
      return "";
    }

    const errors: ValidationErrors | ValidatorFn = this.currentControl.errors;
    return this.buildMessage({
      name: Object.keys(errors)[0],
      value: Object.values(errors)[0]
    });
  }

  getErrorMessages(): string[] {
    if (!this.showMessage) {
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
      let modified_label = this.label.replace('_', ' ');
      modified_label = modified_label[0].toUpperCase() + modified_label.substring(1);
      message = errorMessage.message.replace(/{label}/g, modified_label || this.defaultLabel);
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
}

interface Error {
  name: string;
  value: any;
}
