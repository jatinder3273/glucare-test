import axios from "axios";
import { getCurrentUser } from "utils";
import { constants } from "utils/Constants";

export const getStaffList = (data: { page_size: string, page: string, search: string }) => {
  return axios({
    method: "get",
    url: `${constants.apiBaseUrl}account/staff/?page_size=${data.page_size}&page=${data.page}&search=${data.search}`,
    headers: { "Authorization": `Bearer ${getCurrentUser().token}` }
  })
    .then((response) => response)
    .catch((err) => err.response);
};

export const getJobTitleList = () => {
  const token = localStorage.getItem("gluportal/currentUserToken");
  return axios({
    method: "get",
    url: `${constants.apiBaseUrl}account/staff/job-title/`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response)
    .catch((err) => err.response);
};

export const addStaff = (data: object) => {
  const token = localStorage.getItem("gluportal/currentUserToken");
  return axios({
    method: "post",
    url: `${constants.apiBaseUrl}account/invite/staff/`,
    data: data,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
