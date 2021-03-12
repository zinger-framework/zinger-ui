import $ from 'jquery';

export function handleError(error: any, className: string, options = {}) {
  if (error['error']['reason'] != null) {
    if (typeof error['error']['reason'] == 'string') {
      if (options['force_error_key'] != null) {
        setErrorMessage(error['error']['reason'], className);
      } else {
        setErrorMessage(error['error']['reason'], className);
      }
      $('div.' + className + '-error').innerHTML = '<span style="color:red">' + error['error']['reason'] + '</span>';
    } else {
      let reasonKey = Object.keys(error['error']['reason'])[0];
      setErrorMessage(error['error']['reason'][reasonKey][0], className, reasonKey);
    }
  } else if (error['error']['message'] != null) {
    // data['value'] = error['error']['message'];
    // parentRef.nativeElement.querySelector('div.' + form + '-api-error').innerHTML = '<span style="color:red">' + error['error']['message'] + '</span>';
  } else {
    console.log('Something is wrong');
  }
  return {};
}

export function setErrorMessage(message: string, className: string, fieldKey = ''): void {
  if (fieldKey != '') {
    $('form.' + className + ' div.form-group-' + fieldKey + ' div.form-control-feedback')[0].innerHTML = message;
    $('form.' + className + ' div.form-group-' + fieldKey)[0].classList.add('has-danger');
    $('form.' + className + ' div.form-group-' + fieldKey + ' input')[0].classList.add('form-control-danger');
  } else {
    className = 'forgot-password'
    $('form.' + className + ' div.form-control-feedback')[0].innerHTML = message;
  }
}
