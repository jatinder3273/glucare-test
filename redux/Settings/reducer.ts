import {
  COMPLETE,
  ERRORS,
  INTERNAL_NOTIFICATION_LIST,
  RESET_SETTING,
  SETTING_LIST,
} from "./action";

const initState: any = {
  success: false,
  setting_list: {},
  internal_notification_list: {},
};

const setting = (state = initState, action: any) => {
  switch (action.type) {
    case SETTING_LIST:
      return {
        ...state,
        success: true,
        setting_list: action.payload.data,
      };
    case INTERNAL_NOTIFICATION_LIST:
      return {
        ...state,
        success: true,
        internal_notification_list: {
          data: action.payload.data,
          pagination: action.payload.pagination,
        },
      };
    case RESET_SETTING:
      return {
        ...state,
        success: true,
        setting_list: {},
      };
    case ERRORS:
      return {
        ...state,
        errors: action.payload,
        success: false,
      };
    case COMPLETE:
      return { ...state };
    default:
      return state;
  }
};

export default setting;
