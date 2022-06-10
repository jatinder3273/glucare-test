import axios from "axios";
import { constants, types } from "utils/Constants";
import { getCurrentUser } from "utils";

export const patientListQuery = (data: {
  page_size: string;
  ordering: string;
  page: string;
}) => {
  return axios({
    method: "post",
    url: `${constants.apiBaseUrl}account/patient/?page_size=${data.page_size}&ordering=${data.ordering}&page=${data.page}`,
    headers: { Authorization: `Bearer ${getCurrentUser().token}` },
  })
    .then((response) => response)
    .catch((err) => err.response);
};

export const patientProfileQuery = (data: {
  id: string | string[] | undefined;
}) => {
  return axios({
    method: "get",
    url: `${constants.apiBaseUrl}account/profile/patient/${data.id}`,
    headers: { Authorization: `Bearer ${getCurrentUser().token}` },
  })
    .then((response) => response)
    .catch((err) => err.response);
};
export const prescribedMedicationListQuery = (data: {
  id: string | string[] | undefined;
}) => {
  return axios({
    method: "get",
    url: `${constants.apiBaseUrl}data/medication/prescribed/?user=${data.id}`,
    headers: { Authorization: `Bearer ${getCurrentUser().token}` },
  })
    .then((response) => response)
    .catch((err) => err.response);
};
export const patientRightDataQuery = (data: {
  id: string | string[] | undefined;
}) => {
  return axios({
    method: "get",
    url: `${constants.apiBaseUrl}data/latest/${data.id}`,
    headers: { Authorization: `Bearer ${getCurrentUser().token}` },
  })
    .then((response) => response)
    .catch((err) => err.response);
};
export const fetchDoctorQuery = (data: {
  type: string;
  patient_user: string | string[] | undefined;
}) => {
  return axios({
    method: "get",
    url: `${constants.apiBaseUrl}account/staff/assignee/?type=${data.type}&patient_user=${data.patient_user}`,
    headers: { Authorization: `Bearer ${getCurrentUser().token}` },
  })
    .then((response) => response)
    .catch((err) => err.response);
};
export const noteCategoryListQuery = () => {
  return axios({
    method: "get",
    url: `${constants.apiBaseUrl}data/note/category/`,
    headers: { Authorization: `Bearer ${getCurrentUser().token}` },
  })
    .then((response) => response)
    .catch((err) => err.response);
};
export const noteListQuery = (data: {
  page_size: string;
  page: string;
  user: string;
  subject: string;
  start_datetime: string;
  end_datetime: string;
}) => {
  return axios({
    method: "get",
    url: `${constants.apiBaseUrl}data/note/?page_size=${data.page_size}&page=${data.page}&start_datetime=${data.start_datetime}&end_datetime=${data.end_datetime}&category=&subject=${data.subject}&note=&user=${data.user}`,
    headers: { Authorization: `Bearer ${getCurrentUser().token}` },
  })
    .then((response) => response)
    .catch((err) => err.response);
};

export const noteCreateQuery = (data: {
  category: string;
  subject: string;
  note: string;
  user: string;
}) => {
  const formData = new FormData();
  formData.append("category", data.category);
  formData.append("subject", data.subject);
  formData.append("note", data.note);
  formData.append("user", data.user);
  return axios({
    method: "post",
    url: `${constants.apiBaseUrl}data/note/`,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${getCurrentUser().token}`,
    },
  })
    .then((response) => response)
    .catch((err) => err.response);
};
export const fetchDeviceQuery = (data: { user: number }) => {
  return axios({
    method: "get",
    url: `${constants.apiBaseUrl}data/device/owned/?user=${data.user}`,
    headers: { Authorization: `Bearer ${getCurrentUser().token}` },
  })
    .then((response) => response)
    .catch((err) => err.response);
};

export const fileRecordListQuery = (data: {
  page_size: string;
  page: string;
  user: string;
  filename: string;
  start_datetime: string;
  end_datetime: string;
}) => {
  return axios({
    method: "get",
    url: `${constants.apiBaseUrl}data/file/record/?page_size=${data.page_size}&page=${data.page}&start_datetime=${data.start_datetime}&end_datetime=${data.end_datetime}&filename=${data.filename}&user=${data.user}`,
    headers: { Authorization: `Bearer ${getCurrentUser().token}` },
  })
    .then((response) => response)
    .catch((err) => err.response);
};
export const fetchPatientWeightGraph = (data: {
  user: string;
  period: string;
  annotation: number;
  annotation_in_period: number;
}) => {
  const type = types.weight;
  return axios({
    method: "get",
    url: `${constants.apiBaseUrl}data/manual/${type}/chart`,
    headers: { Authorization: `Bearer ${getCurrentUser().token}` },
    params: data,
  })
    .then((response) => response)
    .catch((err) => err.response);
};
export const fetchPatientHeartRate = (data: {
  user: string;
  period: string;
  annotation: number;
  annotation_in_period: number;
}) => {
  const type = types.heartRate;
  return axios({
    method: "get",
    url: `${constants.apiBaseUrl}data/device/${type}/chart/heart_rate`,
    headers: { Authorization: `Bearer ${getCurrentUser().token}` },
    params: data,
  })
    .then((response) => response)
    .catch((err) => err.response);
};
export const fetchPatientInsulin = (data: {
  user: string;
  period: string;
  annotation: number;
  annotation_in_period: number;
}) => {
  const type = types.insulin;
  return axios({
    method: "get",
    url: `${constants.apiBaseUrl}data/medication/${type}/chart`,
    headers: { Authorization: `Bearer ${getCurrentUser().token}` },
    params: data,
  })
    .then((response) => response)
    .catch((err) => err.response);
};
export const fileRecordCreateQuery = (data: {
  is_showable: boolean;
  file: File;
  note: string;
  user: string;
}) => {
  const formData = new FormData();
  formData.append("is_showable", JSON.stringify(data.is_showable));
  formData.append("file", data.file);
  formData.append("note", data.note);
  formData.append("user", data.user);
  return axios({
    method: "post",
    url: `${constants.apiBaseUrl}data/file/record/`,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${getCurrentUser().token}`,
    },
  });
};

