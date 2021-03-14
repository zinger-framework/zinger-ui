export const API_ENDPOINTS = {
  ADMIN_URL: 'http://admin.zinger.pw/',
  AUTH_OTP_FORGOT_PASSWORD: 'v1/auth/otp/forgot_password',
  AUTH_RESET_PASSWORD: 'v1/auth/reset_password',
  AUTH_LOGIN: '/v1/auth/login',
  AUTH_VERIFY_OTP: '/v1/auth/verify_otp',
  AUTH_LOGOUT: '/v1/auth/logout',
  AUTH_OTP_LOGIN: '/v1/auth/otp/login'
};

export const APP_ROUTES = {
  DASHBOARD: '/dashboard',
  AUTH_LOGIN: '/auth/login',
  AUTH_FORGOT_PASSWORD: '/auth/forgot_password'
};

export const EMAIL_REGEX = /^\S+@\S+\.[a-z]+$/i;
export const OTP_REGEX = /^[0-9]{6}$/g;
