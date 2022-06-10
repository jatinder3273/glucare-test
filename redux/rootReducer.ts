import { combineReducers } from "redux";
import auth from "./Auth/reducer";
import staffRecord from "./StaffServices/staff.reducer";
import image from "./Image/reducer";
import patient from "./Patient/reducer";
import setting from "./Settings/reducer";

const rootReducer = combineReducers({
  auth,
  staffRecord,
  image,
  patient,
  setting,
});

// const rootReducer = (state: {auth: {}, image: {}, patient: {}, staffRecord: {}} | undefined, action: {type:string, payload: any}) => {
//   if (action.type === "USER_LOGOUT" || action.type === "REFRESH_STATE") {
//     state = undefined;
//   }
//   return appReducer(state, action);
// };

export default rootReducer;
