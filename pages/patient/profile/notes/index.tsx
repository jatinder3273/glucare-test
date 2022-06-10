/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import React, { Dispatch, useEffect, useRef, useState } from "react";
import styles from "./Notes.module.scss";
import ProfileTabs from "@components/PagesComponent/PatientProfile/ProfileTabs/ProfileTabs";
import DashboardLayout from "@components/Layouts/DashboardLayout";
import useTranslation from "next-translate/useTranslation";
import * as Yup from "yup";
import {
  CalendarIcon,
  NoteCardIcon,
  SearchIcon,
} from "@components/Common/Icons/common";
import ModalLayout from "@components/Layouts/ModalLayout";
import { PlusIcon } from "@components/Common/Icons/Icons";
import CalendarRangeFilter from "@components/PagesComponent/PatientProfile/CalendarRangeFilter";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "redux/store";
import {
  note_category_list,
  note_create,
  note_list,
  patient_profile,
} from "redux/Patient/action";
import { Formik, Form, FormikProps, Field } from "formik";
import { Form as ReactForm, Spinner } from "react-bootstrap";
import _ from "lodash";
import moment from "moment";
import { addDays, subDays } from "date-fns";
import Pagination from "@components/Common/Pagination/Pagination";

interface notesCategoryType {
  id: number;
  created: string;
  modified: string;
  name: string;
  is_active: boolean;
}

interface notesListType {
  category: {
    id: number;
    created: string;
    modified: string;
    name: string;
    is_active: boolean;
  };
  created: string;
  created_by: {
    avatar: string;
    created: string;
    first_name: string;
    gender: string;
    id: number;
    invited_by: number;
    job_title: null | string;
    last_name: string;
    medical_no: number;
    modified: string;
    role: string;
    status: string;
    unread_notifications: number;
    user: number;
  };
  data_source: string;
  id: number;
  modified: string;
  note: string;
  recorded_at: string;
  subject: string;
  user: number;
}

interface noteListDataType {
  date: string;
  noteCard: notesListType[];
}

interface objectType {
  startDate: Date;
  endDate: Date;
  key: string;
}

type FormValues = {
  category: string;
  subject: string;
  note: string;
};

const validationSchema = Yup.object().shape({
  category: Yup.string().required("Select a category"),
  subject: Yup.string().required("Subject is required"),
  note: Yup.string().required("Note is required"),
});

