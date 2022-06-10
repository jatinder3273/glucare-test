import axios from "axios";
import { getCurrentUser } from "utils";
import { constants } from "utils/Constants";

export const getImageQuery = (data: { url: string, id: string, type: string }) => {
    return axios({
      method: "get",
      url: `${constants.apiBaseUrl}storage/${data.url}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCurrentUser().token}`,
      },
      responseType: 'arraybuffer',
    })
      .then(response => response)
      .catch(err => err.response);
  };