import { refreshToken } from "redux/Auth/action";
import { checkResponse, formatError } from "utils";
import { getImageQuery } from "./query";

export const ERRORS = "user/errors";
export const COMPLETE = "COMPLETE";
export const GET_IMAGE = "user/get_image";

export const getImage =
  (data: { url: string; id: string; type: string; itemId?: number }) =>
  async (dispatch: any) => {
    const res = await getImageQuery(data);
    const response = await checkResponse(res);
    if (response.success) {
      dispatch({
        type: GET_IMAGE,
        payload: {
          response: response,
          id: data.id,
          type: data.type,
          itemId: data.itemId,
        },
      });
    } else if (response.code === 401) {
      dispatch(refreshToken());
      getImage({
        url: data.url,
        id: data.id,
        type: data.type,
        itemId: data.itemId,
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
