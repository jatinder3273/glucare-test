/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import React, { useEffect, useState } from "react";
import styles from "./MedicalReports.module.scss";
import ProfileTabs from "@components/PagesComponent/PatientProfile/ProfileTabs/ProfileTabs";
import DashboardLayout from "@components/Layouts/DashboardLayout";
import ReportDetailPage from "@components/PagesComponent/PatientProfile/ProfileMedical/ReportDetailPage";
import { CalendarIcon, SearchIcon } from "@components/Common/Icons/common";
import { MedicalIcon, UploadIcon } from "@components/Common/Icons/Icons";
import ModalLayout from "@components/Layouts/ModalLayout";
import UploadReport from "@components/PagesComponent/PatientProfile/ProfileMedical/UploadReport";
import CalendarRangeFilter from "@components/PagesComponent/PatientProfile/CalendarRangeFilter";
import { useToggle } from "rooks";
import { file_record_list, patient_profile } from "redux/Patient/action";
import { useDispatch, useSelector } from "react-redux";
import { addDays, subDays } from "date-fns";
import moment from "moment";
import _ from "lodash";
import { Spinner } from "react-bootstrap";
import Pagination from "@components/Common/Pagination/Pagination";
import { AppDispatch } from "redux/store";

interface objectType {
  startDate: Date;
  endDate: Date;
  key: string;
}

interface medicalListType {
  created: string;
  data_source: string;
  file: string;
  id: number;
  is_showable: boolean;
  modified: string;
  note: string;
  range: null | string;
  read_at: null | string;
  recorded_at: string;
  user: number;
}

interface medicalReportsListDataType {
  date: string;
  report: medicalListType[];
}

