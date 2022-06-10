import { AppDispatch } from "redux/store";
import { refreshToken } from "redux/Auth/action";
import { checkResponse, formatError } from "utils";
import {
  fetchDeviceQuery,
  fetchDoctorQuery,
  fileRecordCreateQuery,
  fileRecordListQuery,
  noteCategoryListQuery,
  noteCreateQuery,
  noteListQuery,
  patientListQuery,
  patientProfileQuery,
  patientRightDataQuery,
  prescribedMedicationListQuery,
  fetchPatientWeightGraph,
  fetchPatientHeartRate,
  fetchPatientInsulin,
  testCategoriesHistoryQuery,
  testCategoriesQuery,
  testRecordCreateQuery,
  testRecordListQuery,
  fetchBloodPressureGraph,
  fetchGlucoseGraph,
  fetchFoodLogGraph,
} from "./query";
export const PATIENT_LIST = "user/patient_list";
export const PATIENT_PROFILE = "user/patient_profile";
export const RESET_PROFILE = "user/reset_profile";
export const PRESCRIBED_MEDICATION_LIST = "user/prescribed_medication_list";
export const PATIENT_RIGHT_DATA = "user/patient_right_data";
export const FETCH_DOCTOR = "user/fetch_doctor";
export const FETCH_DEVICE = "user/fetch_device";
export const SET_PATIENT_ID = "user/setPatientId";
export const NOTE_CATEGORY_LIST = "user/noteCategoryList";
export const NOTE_LIST = "user/noteList";
export const WEIGHT_DATA = "user/patient_weight";
export const BLOOD_PRESSURE_DATA = "user/bloodPressure";
export const HEART_RATE_DATA = "user/patient_heart_rate";
export const INSULIN_DATA = "user/patient_insulin";
export const FILE_RECORD_LIST = "user/fileRecordList";
export const ERRORS = "user/errors";
export const COMPLETE = "COMPLETE";
export const TEST_CATEGORIES = "user/test_categories";
export const TEST_CATEGORIES_HISTORY = "user/test_categories_history";
export const TEST_RECORD_LIST = "user/test_record_list";
export const GLUCOSE_DATA = "user/glucose";
export const FOODLOG_DATA = "user/foodLog";

