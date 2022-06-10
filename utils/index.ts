import CryptoJS from "crypto-js";
import authConfig from "./auth";
import { types } from "./Constants";
const cryptoSecret = "t6w9z$C&F)J@NcRf";
export const CHAT_API_KEY = "xzv57xss4hyh";
export function Encrypt(values: string) {
  const encJson = CryptoJS.AES.encrypt(
    JSON.stringify(values),
    cryptoSecret
  ).toString();
  const encData = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(encJson)
  );

  return encData;
}
export function Decrypt(values: string | null) {
  const decData = CryptoJS.enc.Base64.parse(
    values == null ? "" : values
  ).toString(CryptoJS.enc.Utf8);
  const bytes = CryptoJS.AES.decrypt(decData, cryptoSecret).toString(
    CryptoJS.enc.Utf8
  );

  return JSON.parse(bytes);
}

export const getCurrentUser = () => {
  const params = {
    token: localStorage.getItem(authConfig.storageTokenKeyName) || null,
    currentUser: localStorage.getItem(authConfig.storageUserKeyName)
      ? JSON.parse(Decrypt(localStorage.getItem(authConfig.storageUserKeyName)))
      : null,
  };

  return params;
};

export const setCurrentUser = (data: any) => {
  localStorage.setItem(authConfig.storageTokenKeyName, data.access);
  localStorage.setItem(authConfig.storageRefreshKeyName, data.refresh);
  const userInfo = data ? Encrypt(JSON.stringify(data)) : "";
  localStorage.setItem(authConfig.storageUserKeyName, userInfo);
};
export const setChatToken = (token: string) => {
  localStorage.setItem(authConfig.storageChatTokenKeyName, token);
};
export const getChatToken = () => {
  return localStorage.getItem(authConfig.storageChatTokenKeyName);
};
export const removeCurrentUser = () => {
  localStorage.removeItem(authConfig.storageTokenKeyName);
  localStorage.removeItem(authConfig.storageUserKeyName);
  localStorage.removeItem(authConfig.storageChatTokenKeyName);
};

export const formatError = (errorsResponse: any[]) => {
  let errors: any = {};
  Object.entries(errorsResponse).forEach(([key, value]) => {
    errors = {
      ...errors,
      [key]: value[0],
    };
  });
  return errors;
};
export const checkResponse = (response: any) => {
  let newResponse: any = {
    code: "",
    success: false,
    data: null,
    message: "",
    errorMessages: [],
    pagination: null,
  };
  try {
    const { data } = response;

    if (response.status === 200) {
      newResponse = {
        code: response.status,
        success: true,
        data: data.body || null,
        image: data || null,
        pagination: data.pagination || null,
        message: data.message,
        errorMessages: [],
      };
    } else {
      // toast(data.message, {
      //   style: {
      //     borderRadius: "10px",
      //     background: "#333",
      //     color: "#fff",
      //   },
      // });
      newResponse = {
        code: response.status,
        success: false,
        data: null,
        message: data.message,
        errorMessages: data.message,
        pagination: null,
      };
    }
  } catch (error) {
    // toast("Internal Server error, please try after sometime!", {
    //   style: {
    //     borderRadius: "10px",
    //     background: "#333",
    //     color: "#fff",
    //   },
    // });
  }

  return newResponse;
};