function ProfileNotes() {
  const { t } = useTranslation("profile");
  const formikRef = useRef<FormikProps<FormValues>>(null);
  const [showMore, setShowMore] = useState(false);
  const [addNotesBox, setAddNotesBox] = useState(false);
  const [calendarModal, setCalendarModal] = useState(false);
  const notesData = useSelector((state: any) => state.patient.notes);
  const profileData = useSelector((state: any) => state.patient.profile);
  const [notesCategoryList, setNotesCategoryList] =
    useState<notesCategoryType[]>();
  const [notesList, setNotesList] = useState<notesListType[]>();
  const [noteListData, setNoteListData] = useState<noteListDataType[]>();
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const openAddNotesBox = () => {
    setAddNotesBox(true);
  };
  const closeAddNotesBox = () => {
    setAddNotesBox(false);
  };
  const toggleCalendarModal = () => {
    setCalendarModal(!calendarModal);
  };
  const [showDateRange, setShowDateRange] = useState(false);
  const [pagination, setPagination] = useState<any>();
  const [currentPage, setCurrentPage] = useState(
    pagination != undefined ? pagination.page : 1
  );
  const [pageSize, setPageSize] = useState(
    pagination != undefined ? pagination.page_size : 10
  );

  useEffect(() => {
    dispatch(note_category_list());
    dispatch(
      patient_profile({
        id: localStorage.getItem("patientId"),
      })
    );
  }, []);

  useEffect(() => {
    if (notesData.notes_category_list != undefined) {
      setNotesCategoryList(notesData.notes_category_list[0]);
    }
    if (notesData.notes_list != undefined) {
      setNotesList(notesData.notes_list[0]);
    }
    if (notesData.pagination != undefined) {
      setPagination(notesData.pagination[0]);
    }
  }, [notesData]);

  useEffect(() => {
    if (notesList != undefined) {
      setNoteListData(
        _.chain(notesList)
          .groupBy((data) => moment(data.created).format("D MMM YYYY"))
          .map((value, key) => ({
            date: moment(key).format("D MMM YYYY"),
            noteCard: value,
          }))
          .value()
      );
    }
  }, [notesList]);

  const handleOnSubmit = async (
    values: { category: string; subject: string; note: string },
    setSubmitting: { (isSubmitting: boolean): void; (arg0: boolean): void }
  ) => {
    setSubmitting(true);
    dispatch(
      note_create({ ...values, user: localStorage.getItem("userId") })
    ).then(() => {
      dispatch(
        note_list({
          user: localStorage.getItem("userId"),
          subject: "",
          start_datetime: "",
          end_datetime: "",
          page_size: pageSize,
          page: 1,
        })
      );
    });
    setShowDateRange(false);
    setSubmitting(false);
    closeAddNotesBox();
  };

  const handleChange = (e: string) => {
    setSearchText(e.target.value);
    dispatch(
      note_list({
        user: localStorage.getItem("userId"),
        subject: e.target.value,
        start_datetime: "",
        end_datetime: "",
        page_size: pageSize,
        page: 1,
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
      note_list({
        user: localStorage.getItem("userId"),
        subject: searchText,
        start_datetime: "",
        end_datetime: "",
        page_size: pageSize,
        page: currentPage,
      })
    );
    setShowDateRange(false);
  }, [pageSize, currentPage]);

  return (
    <>
      <DashboardLayout
        HeaderSubTitle={`${
          profileData.first_name != undefined ? profileData.first_name : ""
        } ${profileData.last_name != undefined ? profileData.last_name : ""}`}
        hideBorder
        profilePage
      >
        <ProfileTabs tabType="notes" />
        <div className={styles.ProfileNotesPage}>
          <div className={styles.notesSearch}>
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
              onClick={toggleCalendarModal}
            >
              <span>
                <CalendarIcon />
              </span>
            </button>
            <button
              className="btn filled ms-3"
              type="button"
              onClick={openAddNotesBox}
            >
              <span className="btnIcon">
                <PlusIcon />
              </span>
              Add note
            </button>
          </div>
          {addNotesBox ? (
            <div className={`theme_border ${styles.addnotesBox}`}>
              <Formik
                innerRef={formikRef}
                initialValues={{
                  category: "",
                  subject: "",
                  note: "",
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                  handleOnSubmit(values, setSubmitting);
                }}
              >
                {({ errors, handleChange, touched, values }) => (
                  <Form>
                    <ReactForm.Group controlId="formFirstName">
                      <ReactForm.Label>{t("Note_subject")}</ReactForm.Label>
                      <ReactForm.Control
                        type="text"
                        placeholder="write subject here"
                        onChange={handleChange}
                        name="subject"
                        className={
                          touched.subject && errors.subject
                            ? "border-danger"
                            : ""
                        }
                        value={values.subject}
                      />
                      {touched.subject && errors.subject ? (
                        <div className="error-message text-danger">
                          {errors.subject}
                        </div>
                      ) : null}
                    </ReactForm.Group>
                    <div className="theme_radio_select my-3">
                      <Field>
                        {({ field }) => {
                          return notesCategoryList?.map(
                            (data: notesCategoryType) => {
                              return (
                                <div className="radio_select_btn" key={data.id}>
                                  <input
                                    {...field}
                                    type="radio"
                                    name="category"
                                    id={data.name}
                                    onChange={handleChange}
                                    className={
                                      touched.category && errors.category
                                        ? "border-danger"
                                        : ""
                                    }
                                    value={data.id}
                                  />
                                  <label htmlFor={data.name}>{data.name}</label>
                                </div>
                              );
                            }
                          );
                        }}
                      </Field>
                    </div>
                    {touched.category && errors.category ? (
                      <div className="error-message text-danger">
                        {errors.category}
                      </div>
                    ) : null}
                    <ReactForm.Group
                      className="mb-3"
                      controlId="exampleForm.ControlTextarea1"
                    >
                      <ReactForm.Label>{t("Note")}</ReactForm.Label>
                      <ReactForm.Control
                        as="textarea"
                        rows={4}
                        placeholder="Text"
                        onChange={handleChange}
                        name="note"
                        className={
                          touched.note && errors.note ? "border-danger" : ""
                        }
                        value={values.note}
                      />
                      {touched.note && errors.note ? (
                        <div className="error-message text-danger">
                          {errors.note}
                        </div>
                      ) : null}
                    </ReactForm.Group>
                    <div className="mt-3">
                      <button type="submit" className="btn filled me-3">
                        {t("Submit")}
                      </button>
                      <button
                        type="button"
                        className="btn outline"
                        onClick={closeAddNotesBox}
                      >
                        {t("Cancel")}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          ) : (
            <></>
          )}

          {showDateRange && (
            <div className="mt-4">
              {`${moment(state[0].startDate).format("D MMM YYYY")} - ${moment(
                state[0].endDate
              ).format("D MMM YYYY")}`}
            </div>
          )}
          <div className={styles.notesWraper}>
            {noteListData != undefined ? (
              noteListData.length != 0 ? (
                noteListData?.map((item: noteListDataType) => (
                  <div className={styles.notesDayBox} key={item.date}>
                    <h6>{item.date}</h6>
                    {item.noteCard.map((card: notesListType) => (
                      <div
                        className={`theme_border ${styles.singleNote}`}
                        key={card.id}
                      >
                        <div className={styles.icon}>
                          <NoteCardIcon />
                        </div>
                        <div className={styles.notesContent}>
                          <h5>{card.subject}</h5>
                          <p>
                            {showMore
                              ? card.note
                              : `${card.note.substring(0, 170)}`}
                            {card.note.length > 170 && !showMore ? "..." : ""}
                          </p>
                          {/* {card.list ? (
                        <ul className="list">
                          {card.list.map((list, k) => (
                            <li key={k}>{list}</li>
                          ))}
                        </ul>
                      ) : null} */}

                          {card.note.length > 170 ? (
                            <div className={styles.showMoreBtn}>
                              <span onClick={() => setShowMore(!showMore)}>
                                {showMore ? "Show less" : "Show more"}
                              </span>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))
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
          </div>
          {noteListData != undefined && noteListData.length != 0 && (
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
                  setShowDateRange(true);
                  dispatch(
                    note_list({
                      user: localStorage.getItem("userId"),
                      subject: searchText,
                      start_datetime: moment(state[0].startDate).format(
                        "YYYY-MM-D"
                      ),
                      end_datetime: moment(state[0].endDate)
                        .add(1, "days")
                        .format("YYYY-MM-D"),
                      page_size: pageSize,
                      page: 1,
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
        </div>
      </DashboardLayout>
    </>
  );
}

export default ProfileNotes;
