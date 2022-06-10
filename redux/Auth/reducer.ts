import { ACTION_START, IS_LOGGED_IN, IS_REGISTERED, ERRORS, SENT_OTP, COMPLETE, IS_LOGGED_IN_ERROR, IS_LOGGED_OUT, GET_PROFILE, IS_PROFILE_UPDATE,FORGOT_PASSWORD, FORGOT_PASSWORD_CONFIRM } from "./action";

interface initType {
  isLoggedIn: boolean,
  isRegisterd: boolean,
  isOtpSent: boolean,
  isAgentNotTrusted: boolean,
  isForgotPassword: boolean,
  loading: boolean,
  success: boolean,
  data: {},
  errors: {},
  profileData:{}
}

const initState: initType = {
  isLoggedIn: false,
  isRegisterd: false,
  isOtpSent: false,
  isAgentNotTrusted: false,
  isForgotPassword: false,
  loading: false,
  success: false,
  data: {},
  errors: {},
  profileData:{}
};

const auth = (state = initState, action: any) => {
  switch (action.type) {
    case ACTION_START:
      return { ...state, loading: true, isOtpSent: false, isRegisterd: false, errors: {} };
    case IS_LOGGED_IN:
      return { ...state, success: true, isLoggedIn: true, data: action.payload };
    case IS_PROFILE_UPDATE:
      return { ...state, success: true, isLoggedIn: true, profileData: action.payload };
    case IS_LOGGED_OUT:
      return { ...state, isLoggedIn:false};
    case IS_LOGGED_IN_ERROR:
      return { ...state, success: false, isAgentNotTrusted: true, data: action.payload };
    case SENT_OTP:
      return { ...state, success: true, isOtpSent: true, data: action.payload };
    case IS_REGISTERED:
      return { ...state, success: true, isRegisterd: true, data: action.payload };
    case GET_PROFILE:
      return { ...state, success: true, data: action.payload };
    case FORGOT_PASSWORD:
      return { ...state, success: true, data: action.payload };
    case FORGOT_PASSWORD_CONFIRM:
      return { ...state, success: true, isForgotPassword:true, data: action.payload };
    case ERRORS:
      return { ...state, errors: action.payload, success: false, isOtpSent: false, loading: false };
    case COMPLETE:
      return { ...state, loading: false };
    default:
      return state;
  }
};
export default auth;
