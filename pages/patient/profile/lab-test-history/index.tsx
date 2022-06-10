/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import styles from "./labTestHistory.module.scss";
import ProfileTabs from "@components/PagesComponent/PatientProfile/ProfileTabs/ProfileTabs";
import DashboardLayout from "@components/Layouts/DashboardLayout";
import useTranslation from "next-translate/useTranslation";
import CalendarRangeFilter from "@components/PagesComponent/PatientProfile/CalendarRangeFilter";
import {
  CalendarIcon,
  PdfIcon,
  SearchIcon,
} from "@components/Common/Icons/common";
import {
  FilterIcon,
  OptionIcon,
  UploadIcon,
} from "@components/Common/Icons/Icons";
import ModalLayout from "@components/Layouts/ModalLayout";
import AddLabTestModal from "@components/PagesComponent/PatientProfile/ProfileLabTest/AddLabTestModal";
import { Dropdown, Form, Table } from "react-bootstrap";
import DrawerLayout from "@components/Layouts/DrawerLayout";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "redux/store";
import { test_categories, test_record_list } from "redux/Patient/action";
import { addDays, subDays } from "date-fns";
import { Spinner } from "react-bootstrap";
import Pagination from "@components/Common/Pagination/Pagination";
import moment from "moment";
import { getImage } from "redux/Image/action";

interface objectType {
  startDate: Date;
  endDate: Date;
  key: string;
}

interface recordListType {
  created: string;
  data: { [key: string]: number[] };
  data_change: {};
  data_source: string;
  description: string;
  fields_range: string;
  file: {
    created: string;
    data_source: string;
    file: string;
    id: number;
    is_showable: boolean;
    modified: string;
    note: string;
    range: string;
    read_at: string;
    recorded_at: string;
    user: number;
  };
  id: number;
  is_showable: boolean;
  modified: string;
  range: null | string;
  recorded_at: string;
  test: {
    created: string;
    data_template: { [key: string]: number[] };
    id: number;
    is_active: boolean;
    modified: string;
    name: string;
  };
  user: string;
}

