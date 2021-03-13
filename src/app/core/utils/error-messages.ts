export const ErrorMessages = {
  required: {
    message: '{label} cannot be empty',
    params: ['label']
  },
  email: {
    message: 'Invalid {label}',
    params: ['label']
  },
  minlength: {
    message: '{label} should contain atleast {requiredLength} characters',
    params: ['label', 'requiredLength']
  },
  maxlength: {
    message: '{label} should contain maximum of {requiredLength} characters',
    params: ['label', 'requiredLength']
  },
  pattern: {
    message: 'Invalid {label}',
    params: ['label']
  }
};
