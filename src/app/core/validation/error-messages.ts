const en = {
  required: {
    message: '{label} cannot be empty'
  },
  email: {
    message: 'Invalid {label}'
  },
  minlength: {
    message: '{label} should contain atleast {requiredLength} characters',
    rExp: 'requiredLength|actualLength'
  },
  maxlength: {
    message: '{label} should contain maximum of {requiredLength} characters',
    rExp: 'requiredLength|actualLength'
  },
  pattern: {
    message: 'Invalid {label}',
    rExp: 'requiredPattern|actualValue'
  }
};

export const ErrorMessages = { en };
