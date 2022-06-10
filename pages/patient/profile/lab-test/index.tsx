/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import styles from "./LabTest.module.scss";
import ProfileTabs from "@components/PagesComponent/PatientProfile/ProfileTabs/ProfileTabs";
import DashboardLayout from "@components/Layouts/DashboardLayout";
import TestDetail from "./TestDetail";
import useTranslation from "next-translate/useTranslation";
import { useToggle } from "rooks";
import {
  ExerciseIcon,
  GlucoseIcon,
  HeartIcon,
  MetabolicIcon,
  OrganIcon,
  SleepIcon,
} from "@components/Common/Icons/Icons";
import { Col, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "redux/store";
import { patient_profile, test_categories } from "redux/Patient/action";
import moment from "moment";
import _ from "lodash";

interface labTestType {
  fields: any;
  last_update: string;
  name: string;
  id: number;
}

function LabTest() {
  const dispatch = useDispatch<AppDispatch>();
  const profileData = useSelector((state: any) => state.patient.profile);
  const labTestData = useSelector(
    (state: any) => state.patient.test_categories
  );
  const [testCategoriesData, setTestCategoriesData] = useState<labTestType[]>();
  const [cardId, setCardId] = useState<number>();
  const [openTestDetail, toggleTestDetail] = useToggle(false);
  const { t } = useTranslation("profile");
  const readings = [
    { type: "HBA1c", value: "3.585" },
    { type: "Blood glucose", value: "1.512" },
    { type: "Time in range", value: "3.585" },
    { type: "Fructosamine", value: "0.200" },
    { type: "LDL", value: "0.500" },
  ];
  const cardsData = [
    {
      title: "Metabolic",
      icon: <MetabolicIcon />,
      date: "16 March 2022",
      readings: readings,
    },
    {
      title: "Cardiac",
      icon: <HeartIcon />,
      date: "16 March 2022",
      readings: readings,
    },
    {
      title: "Vitamins, Micronutrion and Electrolytes",
      icon: <GlucoseIcon />,
      date: "16 March 2022",
      readings: readings,
    },
    {
      title: "Endocrine",
      icon: <MetabolicIcon />,
      date: "16 March 2022",
      readings: readings,
    },
    {
      title: "Psychological status",
      icon: <MetabolicIcon />,
      date: "16 March 2022",
      readings: readings,
    },
    {
      title: "Sleep",
      icon: <SleepIcon />,
      date: "16 March 2022",
      readings: readings,
    },
    {
      title: "Exercise",
      icon: <ExerciseIcon />,
      date: "16 March 2022",
      readings: readings,
    },
    {
      title: "Organ",
      icon: <OrganIcon />,
      date: "16 March 2022",
      readings: readings,
    },
  ];

  useEffect(() => {
    dispatch(
      patient_profile({
        id: localStorage.getItem("patientId") || "",
      })
    );
    dispatch(
      test_categories({
        user: localStorage.getItem("userId") || "",
      })
    );
  }, []);

  useEffect(() => {
    labTestData.test_categories_list != undefined &&
      setTestCategoriesData(labTestData.test_categories_list);
  }, [labTestData]);

  return (
    <>
      <DashboardLayout
        HeaderSubTitle={`${
          profileData.first_name != undefined ? profileData.first_name : ""
        } ${profileData.last_name != undefined ? profileData.last_name : ""}`}
        hideBorder
        profilePage
      >
        <ProfileTabs tabType="labTest" />
        {openTestDetail ? (
          <TestDetail toggleDetailPage={toggleTestDetail} cardId={cardId} />
        ) : (
          <div className={styles.labTest_page}>
            <div className={styles.labTest_cardWrapper}>
              <Row className="g-4">
                {testCategoriesData != undefined ? (
                  testCategoriesData.length != 0 ? (
                    testCategoriesData.map((card: labTestType, i) => (
                      <Col xl={3} lg={4} md={6} key={i}>
                        <div
                          className={`theme_border ${styles.labTest_card}`}
                          onClick={() => {
                            toggleTestDetail(true);
                            setCardId(card.id);
                          }}
                        >
                          <div className={styles.cardIcon}>
                            <MetabolicIcon />
                          </div>
                          <div className={styles.cardContent}>
                            <h5>{card.name}</h5>

                            <div className={styles.cardReadings}>
                              {Object.keys(card.fields).map((key, index) => (
                                <div
                                  key={index}
                                  className={styles.cardReading_single}
                                >
                                  <span className={styles.cardReadings_type}>
                                    {key}
                                  </span>
                                  <span className={styles.cardReadings_value}>
                                    {card.fields[key]}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className={styles.updateDate}>
                              Last update:{" "}
                              {moment(card.last_update).format("D MMM YYYY")}
                            </div>
                          </div>
                        </div>
                      </Col>
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
              </Row>
            </div>
          </div>
        )}
      </DashboardLayout>
    </>
  );
}

export default LabTest;
