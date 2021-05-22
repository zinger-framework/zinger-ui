export const API_ENDPOINTS = {
  ADMIN_URL: 'http://admin.zinger.pw/',
  AUTH_RESET_PASSWORD: 'v1/auth/reset_password',
  AUTH_LOGIN: 'v1/auth/login',
  AUTH_SIGNUP: 'v1/auth/signup',
  AUTH_VERIFY_OTP: 'v1/auth/verify_otp',
  AUTH_LOGOUT: 'v1/auth/logout',
  AUTH_OTP_LOGIN: 'v1/auth/otp/login',
  AUTH_OTP_VERIFY_MOBILE: 'v1/auth/otp/verify_mobile',
  AUTH_OTP_FORGOT_PASSWORD: 'v1/auth/otp/forgot_password',
  AUTH_OTP_SIGNUP: '/v1/auth/otp/signup',
  USER_PROFILE: 'v1/user_profile',
  USER_PROFILE_RESET_PASSWORD: 'v1/user_profile/reset_password',
  USER_PROFILE_MODIFY: 'v1/user_profile/modify',
  SHOP_NEW: 'v1/shop/new',
  SHOP: 'v1/shop',
};

export const APP_ROUTES = {
  DASHBOARD: '/dashboard',
  AUTH_LOGIN: '/auth/login',
  AUTH_FORGOT_PASSWORD: '/auth/forgot_password',
  AUTH_SIGNUP: '/auth/signup',
  SHOP: '/shop'
};

export const SESSION_KEY = {
  LOGGED_IN: 'logged_in',
  AUTHORIZATION: 'authorization'
}

export const PASSWORD_LENGTH = 6;
export const EMAIL_REGEX = /^\S+@\S+\.[a-z]+$/i;
export const OTP_REGEX = /^[0-9]{6}$/g;
export const MOBILE_REGEX = /^[0-9]{10}$/i;
export const TELEPHONE_REGEX = /^[0-9]{8}$/i;
export const NAME_REGEX = /^[A-z0-9' ]+$/;
export const ALPHABET_REGEX = /^[A-z]+$/;
export const BANK_ACCOUNT_NUMBER_REGEX = /^[a-zA-Z0-9]{1,34}$/;
export const IFSC_REGEX = /^[A-Z]{4}[A-Z0-9]{7}$/;
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
export const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9A-Z]{1}$/;
export const PINCODE_REGEX = /^[1-9][0-9]{5}$/;
export const LATLNG_REGEX = /^[0-9]{1,2}[.][0-9]{1,2}$/;
export const TAGS_REGEX = /^[a-zA-Z_, -]{1,100}$/;
