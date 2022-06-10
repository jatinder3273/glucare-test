import axios from "axios";
import { constants } from "utils/Constants";

export const getImageFromStore = (avatar) => {
  const token = localStorage.getItem("gluportal/currentUserToken");
  return axios({
    method: "get",
    url: `${constants.apiBaseUrl}storage/${avatar}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
