import axios from "axios";
import { getCurrentUser } from "utils";
import { constants } from "utils/Constants";

export const loginQuery = (data: {
  phone_number: string;
  password: string;
}) => {
  const formData = new FormData();
  formData.append("phone_number", data.phone_number);
  formData.append("password", data.password);
  return axios({
    method: "post",
    url: `${constants.apiBaseUrl}account/login/`,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then((response) => response)
    .catch((err) => err.response);
};

export const sentOtpToPhoneNumberQuery = (data: { phone_number: string }) => {
  const formData = new FormData();
  formData.append("phone_number", data.phone_number);
  return axios({
    method: "post",
    url: `${constants.apiBaseUrl}account/register/`,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then((response) => response)
    .catch((err) => err.response);
};

export const registerQuery = (data: {
  activation_code: string;
  phone_number: string;
  password: string;
}) => {
  const formData = new FormData();
  formData.append("phone_number", data.phone_number);
  formData.append("password", data.password);
  formData.append("activation_code", data.activation_code);
  return axios({
    method: "post",
    url: `${constants.apiBaseUrl}account/register/confirm/`,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then((response) => response)
    .catch((err) => err.response);
};
export const verifyOtpQuery = (data: {
  activation_code: any;
  phone_number: string;
}) => {
  const formData = new FormData();
  formData.append("phone_number", data.phone_number);
  formData.append("activation_code", data.activation_code);
  return axios({
    method: "post",
    url: `${constants.apiBaseUrl}account/otp/confirm/`,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then((response) => response)
    .catch((err) => err.response);
};

export const sentOtpToPhoneNumberLoginQuery = (data: {
  phone_number: string;
}) => {
  const formData = new FormData();
  formData.append("phone_number", data.phone_number);
  return axios({
    method: "post",
    url: `${constants.apiBaseUrl}account/otp/`,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then((response) => response)
    .catch((err) => err.response);
};

export const changePassword = (data: any) => {
  const token = localStorage.getItem("gluportal/currentUserToken");
  return axios({
    method: "post",
    url: `${constants.apiBaseUrl}account/change-password/`,
    data: data,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response)
    .catch((err) => err.response);
};

export const updateProfile = (data: any) => {
  const token = localStorage.getItem("gluportal/currentUserToken");
  const formData = new FormData();
  formData.append("first_name", data.first_name);
  formData.append("last_name", data.last_name);
  formData.append("gender", data.gender);
  formData.append("role", data.role);
  formData.append("job_title", data.job_title);
  formData.append("avatar", data.avatar);
  return axios({
    method: "patch",
    url: `${constants.apiBaseUrl}account/profile/`,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response)
    .catch((err) => err.response);
};

export const getUserProfile = () => {
  const token = localStorage.getItem("gluportal/currentUserToken");
  return axios({
    method: "get",
    url: `${constants.apiBaseUrl}account/profile/`,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response)
    .catch((err) => err.response);
};

export const refreshTokenApi = () => {
  let token = localStorage.getItem("gluportal/refreshToken");
  return axios({
    method: "post",
    url: `${constants.apiBaseUrl}account/refresh/`,
    data: { refresh: token },
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response)
    .catch((err) => err.response);
};

export const forgotPasswordQuery = (data: { phone_number: string }) => {
  const formData = new FormData();
  formData.append("phone_number", data.phone_number);
  return axios({
    method: "post",
    url: `${constants.apiBaseUrl}account/forgot-password/`,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then((response) => response)
    .catch((err) => err.response);
};
export const logoutApi = () => {
  let token = localStorage.getItem("gluportal/refreshToken");
  const currentToken = localStorage.getItem("gluportal/currentUserToken");
  return axios({
    method: "post",
    url: `${constants.apiBaseUrl}account/logout/`,
    data: { refresh: token },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${currentToken}`,
    },
  })
    .then((response) => response)
    .catch((err) => err.response);
};

export const getProfileQuery = () => {
  return axios({
    method: "get",
    url: `${constants.apiBaseUrl}account/profile/`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCurrentUser().token}`,
    },
  })
    .then((response) => response)
    .catch((err) => err.response);
};

export const forgotPasswordConfirmQuery = (data: {
  activation_code: string;
  phone_number: string;
  password: string;
}) => {
  const formData = new FormData();
  formData.append("phone_number", localStorage.getItem("phoneNumber") || "");
  formData.append("password", data.password);
  formData.append("activation_code", data.activation_code);
  return axios({
    method: "post",
    url: `${constants.apiBaseUrl}account/forgot-password/confirm/`,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then((response) => response)
    .catch((err) => err.response);
};

export const getChatTokenQuery = () => {
  return axios({
    method: "get",
    url: `${constants.apiBaseUrl}chat/token/`,
    headers: { Authorization: `Bearer ${getCurrentUser().token}` },
  })
    .then((response) => response)
    .catch((err) => err.response);
};
