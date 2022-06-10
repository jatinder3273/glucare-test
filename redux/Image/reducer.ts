import { COMPLETE, ERRORS, GET_IMAGE } from "./action";

const initState: any = {
  loading: false,
  success: false,
  user: {},
  device: {},
  food: "",
  errors: {},
  lab_test_history: {},
};

const image = (state = initState, action: any) => {
  switch (action.type) {
    case GET_IMAGE:
      if (action.payload.type == "user") {
        return {
          ...state,
          success: true,
          user: {
            ...state.user,
            [action.payload.id]: `data:image/png;base64,${Buffer.from(
              action.payload.response.image,
              "binary"
            ).toString("base64")}`,
          },
        };
      }
      if (action.payload.type == "device") {
        return {
          ...state,
          success: true,
          device: {
            ...state.device,
            [action.payload.id]: `data:image/png;base64,${Buffer.from(
              action.payload.response.image,
              "binary"
            ).toString("base64")}`,
          },
        };
      }
      if (action.payload.type == "food") {
        return {
          ...state,
          success: true,
          food: `data:image/png;base64,${Buffer.from(
            action.payload.response.image,
            "binary"
          ).toString("base64")}`,
        };
      }
      if (action.payload.type == "lab_test_history") {
        return {
          ...state,
          success: true,
          lab_test_history: {
            ...state.lab_test_history,
            [action.payload.itemId]: `data:image/png;base64,${Buffer.from(
              action.payload.response.image,
              "binary"
            ).toString("base64")}`,
          },
        };
      }
    case ERRORS:
      return {
        ...state,
        errors: action.payload,
        success: false,
        loading: false,
      };
    case COMPLETE:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default image;
