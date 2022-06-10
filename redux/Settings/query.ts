import axios from "axios";
import { getCurrentUser } from "utils";
import { constants } from "utils/Constants";

export const settingListQuery = () => {
  return axios({
    method: "get",
    url: `${constants.apiBaseUrl}notification/setting/`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCurrentUser().token}`,
    },
  })
    .then((response) => response)
    .catch((err) => err.response);
};

export const updateSettingQuery = (data: {
  category: string;
  channel_type: string;
  action: string;
}) => {
  const formData = new FormData();
  formData.append("category", data.category);
  formData.append("channel_type", data.channel_type);
  formData.append("action", data.action);
  return axios({
    method: "post",
    url: `${constants.apiBaseUrl}notification/setting/`,
    data: formData,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCurrentUser().token}`,
    },
  })
    .then((response) => response)
    .catch((err) => err.response);
};

export const settingEnableAllQuery = () => {
  return axios({
    method: "put",
    url: `${constants.apiBaseUrl}notification/setting/enable/`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCurrentUser().token}`,
    },
  })
    .then((response) => response)
    .catch((err) => err.response);
};

export const settingDisableAllQuery = () => {
  return axios({
    method: "put",
    url: `${constants.apiBaseUrl}notification/setting/disable/`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCurrentUser().token}`,
    },
  })
    .then((response) => response)
    .catch((err) => err.response);
};

export const internalNotificatoinListQuery = (data: {
  page_size: number;
  page: number;
}) => {
  return axios({
    method: "get",
    url: `${constants.apiBaseUrl}notification/internal/?page_size=${data.page_size}&page=${data.page}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCurrentUser().token}`,
    },
  })
    .then((response) => response)
    .catch((err) => err.response);
};

export const internalNotificatoinReadQuery = (data: { id: number }) => {
  return axios({
    method: "put",
    url: `${constants.apiBaseUrl}notification/internal/${data.id}/read/`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCurrentUser().token}`,
    },
  })
    .then((response) => response)
    .catch((err) => err.response);
};

export const internalNotificatoinReadAllQuery = () => {
  return axios({
    method: "put",
    url: `${constants.apiBaseUrl}notification/internal/read/`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCurrentUser().token}`,
    },
  })
    .then((response) => response)
    .catch((err) => err.response);
};