function LabTest() {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("profile");
  const [calendarModal, setCalendarModal] = useState(false);
  const [addTestModal, setAddTestModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState<any>();
  const [currentPage, setCurrentPage] = useState(
    pagination != undefined ? pagination.page : 1
  );
  const [pageSize, setPageSize] = useState(
    pagination != undefined ? pagination.page_size : 10
  );
  const testRecordData = useSelector((state: any) => state.patient.test_record);
  const filterCategories = useSelector(
    (state: any) => state.patient.test_categories
  );
  const imageData = useSelector(
    (state: { image: { lab_test_history: string } }) =>
      state.image.lab_test_history
  );
  const [recordList, setRecordList] = useState<recordListType[]>();

  const toggleCalendarModal = () => {
    setCalendarModal(!calendarModal);
  };
  const toggleAddTestModal = () => {
    setAddTestModal(!addTestModal);
  };

  const [state, setState] = useState<objectType[]>([
    {
      startDate: subDays(new Date(), 7),
      endDate: addDays(new Date(), 1),
      key: "selection",
    },
  ]);

  useEffect(() => {
    if (testRecordData.test_record_list != undefined) {
      setRecordList(testRecordData.test_record_list);
    }
    if (testRecordData.pagination != undefined) {
      setPagination(testRecordData.pagination);
    }
  }, [testRecordData]);

  useEffect(() => {
    dispatch(
      test_record_list({
        user: localStorage.getItem("userId") || "",
        search: searchText,
        start_datetime: "",
        end_datetime: "",
        page_size: pageSize,
        page: currentPage,
        test: "",
      })
    );
  }, [pageSize, currentPage]);

  useEffect(() => {
    dispatch(
      test_categories({
        user: localStorage.getItem("userId") || "",
      })
    );
  }, []);

  useEffect(() => {
    if (recordList != undefined) {
      recordList.map((data: recordListType) => {
        if (
          data.file != null &&
          data.file.file != undefined &&
          data.file.file != null
        ) {
          dispatch(
            getImage({
              url: data.file.file,
              id: data.user || "",
              type: "lab_test_history",
              itemId: data.id,
            })
          );
        }
      });
    }
  }, [recordList]);

  const downloadImage = (link: string, name: string) => {
    const linkSource = link;
    const downloadLink = document.createElement("a");
    const fileName = `${name
      .substring(name.lastIndexOf("_") + 1, name.length)
      .substring(
        0,
        name.substring(name.lastIndexOf("_") + 1, name.length).lastIndexOf(".")
      )}.${name
      .substring(name.lastIndexOf("_") + 1, name.length)
      .substring(
        name
          .substring(name.lastIndexOf("_") + 1, name.length)
          .lastIndexOf(".") + 1,
        name.substring(name.lastIndexOf("_") + 1, name.length).length
      )}`;

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  };

  return (
    <>
      <DashboardLayout HeaderSubTitle="Savannah Nguyen" hideBorder profilePage>
        <ProfileTabs tabType="labHistory" />
        <div className={styles.labTest_page}>
          <div className={styles.labSearch}>
            <div className={styles.labSearch_btnWrap}>
              <Dropdown className={styles.filter_dropdown}>
                <Dropdown.Toggle
                  variant=""
                  id="dropdown-basic"
                  className="btn outline iconBtn"
                >
                  <span>
                    <FilterIcon />
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className={`themeDropdown_menu ${styles.filter_dropMenu}`}
                >
                  {filterCategories.test_categories_list != undefined &&
                    filterCategories.test_categories_list.map(
                      (data: any, index: number) => (
                        <Dropdown.Item
                          key={index}
                          as="li"
                          onClick={() => {
                            dispatch(
                              test_record_list({
                                user: localStorage.getItem("userId") || "",
                                search: searchText,
                                start_datetime: "",
                                end_datetime: "",
                                page_size: pageSize,
                                page: currentPage,
                                test: data.id,
                              })
                            );
                          }}
                        >
                          {data.name}
                        </Dropdown.Item>
                      )
                    )}
                </Dropdown.Menu>
              </Dropdown>
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
          <div className={styles.labTest_wrapper}>
            {recordList != undefined ? (
              recordList.length != 0 ? (
                recordList.map((data) => {
                  if (Object.keys(data.data).length !== 0) {
                    return (
                      <div className={`theme_border ${styles.labTestCard}`}>
                        <div className={styles.labTestCard_full}>
                          <ul className={styles.card_testDetail}>
                            <li>{data.test.name}</li>
                            <li>
                              <h6>{t("Category")}</h6>
                              <span>NA</span>
                            </li>
                            <li>
                              <h6>{t("Collected")}</h6>
                              <span>
                                {moment(data.recorded_at).format("D MMM YYYY")}
                              </span>
                            </li>
                            <li>
                              <h6>{t("Lab")}</h6>
                              <span>NA</span>
                            </li>
                            {data.file != null &&
                              data.file.file != undefined &&
                              data.file.file != null && (
                                <li>
                                  <div className="cardPdf">
                                    <span className="cardPdf_icon">
                                      <PdfIcon />
                                    </span>
                                    <div className="cardPdf_content">
                                      <h6>
                                        {data.file.file
                                          .substring(
                                            data.file.file.lastIndexOf("_") + 1,
                                            data.file.file.length
                                          )
                                          .substring(
                                            0,
                                            data.file.file
                                              .substring(
                                                data.file.file.lastIndexOf(
                                                  "_"
                                                ) + 1,
                                                data.file.file.length
                                              )
                                              .lastIndexOf(".")
                                          )}
                                      </h6>
                                      <span>
                                        {data.file.file
                                          .substring(
                                            data.file.file.lastIndexOf("_") + 1,
                                            data.file.file.length
                                          )
                                          .substring(
                                            data.file.file
                                              .substring(
                                                data.file.file.lastIndexOf(
                                                  "_"
                                                ) + 1,
                                                data.file.file.length
                                              )
                                              .lastIndexOf(".") + 1,
                                            data.file.file.substring(
                                              data.file.file.lastIndexOf("_") +
                                                1,
                                              data.file.file.length
                                            ).length
                                          )
                                          .toUpperCase()}
                                        {/* , 1.2 MB */}
                                      </span>
                                    </div>
                                    <span
                                      className="delete_pdf"
                                      onClick={() =>
                                        downloadImage(
                                          imageData[data.id],
                                          data.file.file
                                        )
                                      }
                                    >
                                      <UploadIcon />
                                    </span>
                                  </div>
                                </li>
                              )}

                            <li>
                              <div className={styles.checkbox}>
                                <Form.Check
                                  type="checkbox"
                                  id="1"
                                  label="Share with patient"
                                  checked={data.is_showable}
                                />
                              </div>
                            </li>
                          </ul>
                          <div className={styles.card_testReading}>
                            <Table borderless>
                              <thead>
                                <tr>
                                  <th>{t("Component")}</th>
                                  <th>{t("Your_Value")}</th>
                                  <th>{t("Standard_range")}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {data.data != null &&
                                  Object.keys(data.data).map((key, index) => {
                                    return (
                                      <tr key={index}>
                                        <td>{key}</td>
                                        <td>{data.data[key]}</td>
                                        <td>NA</td>
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </Table>
                          </div>
                          <span className={styles.cardMenu_icon}>
                            <OptionIcon />
                          </span>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className={`theme_border ${styles.labTestCard}`}>
                        <div className={styles.labTestCard_half}>
                          <ul>
                            <li>
                              {data.test.name}
                              <div className={styles.shareCheckbox}>
                                <Form.Check
                                  type="checkbox"
                                  id="2"
                                  label="Share with patient"
                                  checked={data.is_showable}
                                />
                              </div>
                            </li>
                            {data.file != null &&
                              data.file.file != undefined &&
                              data.file.file != null && (
                                <div className={styles.halfCard_pdf}>
                                  <div className="cardPdf">
                                    <span className="cardPdf_icon">
                                      <PdfIcon />
                                    </span>
                                    <div className="cardPdf_content">
                                      <h6>
                                        {" "}
                                        {data.file.file
                                          .substring(
                                            data.file.file.lastIndexOf("_") + 1,
                                            data.file.file.length
                                          )
                                          .substring(
                                            0,
                                            data.file.file
                                              .substring(
                                                data.file.file.lastIndexOf(
                                                  "_"
                                                ) + 1,
                                                data.file.file.length
                                              )
                                              .lastIndexOf(".")
                                          )}
                                      </h6>
                                      <span>
                                        {data.file.file
                                          .substring(
                                            data.file.file.lastIndexOf("_") + 1,
                                            data.file.file.length
                                          )
                                          .substring(
                                            data.file.file
                                              .substring(
                                                data.file.file.lastIndexOf(
                                                  "_"
                                                ) + 1,
                                                data.file.file.length
                                              )
                                              .lastIndexOf(".") + 1,
                                            data.file.file.substring(
                                              data.file.file.lastIndexOf("_") +
                                                1,
                                              data.file.file.length
                                            ).length
                                          )
                                          .toUpperCase()}
                                        {/* , 1.2 MB */}
                                      </span>
                                    </div>

                                    <span
                                      className="delete_pdf"
                                      onClick={() =>
                                        downloadImage(
                                          imageData[data.id],
                                          data.file.file
                                        )
                                      }
                                    >
                                      <UploadIcon />
                                    </span>
                                  </div>
                                </div>
                              )}
                          </ul>
                          <ul className={styles.halfCardDetail}>
                            <li>
                              <h6>{t("Category")}</h6>
                              <span>NA</span>
                            </li>
                            <li>
                              <h6>{t("Collected")}</h6>
                              <span>
                                {moment(data.recorded_at).format("D MMM YYYY")}
                              </span>
                            </li>
                            <li>
                              <h6>{t("Lab")}</h6>
                              <span>NA</span>
                            </li>
                          </ul>
                          <span className={styles.cardMenu_icon}>
                            <OptionIcon />
                          </span>
                        </div>
                      </div>
                    );
                  }
                })
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
            {recordList != undefined && recordList.length != 0 && (
              <Pagination
                currentPage={currentPage}
                totalCount={pagination != undefined ? pagination.count : 1}
                pageSize={pageSize}
                siblingCount={1}
                setCurrentPage={setCurrentPage}
                setPageSize={setPageSize}
              />
            )}
            {/* <div className={`theme_border ${styles.labTestCard}`}>
              <div className={styles.labTestCard_full}>
                <ul className={styles.card_testDetail}>
                  <li>Complete blood counts (includes platelets counts)</li>
                  <li>
                    <h6>{t("Category")}</h6>
                    <span>Blood pressure report</span>
                  </li>
                  <li>
                    <h6>{t("Collected")}</h6>
                    <span>12 march 2022</span>
                  </li>
                  <li>
                    <h6>{t("Lab")}</h6>
                    <span>Whole blood</span>
                  </li>
                  <li>
                    <div className="cardPdf">
                      <span className="cardPdf_icon">
                        <PdfIcon />
                      </span>
                      <div className="cardPdf_content">
                        <h6>Document Name</h6>
                        <span>PDF, 1.2 MB</span>
                      </div>
                      <span className="delete_pdf">
                        <UploadIcon />
                      </span>
                    </div>
                  </li>
                  <li>
                    <div className={styles.checkbox}>
                      <Form.Check
                        type="checkbox"
                        id="1"
                        label="Share with patient"
                      />
                    </div>
                  </li>
                </ul>
                <div className={styles.card_testReading}>
                  <Table borderless>
                    <thead>
                      <tr>
                        <th>{t("Component")}</th>
                        <th>{t("Your_Value")}</th>
                        <th>{t("Standard_range")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>WBC count</td>
                        <td>7.6x10E9/L</td>
                        <td>3.4 - 10x10E9/L</td>
                      </tr>
                      <tr>
                        <td>RBC Count</td>
                        <td>3.66x10E12/L</td>
                        <td>4.0 - 5.2x10E12/L</td>
                      </tr>
                      <tr>
                        <td>Homeglobin</td>
                        <td>10.9 g/dL</td>
                        <td>12.0 - 15.5 g/dL</td>
                      </tr>
                      <tr>
                        <td>Hrmatocrit</td>
                        <td>33.9 %</td>
                        <td>33.9 % - 45.9 %</td>
                      </tr>
                      <tr>
                        <td>MCV</td>
                        <td>93fL</td>
                        <td>80 - 100fL</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
                <span className={styles.cardMenu_icon}>
                  <OptionIcon />
                </span>
              </div>
            </div> */}
            {/* <div className={`theme_border ${styles.labTestCard}`}>
              <div className={styles.labTestCard_half}>
                <ul>
                  <li>
                    Complete blood counts (includes platelets counts)
                    <div className={styles.shareCheckbox}>
                      <Form.Check
                        type="checkbox"
                        id="2"
                        label="Share with patient"
                      />
                    </div>
                  </li>
                  <div className={styles.halfCard_pdf}>
                    <div className="cardPdf">
                      <span className="cardPdf_icon">
                        <PdfIcon />
                      </span>
                      <div className="cardPdf_content">
                        <h6>Document Name</h6>
                        <span>PDF, 1.2 MB</span>
                      </div>
                      <span className="delete_pdf">
                        <UploadIcon />
                      </span>
                    </div>
                  </div>
                </ul>
                <ul className={styles.halfCardDetail}>
                  <li>
                    <h6>{t("Category")}</h6>
                    <span>Blood pressure report</span>
                  </li>
                  <li>
                    <h6>{t("Collected")}</h6>
                    <span>12 march 2022</span>
                  </li>
                  <li>
                    <h6>{t("Lab")}</h6>
                    <span>Whole blood</span>
                  </li>
                </ul>
                <span className={styles.cardMenu_icon}>
                  <OptionIcon />
                </span>
              </div>
            </div> */}
          </div>
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
                    test_record_list({
                      user: localStorage.getItem("userId") || "",
                      search: searchText,
                      start_datetime: moment(state[0].startDate).format(
                        "YYYY-MM-D"
                      ),
                      end_datetime: moment(state[0].endDate).format(
                        "YYYY-MM-D"
                      ),
                      page_size: pageSize,
                      page: (1).toString(),
                      test: "",
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
      </DashboardLayout>
    </>
  );
}

export default LabTest;