export const testCategoriesQuery = (data: { user: string }) => {
  return axios({
    method: "get",
    url: `${constants.apiBaseUrl}data/test/category/?user=${data.user}`,
    headers: { Authorization: `Bearer ${getCurrentUser().token}` },
  })
    .then((response) => response)
    .catch((err) => err.response);
};

export const testCategoriesHistoryQuery = (data: {
  user: string;
  cardId: string;
  start_datetime: string;
  end_datetime: string;
}) => {
  return axios({
    method: "get",
    url: `${constants.apiBaseUrl}data/test/category/${data.cardId}/?start_datetime=${data.start_datetime}&end_datetime=${data.end_datetime}&user=${data.user}`,
    headers: { Authorization: `Bearer ${getCurrentUser().token}` },
  })
    .then((response) => response)
    .catch((err) => err.response);
};

export const testRecordCreateQuery = (data: {
  is_showable: boolean;
  file: File;
  description: string;
  user: string;
  data: object;
  id: string;
}) => {
  const formData = new FormData();
  formData.append("is_showable", JSON.stringify(data.is_showable));
  formData.append("file", data.file);
  formData.append("description", data.description);
  formData.append("user", data.user);
  formData.append("data", JSON.stringify(data.data));
  return axios({
    method: "post",
    url: `${constants.apiBaseUrl}data/test/${data.id}/record/`,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${getCurrentUser().token}`,
    },
  })
    .then((response) => response)
    .catch((err) => err.response);
};

export const testRecordListQuery = (data: {
  page_size: string;
  page: string;
  user: string;
  search: string;
  start_datetime: string;
  end_datetime: string;
  test: string;
}) => {
  return axios({
    method: "get",
    url: `${constants.apiBaseUrl}data/test/record/?user=${data.user}&search=${data.search}&page=${data.page}&page_size=${data.page_size}&start_datetime=${data.start_datetime}&test=${data.test}&end_datetime=${data.end_datetime}`,
    headers: { Authorization: `Bearer ${getCurrentUser().token}` },
  })
    .then((response) => response)
    .catch((err) => err.response);
};
export const fetchBloodPressureGraph = (data: {
  user: string;
  period: string;
  annotation: number;
  annotation_in_period: number;
}) => {
  const type = types.bloodPressure;

  return axios({
    method: "get",
    url: `${constants.apiBaseUrl}data/manual/${type}/chart`,
    headers: { Authorization: `Bearer ${getCurrentUser().token}` },
    params: data,
  })
    .then((response) => response)
    .catch((err) => err.response);
};
export const fetchGlucoseGraph = (data: {
  user: string;
  period: string;
  annotation: number;
  annotation_in_period: number;
}) => {
  const type = types.glucose;

  return axios({
    method: "get",
    url: `${constants.apiBaseUrl}data/device/${type}/chart/glucose`,
    headers: { Authorization: `Bearer ${getCurrentUser().token}` },
    params: data,
  })
    .then((response) => response)
    .catch((err) => err.response);
};
export const fetchFoodLogGraph = (data: {
  user: string;
  period: string;
  annotation: number;
  annotation_in_period: number;
}) => {
  const type = types.foodLog;

  return axios({
    method: "get",
    url: `${constants.apiBaseUrl}data/food/record`,
    headers: { Authorization: `Bearer ${getCurrentUser().token}` },
    params: data,
  })
    .then((response) => response)
    .catch((err) => err.response);
};
