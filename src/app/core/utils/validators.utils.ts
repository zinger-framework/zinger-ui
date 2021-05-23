import {AbstractControl} from "@angular/forms";

export const validateRange = (minValue: number, maxValue: number) => {
  return (control: AbstractControl) => {
    let num = control.value;
    if (isNaN(num) || num < minValue || num > maxValue) {
      return {
        message: `Value must be between ${minValue} and ${maxValue}`
      };
    }
    return null;
  };
};
