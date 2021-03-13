export const API_ENDPOINTS = {
  ADMIN_URL: 'http://admin.zinger.pw/',
  AUTH_FORGOT_PASSWORD_SEND_OTP: 'v1/auth/otp/forgot_password',
  AUTH_FORGOT_PASSWORD_RESET_PASSWORD: 'v1/auth/reset_password'
};

export const APP_ROUTES = {
  DASHBOARD: '/dashboard',
  AUTH_LOGIN: '/auth/login'
};

export const EMAIL_REGEX = /^\S+@\S+\.[a-z]+$/i;
export const OTP_REGEX = /^[0-9]{6}$/g;
