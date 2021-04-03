export const API_ENDPOINTS = {
  ADMIN_URL: 'http://admin.zinger.pw/',
  AUTH_OTP_FORGOT_PASSWORD: 'v1/auth/otp/forgot_password',
  AUTH_RESET_PASSWORD: 'v1/auth/reset_password',
  AUTH_LOGIN: 'v1/auth/login',
  AUTH_VERIFY_OTP: 'v1/auth/verify_otp',
  AUTH_LOGOUT: 'v1/auth/logout',
  AUTH_OTP_LOGIN: 'v1/auth/otp/login',
  USER_PROFILE: 'v1/user_profile',
  USER_PROFILE_RESET_PASSWORD: 'v1/user_profile/reset_password',
  USER_PROFILE_MODIFY: 'v1/user_profile/modify'
};

export const APP_ROUTES = {
  DASHBOARD: '/dashboard',
  AUTH_LOGIN: '/auth/login',
  AUTH_FORGOT_PASSWORD: '/auth/forgot_password',
  AUTH_SIGNUP: '/auth/signup'
};

export const SESSION_KEY = {
  LOGGED_IN: 'logged_in',
  AUTHORIZATION: 'authorization'
}

export const PASSWORD_LENGTH = 6;
export const EMAIL_REGEX = /^\S+@\S+\.[a-z]+$/i;
export const OTP_REGEX = /^[0-9]{6}$/g;
