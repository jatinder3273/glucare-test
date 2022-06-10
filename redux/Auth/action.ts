import { AnyAction } from "redux";
import { toast } from "react-toastify";
import {
  checkResponse,
  formatError,
  removeCurrentUser,
  setChatToken,
} from "utils";
import authConfig from "utils/auth";
import {
  getProfileQuery,
  getUserProfile,
  loginQuery,
  logoutApi,
  refreshTokenApi,
  registerQuery,
  sentOtpToPhoneNumberQuery,
  updateProfile,
  verifyOtpQuery,
  forgotPasswordConfirmQuery,
  forgotPasswordQuery,
  sentOtpToPhoneNumberLoginQuery,
  getChatTokenQuery,
} from "./query";
import { AppDispatch } from "redux/store";
export const IS_LOGGED_IN = "user/logged_in";
export const IS_LOGGED_IN_ERROR = "user/logged_in_error";
export const IS_REGISTERED = "user/register";
export const FORGOT_PASSWORD = "user/forgot_password";
export const FORGOT_PASSWORD_CONFIRM = "user/forgot_password_confirm";
export const SENT_OTP = "user/sentotp";
export const ERRORS = "user/errors";
export const ACTION_START = "user/start";
export const COMPLETE = "COMPLETE";
export const IS_LOGGED_OUT = "IS_LOGGED_OUT";
export const GET_PROFILE = "user/get_profile";
export const GET_IMAGE = "user/get_image";
export const IS_PROFILE_UPDATE = "IS_PROFILE_UPDATE";

export const login =
  (data: { password: string; phone_number: string }) =>
  async (dispatch: AppDispatch) => {
    const res = await loginQuery(data);
    const response = await checkResponse(res);

    if (response.success) {
      dispatch({
        type: IS_LOGGED_IN,
        payload: response.data,
      });
      dispatch({
        type: IS_PROFILE_UPDATE,
        payload: response.data.profile,
      });
    } else if (response.code === 401) {
      dispatch(refreshToken());
    } else {
      if (response.code === 403) {
        localStorage.setItem("phoneNumber", data.phone_number);
        dispatch({
          type: IS_LOGGED_IN_ERROR,
          payload: response.errorMessages,
        });
      } else {
        dispatch({
          type: ERRORS,
          payload: response.errorMessages,
        });
      }
    }
  };

export const sentOtpToPhoneNumber =
  (data: { phone_number: string }) => async (dispatch: AppDispatch) => {
    const res = await sentOtpToPhoneNumberQuery(data);
    const response = await checkResponse(res);

    if (response.success) {
      dispatch({
        type: SENT_OTP,
        payload: response.data,
      });
    } else {
      const errors: any = formatError(response.errorMessages || []);
      dispatch({
        type: ERRORS,
        payload: errors,
      });
    }
    dispatch({
      type: COMPLETE,
      payload: "",
    });
  };

export const sentOtpToPhoneNumberLogin =
  (data: { phone_number: string }) => async (dispatch: AppDispatch) => {
    const res = await sentOtpToPhoneNumberLoginQuery(data);
    const response = await checkResponse(res);

    if (response.success) {
      dispatch({
        type: SENT_OTP,
        payload: response.data,
      });
    } else {
      const errors: any = formatError(response.errorMessages || []);
      dispatch({
        type: ERRORS,
        payload: errors,
      });
    }
    dispatch({
      type: COMPLETE,
      payload: "",
    });
  };
export const register =
  (data: { activation_code: any; phone_number: string; password: string }) =>
  async (dispatch: AppDispatch) => {
    const res = await registerQuery(data);
    const response = await checkResponse(res);
    if (response.success) {
      dispatch({
        type: IS_REGISTERED,
        payload: response.data,
      });
    } else {
      const errors: any = formatError(response.errorMessages || []);
      dispatch({
        type: ERRORS,
        payload: errors,
      });
    }
    dispatch({
      type: COMPLETE,
      payload: "",
    });
  };

export const verifyOtp =
  (data: { activation_code: any; phone_number: string }) =>
  async (dispatch: AppDispatch) => {
    const res = await verifyOtpQuery(data);
    const response = await checkResponse(res);
    if (response.success) {
      dispatch({
        type: IS_LOGGED_IN,
        payload: response.data,
      });
      dispatch({
        type: IS_PROFILE_UPDATE,
        payload: response.data.profile,
      });
    } else {
      const errors: any = formatError(response.errorMessages || []);
      dispatch({
        type: ERRORS,
        payload: errors,
      });
    }
    dispatch({
      type: COMPLETE,
      payload: "",
    });
  };

export const updateUserProfile =
  (data: AppDispatch) => async (dispatch: AppDispatch) => {
    const res = await updateProfile(data);
    const response = await checkResponse(res);

    if (response.success) {
      const profileRes = await getUserProfile();
      const finalResponse = await checkResponse(profileRes);
      if (finalResponse.success) {
        dispatch({
          type: IS_PROFILE_UPDATE,
          payload: finalResponse.data,
        });
        return response;
      }
    } else {
      if (response.code === 403 || response.code === 401) {
        dispatch(refreshToken());
      }
      return response;
    }
  };

export const refreshToken = () => async () => {
  const res = await refreshTokenApi();
  const response = await checkResponse(res);
  if (response.success) {
    localStorage.setItem(authConfig.storageTokenKeyName, res.data.body.access);
  }
};
export const logout = () => async (dispatch: AppDispatch) => {
  const res = await logoutApi();
  const response = await checkResponse(res);
  if (response.code === 204 || response.code === 200) {
    removeCurrentUser();
    dispatch({
      type: IS_LOGGED_OUT,
      payload: {},
    });
  } else if (response.code === 401) {
    dispatch(refreshToken());
    logout();
  }
};

export const getProfile = () => async (dispatch: AppDispatch) => {
  const res = await getProfileQuery();
  const response = await checkResponse(res);
  if (response.success) {
    dispatch({
      type: GET_PROFILE,
      payload: response.data,
    });
  } else if (response.code === 401) {
    dispatch(refreshToken());
    getProfile();
  } else {
    const errors: any = formatError(response.errorMessages || []);
    dispatch({
      type: ERRORS,
      payload: errors,
    });
  }
  dispatch({
    type: COMPLETE,
    payload: "",
  });
};

export const forgot_password =
  (data: { phone_number: string }) => async (dispatch: AppDispatch) => {
    const res = await forgotPasswordQuery(data);
    const response = await checkResponse(res);
    if (response.success) {
      localStorage.setItem("phoneNumber", data.phone_number);
      dispatch({
        type: FORGOT_PASSWORD,
        payload: response.data,
      });
    } else {
      const errors: any = formatError(response.errorMessages || []);
      dispatch({
        type: ERRORS,
        payload: errors,
      });
    }
    dispatch({
      type: COMPLETE,
      payload: "",
    });
  };

export const forgot_password_confirm =
  (data: { activation_code: any; phone_number: string; password: string }) =>
  async (dispatch: AppDispatch) => {
    const res = await forgotPasswordConfirmQuery(data);
    const response = await checkResponse(res);
    if (response.success) {
      dispatch({
        type: FORGOT_PASSWORD_CONFIRM,
        payload: response.data,
      });
    } else {
      const errors: any = formatError(response.errorMessages || []);
      dispatch({
        type: ERRORS,
        payload: errors,
      });
    }
    dispatch({
      type: COMPLETE,
      payload: "",
    });
    return res;
  };

export const getChatToken = () => async () => {
  const res = await getChatTokenQuery();
  const response = await checkResponse(res);
  if (response.success) {
    setChatToken(response.data.token);
  }
};