function MedicalReports() {
  const dispatch = useDispatch<AppDispatch>();
  const profileData = useSelector((state: any) => state.patient.profile);
  const [calendarModal, setCalendarModal] = useToggle(false);
  const [uploadReportModal, setUploadReportModal] = useState(false);
  const [reportDetailPage, setReportDetailPage] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState<any>();
  const [currentPage, setCurrentPage] = useState(
    pagination != undefined ? pagination.page : 1
  );
  const [pageSize, setPageSize] = useState(
    pagination != undefined ? pagination.page_size : 10
  );
  const [showDateRange, setShowDateRange] = useState(false);
  const [hitApi, setHitApi] = useState(false);

  const medicalReportsData = useSelector(
    (state: any) => state.patient.medical_reports
  );
  const [medicalReportsList, setMedicalReportsList] =
    useState<medicalListType[]>();
  const [medicalReportsListData, setMedicalReportsListData] =
    useState<medicalReportsListDataType[]>();

  const toggleHitApi = () => {
    setHitApi(!hitApi);
  };

  const toggleUploadReportModal = () => {
    setUploadReportModal(!uploadReportModal);
  };
  const closeReportDetail = () => {
    setReportDetailPage(false);
  };

  const toggleCalendarModal = () => {
    setCalendarModal(!calendarModal);
  };

  useEffect(() => {
    dispatch(
      patient_profile({
        id: localStorage.getItem("patientId") || "",
      })
    );
  }, []);

  useEffect(() => {
    if (medicalReportsData.medical_reports_list != undefined) {
      setMedicalReportsList(medicalReportsData.medical_reports_list[0]);
    }
    if (medicalReportsData.pagination != undefined) {
      setPagination(medicalReportsData.pagination[0]);
    }
  }, [medicalReportsData]);

  useEffect(() => {
    if (medicalReportsList != undefined) {
      setMedicalReportsListData(
        _.chain(medicalReportsList)
          .groupBy((data) => moment(data.created).format("D MMM YYYY"))
          .map((value, key) => ({
            date: moment(key).format("D MMM YYYY"),
            report: value,
          }))
          .value()
      );
    }
  }, [medicalReportsList]);

  const handleChange = (e: { target: { value: string } }) => {
    setSearchText(e.target.value);
    dispatch(
      file_record_list({
        user: localStorage.getItem("userId") || "",
        filename: e.target.value,
        start_datetime: "",
        end_datetime: "",
        page_size: pageSize,
        page: (1).toString(),
      })
    );
    if (e.target.value == "") {
      setCurrentPage(1);
    }
    setShowDateRange(false);
  };

  const [state, setState] = useState<objectType[]>([
    {
      startDate: subDays(new Date(), 7),
      endDate: addDays(new Date(), 1),
      key: "selection",
    },
  ]);

  useEffect(() => {
    dispatch(
      file_record_list({
        user: localStorage.getItem("userId") || "",
        filename: searchText,
        start_datetime: "",
        end_datetime: "",
        page_size: pageSize,
        page: currentPage,
      })
    );
    setShowDateRange(false);
  }, [pageSize, currentPage, hitApi]);

  return (
    <>
      <DashboardLayout
        HeaderSubTitle={`${
          profileData.first_name != undefined ? profileData.first_name : ""
        } ${profileData.last_name != undefined ? profileData.last_name : ""}`}
        hideBorder
        profilePage
      >
        <ProfileTabs tabType="medicalReports" />
        {reportDetailPage ? (
          <>
            <ReportDetailPage closeReportDetail={closeReportDetail} />
          </>
        ) : (
          <div className={styles.medicalReportsPage}>
            <div className={styles.medicalSearch}>
              <div className="searchBar">
                <span className="searchIcon">
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchText}
                  onChange={handleChange}
                />
              </div>
              <button
                type="button"
                className="btn outline iconBtn ms-3"
                onClick={setCalendarModal}
              >
                <span>
                  <CalendarIcon />
                </span>
              </button>
              <button
                className="btn filled ms-3"
                type="button"
                onClick={toggleUploadReportModal}
              >
                <span className="btnIcon">
                  <UploadIcon />
                </span>
                Upload report
              </button>
            </div>
            {showDateRange && (
              <div className={styles.dateFilterText}>
                {`${moment(state[0].startDate).format("D MMM YYYY")} - ${moment(
                  state[0].endDate
                ).format("D MMM YYYY")}`}
              </div>
            )}
            {medicalReportsListData != undefined ? (
              medicalReportsListData.length != 0 ? (
                medicalReportsListData.map(
                  (item: medicalReportsListDataType) => (
                    <div className={styles.medicalSingle_day} key={item.date}>
                      <div className={styles.medicalSingle_date}>
                        {item.date}
                      </div>
                      <div className={styles.medicalCardsWrap}>
                        {item.report.map((card: medicalListType) => (
                          <div
                            className={styles.medicalCardsSingle}
                            key={card.id}
                          >
                            <div
                              className={`theme_border ${styles.medicalCard}`}
                              onClick={() => setReportDetailPage(true)}
                            >
                              <div className={styles.cardIcon}>
                                <MedicalIcon />
                              </div>
                              <div className={styles.cardContent}>
                                <h5>
                                  {card.file.substring(
                                    card.file.lastIndexOf("/") + 1,
                                    card.file.length
                                  )}
                                </h5>
                                <p>{`Data taken: ${moment(card.created).format(
                                  "D MMM YYYY"
                                )}`}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )
              ) : (
                <h5 className={styles.ceterData}>No Data Found</h5>
              )
            ) : (
              <div className={styles.ceterData}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden text-center">
                    Loading...
                  </span>
                </Spinner>
              </div>
            )}
            {medicalReportsListData != undefined &&
              medicalReportsListData.length != 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalCount={pagination != undefined ? pagination.count : 1}
                  pageSize={pageSize}
                  siblingCount={1}
                  setCurrentPage={setCurrentPage}
                  setPageSize={setPageSize}
                />
              )}
            <ModalLayout
              openModal={calendarModal}
              toggleModal={setCalendarModal}
              title="Select date"
              isCalendarPopup
            >
              <CalendarRangeFilter state={state} setState={setState} />
              <div className="py-4">
                <button
                  type="button"
                  className="btn filled me-3"
                  onClick={() => {
                    toggleCalendarModal();
                    setShowDateRange(true);
                    dispatch(
                      file_record_list({
                        user: localStorage.getItem("userId") || "",
                        filename: searchText,
                        start_datetime: moment(state[0].startDate).format(
                          "YYYY-MM-D"
                        ),
                        end_datetime: moment(state[0].endDate).format(
                          "YYYY-MM-D"
                        ),
                        page_size: pageSize,
                        page: (1).toString(),
                      })
                    );
                  }}
                >
                  Apply
                </button>
                <button
                  type="button"
                  className="btn outline"
                  onClick={setCalendarModal}
                >
                  Cancel
                </button>
              </div>
            </ModalLayout>
            <ModalLayout
              openModal={uploadReportModal}
              toggleModal={toggleUploadReportModal}
              title="Upload reports"
            >
              <UploadReport
                toggleUploadReportModal={toggleUploadReportModal}
                toggleHitApi={toggleHitApi}
              />
            </ModalLayout>
          </div>
        )}
      </DashboardLayout>
    </>
  );
}

export default MedicalReports;
