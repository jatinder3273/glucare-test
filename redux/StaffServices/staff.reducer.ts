import { GET_JOB_TITLE_LIST, GET_USER_DETAIL } from "redux/reduxTypes";

const initState: any = {
staffData:{},
jobTitles:[]
};

const staffRecord = (state = initState, action: any) => {
  switch (action.type) {
    case GET_USER_DETAIL:
      return { ...state, staffData: {data: action.payload.data, pagination: action.payload.pagination} };
      case GET_JOB_TITLE_LIST:
        return { ...state, jobTitles:action.payload};

    default:
      return state;
  }
};
export default staffRecord;
