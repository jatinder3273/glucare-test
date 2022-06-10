import {
  COMPLETE,
  ERRORS,
  FETCH_DEVICE,
  FETCH_DOCTOR,
  FILE_RECORD_LIST,
  HEART_RATE_DATA,
  INSULIN_DATA,
  NOTE_CATEGORY_LIST,
  NOTE_LIST,
  PATIENT_LIST,
  PATIENT_PROFILE,
  PATIENT_RIGHT_DATA,
  PRESCRIBED_MEDICATION_LIST,
  RESET_PROFILE,
  SET_PATIENT_ID,
  WEIGHT_DATA,
  TEST_CATEGORIES,
  TEST_CATEGORIES_HISTORY,
  TEST_RECORD_LIST,
  BLOOD_PRESSURE_DATA,
  GLUCOSE_DATA,
  FOODLOG_DATA,
} from "./action";

const initState: any = {
  body: [],
  success: false,
  loading: false,
  profile: {},
  errors: {},
  notes: {},
  manual_data: {},
  medical_reports: {},
  test_categories: {},
  test_categories_history: {},
  test_record: {},
};

const patient = (state = initState, action: any) => {
  switch (action.type) {
    case PATIENT_LIST:
      return {
        ...state,
        success: true,
        body: action.payload.data,
        pagination: action.payload.pagination,
      };
    case PATIENT_PROFILE:
      return { ...state, success: true, profile: action.payload.data };
    case PRESCRIBED_MEDICATION_LIST:
      return {
        ...state,
        success: true,
        profile: {
          ...state.profile,
          prescribed_medication_list: action.payload.data,
        },
      };
    case PATIENT_RIGHT_DATA:
      return {
        ...state,
        success: true,
        profile: {
          ...state.profile,
          patient_right_data: { [action.payload.id]: action.payload.data },
        },
      };
    case FETCH_DOCTOR:
      if (action.payload.data.length == 0) {
        return { ...state, success: true, profile: { ...state.profile } };
      } else {
        return {
          ...state,
          success: true,
          profile: {
            ...state.profile,
            fetch_doctor: {
              [action.payload.data[0].patient_user]: action.payload.data[0],
            },
          },
        };
      }
    case FETCH_DEVICE:
      return {
        ...state,
        success: true,
        profile: { ...state.profile, fetch_device: action.payload.data },
      };
    case RESET_PROFILE:
      return {
        ...state,
        success: true,
        profile: {},
        notes: {},
        medical_reports: {},
        test_categories: {},
        test_categories_history: {},
        test_record: {},
      };
    case SET_PATIENT_ID:
      return {
        ...state,
        success: true,
        profile: { ...state.profile, id: action.payload.data.id },
      };
    case NOTE_CATEGORY_LIST:
      return {
        ...state,
        success: true,
        notes: { ...state.notes, notes_category_list: [action.payload.data] },
      };
    case NOTE_LIST:
      return {
        ...state,
        success: true,
        notes: {
          ...state.notes,
          notes_list: [action.payload.data],
          pagination: [action.payload.pagination],
        },
      };
    case WEIGHT_DATA:
      return {
        ...state,
        success: true,
        manual_data: action.payload,
      };
    case BLOOD_PRESSURE_DATA:
      return {
        ...state,
        success: true,
        bloodPressureData: action.payload,
      };
    case GLUCOSE_DATA:
      return {
        ...state,
        success: true,
        glucoseData: action.payload,
      };
    case FOODLOG_DATA:
      return {
        ...state,
        success: true,
        foodLogData: action.payload,
      };
    case HEART_RATE_DATA:
      return {
        ...state,
        success: true,
        heartRateData: action.payload,
      };
    case INSULIN_DATA:
      return {
        ...state,
        success: true,
        insulinData: action.payload,
      };
    case FILE_RECORD_LIST:
      return {
        ...state,
        success: true,
        medical_reports: {
          ...state.medical_reports,
          medical_reports_list: [action.payload.data],
          pagination: [action.payload.pagination],
        },
      };
    case TEST_CATEGORIES:
      return {
        ...state,
        success: true,
        test_categories: {
          ...state.test_categories,
          test_categories_list: action.payload.data,
        },
      };
    case TEST_CATEGORIES_HISTORY:
      return {
        ...state,
        success: true,
        test_categories_history: {
          ...state.test_categories_history,
          test_categories_history_list: action.payload.data,
        },
      };
    case ERRORS:
      return {
        ...state,
        errors: action.payload,
        success: false,
        loading: false,
      };
    case COMPLETE:
      return { ...state, loading: false };
    case TEST_RECORD_LIST:
      return {
        ...state,
        success: true,
        test_record: {
          ...state.test_record,
          test_record_list: action.payload.data,
          pagination: action.payload.pagination,
        },
      };
    default:
      return state;
  }
};

export default patient;
