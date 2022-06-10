import { refreshToken } from "redux/Auth/action";
import { checkResponse, formatError } from "utils";
import {
  internalNotificatoinListQuery,
  internalNotificatoinReadAllQuery,
  internalNotificatoinReadQuery,
  settingDisableAllQuery,
  settingEnableAllQuery,
  settingListQuery,
  updateSettingQuery,
} from "./query";

export const ERRORS = "user/errors";
export const COMPLETE = "COMPLETE";
export const SETTING_LIST = "user/setting_list";
export const UPDATE_SETTING = "user/update_setting";
export const RESET_SETTING = "user/reset_setting";
export const INTERNAL_NOTIFICATION_LIST = "user/internal_notification_list";

export const settingList = () => async (dispatch: any) => {
  const res = await settingListQuery();
  const response = await checkResponse(res);
  if (response.success) {
    dispatch({
      type: SETTING_LIST,
      payload: response,
    });
  } else if (response.code === 401) {
    dispatch(refreshToken());
    settingList();
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

export const updateSetting =
  (data: { category: string; channel_type: string; action: string }) =>
  async (dispatch: any) => {
    const res = await updateSettingQuery(data);
    const response = await checkResponse(res);
    if (response.success) {
    } else if (response.code === 401) {
      dispatch(refreshToken());
      updateSetting({
        category: data.category,
        channel_type: data.channel_type,
        action: data.action,
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

export const settingEnableAll = () => async (dispatch: any) => {
  const res = await settingEnableAllQuery();
  const response = await checkResponse(res);
  dispatch({
    type: RESET_SETTING,
  });
  dispatch(settingList());
  if (response.success) {
  } else if (response.code === 401) {
    dispatch(refreshToken());
    settingEnableAll();
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

export const settingDisableAll = () => async (dispatch: any) => {
  const res = await settingDisableAllQuery();
  const response = await checkResponse(res);
  dispatch({
    type: RESET_SETTING,
  });
  dispatch(settingList());
  if (response.success) {
  } else if (response.code === 401) {
    dispatch(refreshToken());
    settingDisableAll();
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

export const internal_notification_list =
  (data: { page_size: number; page: number }) => async (dispatch: any) => {
    const res = await internalNotificatoinListQuery(data);
    const response = await checkResponse(res);
    if (response.success) {
      dispatch({
        type: INTERNAL_NOTIFICATION_LIST,
        payload: { data: response.data, pagination: response.pagination },
      });
    } else if (response.code === 401) {
      dispatch(refreshToken());
      dispatch(
        internal_notification_list({
          page_size: data.page_size,
          page: data.page,
        })
      );
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

export const internal_notification_read =
  (data: {
    id: number;
    notificationData: {
      created: string;
      id: number;
      modified: string;
      read_at: string;
      text: string;
      title: string;
      user: number;
    }[];
    pagination: {
      count: number;
      next: boolean;
      page: number;
      page_size: number;
      previous: boolean;
      total_pages: number;
    };
  }) =>
  async (dispatch: any) => {
    const res = await internalNotificatoinReadQuery(data);
    const response = await checkResponse(res);
    if (response.success) {
      dispatch({
        type: INTERNAL_NOTIFICATION_LIST,
        payload: {
          data: data.notificationData.map(
            (notiData: {
              created: string;
              id: number;
              modified: string;
              read_at: string;
              text: string;
              title: string;
              user: number;
            }) => {
              if (notiData.id == data.id) {
                return { ...notiData, read_at: "read" };
              } else {
                return notiData;
              }
            }
          ),
          pagination: data.pagination,
        },
      });
    } else if (response.code === 401) {
      dispatch(refreshToken());
      dispatch(
        internal_notification_read({
          id: data.id,
          notificationData: data.notificationData,
          pagination: data.pagination,
        })
      );
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

export const internal_notification_read_all =
  (data: { pageSize: number }) => async (dispatch: any) => {
    const res = await internalNotificatoinReadAllQuery();
    const response = await checkResponse(res);
    if (response.success) {
      dispatch(
        internal_notification_list({
          page_size: data.pageSize,
          page: 1,
        })
      );
    } else if (response.code === 401) {
      dispatch(refreshToken());
      dispatch(internal_notification_read_all({ pageSize: data.pageSize }));
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
