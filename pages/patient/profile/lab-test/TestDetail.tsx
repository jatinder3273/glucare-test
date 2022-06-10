/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import styles from "./TestDetail.module.scss";
import useTranslation from "next-translate/useTranslation";
import CalendarRangeFilter from "@components/PagesComponent/PatientProfile/CalendarRangeFilter";
import LabTestTables from "@components/PagesComponent/PatientProfile/ProfileLabTest/LabTestDetailTable";
import TestDetailGraph from "@components/PagesComponent/PatientProfile/ProfileLabTest/LabTestDetailGraph";
import { CalendarIcon, SearchIcon } from "@components/Common/Icons/common";
import {
  GraphIcon,
  PreIcon,
  TableIcon,
  UploadIcon,
} from "@components/Common/Icons/Icons";
import ModalLayout from "@components/Layouts/ModalLayout";
import AddLabTestModal from "@components/PagesComponent/PatientProfile/ProfileLabTest/AddLabTestModal";
import DrawerLayout from "@components/Layouts/DrawerLayout";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "redux/store";
import { test_categories_history } from "redux/Patient/action";
import { addDays, subDays } from "date-fns";
import moment from "moment";
interface IProps {
  toggleDetailPage: any;
  cardId: number | undefined;
}

interface testDataType {
  date: string;
  tests: [];
}

interface objectType {
  startDate: Date;
  endDate: Date;
  key: string;
}

function TestDetail({ toggleDetailPage, cardId }: IProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("profile");
  const [calendarModal, setCalendarModal] = useState(false);
  const [addTestModal, setAddTestModal] = useState(false);
  const [graph, setGraph] = useState(false);
  const testHistoryData = useSelector(
    (state: any) => state.patient.test_categories_history
  );
  const [testData, setTestData] = useState<testDataType>();
  const [state, setState] = useState<objectType[]>([
    {
      startDate: subDays(new Date(), 7),
      endDate: addDays(new Date(), 1),
      key: "selection",
    },
  ]);
  const [searchTxt, setSearchTxt] = useState("");

  const toggleCalendarModal = () => {
    setCalendarModal(!calendarModal);
  };
  const toggleAddTestModal = () => {
    setAddTestModal(!addTestModal);
  };

  useEffect(() => {
    if (testHistoryData.test_categories_history_list != undefined) {
      setTestData(testHistoryData.test_categories_history_list);
    }
  }, [testHistoryData]);

  useEffect(() => {
    dispatch(
      test_categories_history({
        user: localStorage.getItem("userId") || "",
        start_datetime: "",
        end_datetime: "",
        cardId: cardId?.toString() || "",
      })
    );
  }, []);

  return (
    <div className={styles.labDetail_page}>
      <div className={styles.labTest_back}>
        <button
          type="button"
          className="btn"
          onClick={() => toggleDetailPage(false)}
        >
          <PreIcon />
          Back to list
        </button>
      </div>
      <div className={styles.labSearch}>
        <div className="searchBar">
          <span className="searchIcon">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setSearchTxt(e.target.value)}
          />
        </div>
        <div className={styles.labSearch_btnWrap}>
          <div className="btnToggleGroup ms-3">
            <button
              type="button"
              className={`btn ${graph ? "" : "show"}`}
              onClick={() => {
                setGraph(false);
              }}
            >
              <span>
                <TableIcon />
              </span>
            </button>
            <button
              type="button"
              className={`btn ${graph ? "show" : ""}`}
              onClick={() => {
                setGraph(true);
              }}
            >
              <span>
                <GraphIcon />
              </span>
            </button>
          </div>
          <button
            type="button"
            className="btn outline iconBtn ms-3"
            onClick={toggleCalendarModal}
          >
            <span>
              <CalendarIcon />
            </span>
          </button>

          <button
            className="btn filled ms-3"
            type="button"
            onClick={toggleAddTestModal}
          >
            <span className="btnIcon">
              <UploadIcon />
            </span>
            {t("Add_test")}
          </button>
        </div>
      </div>
      {graph ? (
        <TestDetailGraph />
      ) : (
        <LabTestTables testData={testData} searchTxt={searchTxt} />
      )}

      <ModalLayout
        openModal={calendarModal}
        toggleModal={toggleCalendarModal}
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
              dispatch(
                test_categories_history({
                  user: localStorage.getItem("userId") || "",
                  start_datetime: moment(state[0].startDate).format(
                    "YYYY-MM-D"
                  ),
                  end_datetime: moment(state[0].endDate)
                    .add(1, "days")
                    .format("YYYY-MM-D"),
                  cardId: cardId?.toString() || "",
                })
              );
            }}
          >
            Apply
          </button>
          <button
            type="button"
            className="btn outline"
            onClick={toggleCalendarModal}
          >
            Cancel
          </button>
        </div>
      </ModalLayout>
      <DrawerLayout
        toggleSidebar={toggleAddTestModal}
        openSidebar={addTestModal}
        title="Add lab test"
      >
        <AddLabTestModal toggleAddLabTestModal={toggleAddTestModal} />
      </DrawerLayout>
    </div>
  );
}

export default TestDetail;
