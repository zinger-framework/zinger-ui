import {AbstractControlOptions, AsyncValidatorFn, FormControl, ValidatorFn} from '@angular/forms';
import {buildMessage, clearErrorMessage, setErrorMessage} from './common.utils';

export class ExtendedFormControl extends FormControl {
  public controlName: string;

  constructor(formState?: any, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
              controlName?: string, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super(formState, validatorOrOpts, asyncValidator);
    this.controlName = controlName;
    this.valueChanges.subscribe(data => {
      this.parent.setErrors(null);
      this.getValidationError();
    });
    this.statusChanges.subscribe(data => {
      this.getValidationError();
    });
  }

  getValidationError() {
    let className = this.parent.controls['className'].value;
    if (this.invalid) {
      if (this.errors.invalid != null) {
        setErrorMessage(this.errors.invalid, className, this.controlName);
      } else if (this.touched) {
        setErrorMessage(buildMessage(this.errors, this.controlName), className, this.controlName);
      }
    } else {
      clearErrorMessage(className, this.controlName);
    }

    if (this.parent.errors?.invalid != null) {
      setErrorMessage(this.parent.errors.invalid, className);
    }
  }

  markAsTouched(opts?: { onlySelf?: boolean }) {
    super.markAsTouched(opts);
    this.getValidationError();
  }
}
