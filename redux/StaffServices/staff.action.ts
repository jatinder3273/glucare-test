import { refreshToken } from "redux/Auth/action";
import { addStaff, getJobTitleList, getStaffList } from "redux/StaffServices/staffApiServices";
import { AppDispatch } from "redux/store";
import { checkResponse } from "utils";
import {GET_JOB_TITLE_LIST, GET_USER_DETAIL} from '../reduxTypes';

export const getStaffRecord = (data: { page_size: string, page: string, search: string }) => async (dispatch: AppDispatch) => {
    const res = await getStaffList(data);
    const response = await checkResponse(res);
    if (response.success) {
      dispatch({
        type: GET_USER_DETAIL,
        payload: {data: response.data, pagination: response.pagination}
      });
    } else if(response.code === 401){
      dispatch(refreshToken());
      getStaffRecord({page_size: data.page_size, page: data.page, search: data.search});
    }
  };

  export const jobTitleList = () => async (dispatch: AppDispatch) => {
    const res = await getJobTitleList();
    const response = await checkResponse(res);
    
    if (response.success) {
      dispatch({
        type: GET_JOB_TITLE_LIST,
        payload: res.data.body
      });
    } else if(response.code === 401){
      dispatch(refreshToken());
      jobTitleList();
    }
  };

  export const addStaffAction = (values:any) => async (dispatch: AppDispatch) => {
    const res = await addStaff(values);
    return res;
  };

