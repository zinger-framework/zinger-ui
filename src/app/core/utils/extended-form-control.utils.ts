import {AbstractControlOptions, AsyncValidatorFn, FormControl, ValidatorFn} from '@angular/forms';
import {buildMessage, clearErrorMessage, setErrorMessage} from './common.utils';

export class ExtendedFormControl extends FormControl {
  public focused: boolean = false;
  public className: string;
  public controlName: string;

  constructor(formState?: any, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
              className?: string, controlName?: string, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super(formState, validatorOrOpts, asyncValidator);
    this.className = className;
    this.controlName = controlName;
    this.valueChanges.subscribe(data => {
      this.getValidationError();
    });
    this.statusChanges.subscribe(data => {
      this.getValidationError();
    });
  }

  getValidationError() {
    if (this.valid) {
      clearErrorMessage(this.className, this.controlName);
    } else if (this.errors.invalid != null) {
      setErrorMessage(this.errors.invalid, this.className, this.controlName);
    } else if (this.touched) {
      setErrorMessage(buildMessage(this.errors, this.controlName), this.className, this.controlName);
    }
  }

  markAsTouched(opts?: { onlySelf?: boolean }) {
    super.markAsTouched(opts);
    this.getValidationError();
  }
}
