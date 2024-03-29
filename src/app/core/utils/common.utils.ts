import $ from 'jquery';
import {FormGroup, ValidationErrors} from '@angular/forms';
import {ValidationErrorMessages} from './validation-error-messages.utils';

export function handleError(error: any, form: FormGroup) {
  let reason = error['error']['reason'];
  let errorMsg = {};
  if (reason != null) {
    if (typeof reason == 'string') {
      setFormErrors(form, reason);
    } else {
      Object.entries(reason).forEach(([reasonKey, value]) => {
        if (Array.isArray(value)) {
          errorMsg[reasonKey] = value.join(', ');
          setFormErrors(form, value.join(', '), reasonKey);
        }
      });
    }
  }
  return errorMsg;
}

export function setFormErrors(form: FormGroup, message: string, fieldKey = '') {
  if (fieldKey != '') {
    form.get(fieldKey).setErrors({invalid: message});
  } else {
    form.setErrors({invalid: message});
    setErrorMessage(message, form.controls['className'].value)
  }
}

export function setErrorMessage(message: string, className: string, fieldKey = '') {
  if (fieldKey != '' && $(`form.${className} div.form-group-${fieldKey} div.form-control-feedback`)[0] != null) {
    $(`form.${className} div.form-group-${fieldKey} div.form-control-feedback`)[0].innerHTML = message;
    if ($(`form.${className} div.form-group-${fieldKey} input`)[0] != null)
      $(`form.${className} div.form-group-${fieldKey} input`)[0].classList.add('form-control-danger');
    else if ($(`form.${className} div.form-group-${fieldKey} textarea`)[0] != null)
      $(`form.${className} div.form-group-${fieldKey} textarea`)[0].classList.add('form-control-danger');
  } else {
    $(`form.${className} div.form-feedback`)[0].innerHTML = message;
  }
}

export function clearErrorMessage(className: string, fieldKey = '') {
  if (fieldKey != '' && $(`form.${className} div.form-group-${fieldKey} div.form-control-feedback`)[0] != null) {
    $(`form.${className} div.form-group-${fieldKey} div.form-control-feedback`)?.empty();
    if ($(`form.${className} div.form-group-${fieldKey} input`)[0] != null)
      $(`form.${className} div.form-group-${fieldKey} input`)[0].classList.remove('form-control-danger');
    else if ($(`form.${className} div.form-group-${fieldKey} textarea`)[0] != null)
      $(`form.${className} div.form-group-${fieldKey} textarea`)[0].classList.remove('form-control-danger');
  }
  $(`form.${className} div.form-feedback`)?.empty();
}

export function buildMessage(error: ValidationErrors, label: string): string {
  let errorKey = Object.keys(error)[0];
  let errMsgObj = ValidationErrorMessages[errorKey];
  if (errMsgObj != null) {
    let message = errMsgObj['message'];
    for (let param of errMsgObj['params']) {
      if (param == 'label') {
        message = message.replace(/{label}/g, label[0].toUpperCase() + label.slice(1).replace(/_/g, ' '));
      } else {
        message = message.replace(new RegExp(`{${param}}`, 'g'), error[errorKey][param]);
      }
    }
    return message;
  } else {
    return Object.values(error)[0];
  }
}