export const patient_list =
  (data: { page_size: string; ordering: string; page: string }) =>
  async (dispatch: AppDispatch) => {
    const res = await patientListQuery(data);
    const response = await checkResponse(res);
    if (response.success) {
      dispatch({
        type: PATIENT_LIST,
        payload: { data: response.data, pagination: response.pagination },
      });
    } else if (response.code === 401) {
      dispatch(refreshToken());
      patient_list({
        page_size: data.page_size,
        ordering: data.ordering,
        page: data.page,
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

export const patient_profile =
  (data: { id: string }) => async (dispatch: AppDispatch) => {
    const res = await patientProfileQuery(data);
    const response = await checkResponse(res);
    if (response.success) {
      dispatch({
        type: PATIENT_PROFILE,
        payload: { data: response.data },
      });
    } else if (response.code === 401) {
      dispatch(refreshToken());
      patient_profile({ id: data.id });
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

export const prescribed_medication_list =
  (data: { id: string | string[] | undefined }) =>
  async (dispatch: AppDispatch) => {
    const res = await prescribedMedicationListQuery(data);
    const response = await checkResponse(res);
    if (response.success) {
      dispatch({
        type: PRESCRIBED_MEDICATION_LIST,
        payload: { data: response.data },
      });
    } else if (response.code === 401) {
      dispatch(refreshToken());
      prescribed_medication_list({ id: data.id });
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

export const fetch_patient_right_data =
  (data: { id: string | string[] | undefined }) =>
  async (dispatch: AppDispatch) => {
    const res = await patientRightDataQuery(data);
    const response = await checkResponse(res);
    if (response.success) {
      dispatch({
        type: PATIENT_RIGHT_DATA,
        payload: { data: response.data, id: data.id },
      });
    } else if (response.code === 401) {
      dispatch(refreshToken());
      fetch_patient_right_data({ id: data.id });
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

export const fetch_doctor =
  (data: { type: string; patient_user: string | string[] | undefined }) =>
  async (dispatch: AppDispatch) => {
    const res = await fetchDoctorQuery(data);
    const response = await checkResponse(res);
    if (response.success) {
      dispatch({
        type: FETCH_DOCTOR,
        payload: { data: response.data },
      });
    } else if (response.code === 401) {
      dispatch(refreshToken());
      fetch_doctor({ type: data.type, patient_user: data.patient_user });
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

export const reset_profile = () => async (dispatch: AppDispatch) => {
  dispatch({
    type: RESET_PROFILE,
  });
  dispatch({
    type: COMPLETE,
    payload: "",
  });
};

export const fetch_device =
  (data: { user: number }) => async (dispatch: AppDispatch) => {
    const res = await fetchDeviceQuery(data);
    const response = await checkResponse(res);
    if (response.success) {
      dispatch({
        type: FETCH_DEVICE,
        payload: { data: response.data },
      });
    } else if (response.code === 401) {
      dispatch(refreshToken());
      fetch_device({ user: data.user });
    }
  };

export const setPatientId =
  (data: { id: number }) => async (dispatch: AppDispatch) => {
    dispatch({
      type: SET_PATIENT_ID,
      payload: { data: data },
    });
  };

export const note_category_list = () => async (dispatch: AppDispatch) => {
  const res = await noteCategoryListQuery();
  const response = await checkResponse(res);
  if (response.success) {
    dispatch({
      type: NOTE_CATEGORY_LIST,
      payload: { data: response.data },
    });
  } else if (response.code === 401) {
    dispatch(refreshToken());
    note_category_list();
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

export const note_list =
  (data: {
    page_size: string;
    page: string;
    user: string;
    subject: string;
    start_datetime: string;
    end_datetime: string;
  }) =>
  async (dispatch: AppDispatch) => {
    const res = await noteListQuery(data);
    const response = await checkResponse(res);
    if (response.success) {
      dispatch({
        type: NOTE_LIST,
        payload: { data: response.data, pagination: response.pagination },
      });
    } else if (response.code === 401) {
      dispatch(refreshToken());
      note_list({
        page_size: data.page_size,
        page: data.page,
        user: data.user,
        subject: data.subject,
        start_datetime: data.start_datetime,
        end_datetime: data.end_datetime,
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

export const note_create =
  (data: { category: string; subject: string; note: string; user: string }) =>
  async (dispatch: any) => {
    const res = await noteCreateQuery(data);
    const response = await checkResponse(res);
    if (response.success) {
      return response;
    } else if (response.code === 401) {
      dispatch(refreshToken());
      note_create({
        category: data.category,
        subject: data.subject,
        note: data.note,
        user: data.user,
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

export const file_record_list =
  (data: {
    page_size: string;
    page: string;
    user: string;
    filename: string;
    start_datetime: string;
    end_datetime: string;
  }) =>
  async (dispatch: AppDispatch) => {
    const res = await fileRecordListQuery(data);
    const response = await checkResponse(res);
    if (response.success) {
      dispatch({
        type: FILE_RECORD_LIST,
        payload: { data: response.data, pagination: response.pagination },
      });
    } else if (response.code === 401) {
      dispatch(refreshToken());
      file_record_list({
        page_size: data.page_size,
        page: data.page,
        user: data.user,
        filename: data.filename,
        start_datetime: data.start_datetime,
        end_datetime: data.end_datetime,
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

export const file_record_create =
  (data: { is_showable: boolean; file: File; note: string; user: string }) =>
  async (dispatch: any) => {
    const res = await fileRecordCreateQuery(data);
    const response = await checkResponse(res);
    if (response.success) {
      return response;
    } else if (response.code === 401) {
      dispatch(refreshToken());
      file_record_create({
        is_showable: data.is_showable,
        file: data.file,
        note: data.note,
        user: data.user,
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
export const patient_weight =
  (data: {
    user: string;
    period: string;
    annotation: number;
    annotation_in_period: number;
  }) =>
  async (dispatch: AppDispatch) => {
    const res = await fetchPatientWeightGraph(data);
    const response = await checkResponse(res);
    if (response.success) {
      dispatch({
        type: WEIGHT_DATA,
        payload: response.data,
      });
    } else if (response.code === 401) {
      dispatch(refreshToken());
      patient_weight({
        user: data.user,
        period: data.period,
        annotation: data.annotation,
        annotation_in_period: data.annotation_in_period,
      });
    } else {
      const errors: any = formatError(response.errorMessages || []);
      dispatch({
        type: ERRORS,
        payload: errors,
      });
    }
  };
export const patientHeartRate =
  (data: {
    user: string;
    period: string;
    annotation: number;
    annotation_in_period: number;
  }) =>
  async (dispatch: AppDispatch) => {
    const res = await fetchPatientHeartRate(data);
    const response = await checkResponse(res);
    if (response.success) {
      dispatch({
        type: HEART_RATE_DATA,
        payload: response.data,
      });
    } else if (response.code === 401) {
      dispatch(refreshToken());
      patientHeartRate({
        user: data.user,
        period: data.period,
        annotation: data.annotation,
        annotation_in_period: data.annotation_in_period,
      });
    } else {
      const errors: any = formatError(response.errorMessages || []);
      dispatch({
        type: ERRORS,
        payload: errors,
      });
    }
  };

export const patientInsulin =
  (data: {
    user: string;
    period: string;
    annotation: number;
    annotation_in_period: number;
  }) =>
  async (dispatch: AppDispatch) => {
    const res = await fetchPatientInsulin(data);
    const response = await checkResponse(res);
    if (response.success) {
      dispatch({
        type: INSULIN_DATA,
        payload: response.data,
      });
    } else if (response.code === 401) {
      dispatch(refreshToken());
      patientHeartRate({
        user: data.user,
        period: data.period,
        annotation: data.annotation,
        annotation_in_period: data.annotation_in_period,
      });
    } else {
      const errors: any = formatError(response.errorMessages || []);
      dispatch({
        type: ERRORS,
        payload: errors,
      });
    }
  };

export const test_categories =
  (data: { user: string }) => async (dispatch: AppDispatch) => {
    const res = await testCategoriesQuery(data);
    const response = await checkResponse(res);
    if (response.success) {
      dispatch({
        type: TEST_CATEGORIES,
        payload: { data: response.data },
      });
    } else if (response.code === 401) {
      dispatch(refreshToken());
      test_categories({
        user: data.user,
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

export const test_categories_history =
  (data: {
    user: string;
    cardId: string;
    start_datetime: string;
    end_datetime: string;
  }) =>
  async (dispatch: AppDispatch) => {
    const res = await testCategoriesHistoryQuery(data);
    const response = await checkResponse(res);
    if (response.success) {
      dispatch({
        type: TEST_CATEGORIES_HISTORY,
        payload: { data: response.data },
      });
    } else if (response.code === 401) {
      dispatch(refreshToken());
      test_categories_history({
        user: data.user,
        cardId: data.cardId,
        start_datetime: data.start_datetime,
        end_datetime: data.end_datetime,
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

export const test_record_create =
  (data: {
    is_showable: boolean;
    file: File;
    description: string;
    user: string;
    data: {};
    id: string;
  }) =>
  async (dispatch: any) => {
    const res = await testRecordCreateQuery(data);
    const response = await checkResponse(res);
    if (response.success) {
      return response;
    } else if (response.code === 401) {
      dispatch(refreshToken());
      test_record_create({
        is_showable: data.is_showable,
        file: data.file,
        description: data.description,
        user: data.user,
        data: data.data,
        id: data.id,
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

export const test_record_list =
  (data: {
    page_size: string;
    page: string;
    user: string;
    search: string;
    start_datetime: string;
    end_datetime: string;
    test: string;
  }) =>
  async (dispatch: AppDispatch) => {
    const res = await testRecordListQuery(data);
    const response = await checkResponse(res);
    if (response.success) {
      dispatch({
        type: TEST_RECORD_LIST,
        payload: { data: response.data, pagination: response.pagination },
      });
    } else if (response.code === 401) {
      dispatch(refreshToken());
      test_record_list({
        page_size: data.page_size,
        page: data.page,
        user: data.user,
        search: data.search,
        start_datetime: data.start_datetime,
        end_datetime: data.end_datetime,
        test: data.test,
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
export const getBloodPressureGraph =
  (data: {
    user: string;
    period: string;
    annotation: number;
    annotation_in_period: number;
  }) =>
  async (dispatch: AppDispatch) => {
    const res = await fetchBloodPressureGraph(data);
    const response = await checkResponse(res);
    if (response.success) {
      dispatch({
        type: BLOOD_PRESSURE_DATA,
        payload: response.data,
      });
    } else if (response.code === 401) {
      dispatch(refreshToken());
      getBloodPressureGraph({
        user: data.user,
        period: data.period,
        annotation: data.annotation,
        annotation_in_period: data.annotation_in_period,
      });
    } else {
      const errors: any = formatError(response.errorMessages || []);
      dispatch({
        type: ERRORS,
        payload: errors,
      });
    }
  };

export const getGlucoseGraph =
  (data: {
    user: string;
    period: string;
    annotation: number;
    annotation_in_period: number;
  }) =>
  async (dispatch: AppDispatch) => {
    const res = await fetchGlucoseGraph(data);
    const response = await checkResponse(res);
    if (response.success) {
      dispatch({
        type: GLUCOSE_DATA,
        payload: response.data,
      });
    } else if (response.code === 401) {
      dispatch(refreshToken());
      getGlucoseGraph({
        user: data.user,
        period: data.period,
        annotation: data.annotation,
        annotation_in_period: data.annotation_in_period,
      });
    } else {
      const errors: any = formatError(response.errorMessages || []);
      dispatch({
        type: ERRORS,
        payload: errors,
      });
    }
  };

export const getFoodLogGraph =
  (data: {
    user: string;
    period: string;
    annotation: number;
    annotation_in_period: number;
  }) =>
  async (dispatch: AppDispatch) => {
    const res = await fetchFoodLogGraph(data);
    const response = await checkResponse(res);
    if (response.success) {
      dispatch({
        type: FOODLOG_DATA,
        payload: response.data,
      });
    } else if (response.code === 401) {
      dispatch(refreshToken());
      getFoodLogGraph({
        user: data.user,
        period: data.period,
        annotation: data.annotation,
        annotation_in_period: data.annotation_in_period,
      });
    } else {
      const errors: any = formatError(response.errorMessages || []);
      dispatch({
        type: ERRORS,
        payload: errors,
      });
    }
  };
