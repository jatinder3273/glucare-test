/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import React, { useEffect, useState } from "react";
import styles from "./PatientInfo.module.scss";
import ProfileTabs from "@components/PagesComponent/PatientProfile/ProfileTabs/ProfileTabs";
import DashboardLayout from "@components/Layouts/DashboardLayout";
import DevicesSidebar from "@components/PagesComponent/PatientProfile/ProfileInfo/DevicesSidebar";
import DrawerLayout from "@components/Layouts/DrawerLayout";
import BloodPressureHistory from "@components/PagesComponent/PatientProfile/ProfileInfo/BPHistorySidebar";
import WeightHistory from "@components/PagesComponent/PatientProfile/ProfileInfo/WeightHistorySidebar";
import GlucoseSidebar from "@components/PagesComponent/PatientProfile/ProfileInfo/GlucoseHistorySidebar";
import FoodSidebar from "@components/PagesComponent/PatientProfile/ProfileInfo/FoodHistorySidebar";
import DataComparisonGraph from "@components/PagesComponent/PatientProfile/ProfileInfo/DataGraphs/DataComparisonGraph";
import profile_placeholder from "@assets/icons/profile_placeholder.svg";
import {
  UsersIcon,
  GlucoseIcon,
  WeightIcon,
  FoodIcon,
  BPIcon,
  DeviceIcon,
  DownArrowIcon,
  ScheduleIcon,
  EditIcon,
  OptionIcon,
  AddNotesIcon,
  SendMessageIcon,
  ArchiveIcon,
  HeartIcon,
  MedicationIcon,
  ActivityIcon,
  StepsIcon,
  HydrationIcon,
  AlcoholIcon,
  SmokingIcon,
  SleepIcon,
} from "@components/Common/Icons/Icons";
import Food1 from "@assets/food1.jpg";
import Food2 from "@assets/food2.jpg";
import Food3 from "@assets/food3.jpg";
import { Accordion, Col, Dropdown, Image, Row } from "react-bootstrap";
import AvatarImage from "@assets/avatar2.png";
import DoctorImage from "@assets/doctor.png";
import { LocationIcon, SadMoodIcon } from "@components/Common/Icons/common";
import {
  fetch_doctor,
  fetch_patient_right_data,
  patient_profile,
  prescribed_medication_list,
  reset_profile,
} from "redux/Patient/action";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "redux/store";
import { useToggle } from "rooks";
import moment from "moment";
import { getImage } from "redux/Image/action";

interface profileType {
  name?: string;
  first_name?: string;
  last_name?: string;
  contact_no?: string;
  age?: number;
  diagnoses?: string[];
  readiness?: string;
  prescribed_medication_list?: string[];
  fetch_doctor?: string[];
  user?: number;
  patient_right_data?: rightDataType[];
}

interface rightDataType {
  created?: string;
  data_source?: string;
  data_type?: string;
  data_sub_type?: string;
  device?: {
    created: string;
    data_template: { steps: number; heart_rate: number; sleep_in_bed: number };
    id: number;
    image: string;
    is_active: boolean;
    modified: string;
    name: string;
    wp_content: null | string;
  };
  id?: number;
  modified?: string;
  range?: null | string;
  recorded_at?: string;
  user?: number;
  value?: number;
  value_change?: number;
  unit?: string;
  file?: string;
  avatar?: string;
}

function PatientProfile() {
  const [deviceSidebar, setDeviceSidebar] = useToggle(false);
  const [bloodPressureSidebar, setBloodPressureSidebar] = useToggle(false);
  const [weightPressureSidebar, setWeightPressureSidebar] = useState(false);
  const [glucoseSidebar, setGlucoseSidebar] = useState(false);
  const [foodSidebar, setFoodSidebar] = useState(false);
  const imageData = useSelector((state: { image: string }) => state.image);
  const patientProfileData = useSelector((state: any) => state.patient);
  const dispatch = useDispatch<AppDispatch>();
  const [profileData, setProfileData] = useState<profileType>({});
  const [callPrescribedMedicationList, setCallPrescribedMedicationList] =
    useState(true);

  const [rightData, setRightData] = useState<rightDataType[]>();

  const toggleWeightSidebar = () => {
    setWeightPressureSidebar(!weightPressureSidebar);
  };
  const toggleGlucoseSidebar = () => {
    setGlucoseSidebar(!glucoseSidebar);
  };
  const toggleFoodSidebar = () => {
    setFoodSidebar(!foodSidebar);
  };
  const toggleSidebar = (item: string) => {
    if (item === "Blood pressure") {
      setBloodPressureSidebar(!bloodPressureSidebar);
    } else if (item === "Food Log") {
      toggleFoodSidebar();
    } else if (item === "Weight") {
      toggleWeightSidebar();
    } else if (item === "Glucose") {
      toggleGlucoseSidebar();
    }
  };
  const medicationCards = [
    {
      title: "Blood pressure",
      cardIcon: <BPIcon />,
      description: "Measured by Apple Watch",
      time: "Today, 8:04 pm",
      value: "120/80",
      unit: "mm/Hg",
    },
    {
      title: "Food Log",
      cardIcon: <FoodIcon />,
      description: "Measured by Apple Watch",
      time: "Today, 8:04 pm",
      value: "54",
      unit: "kg",
      valueChanges: "+0.2 kg",
      foodCard: true,
    },
    {
      title: "Weight",
      cardIcon: <WeightIcon />,
      description: "Measured by MiScale",
      time: "Today, 8:04 pm",
      value: "54",
      unit: "kg",
      valueChanges: "+0.2 kg",
    },
    {
      title: "Glucose",
      cardIcon: <GlucoseIcon />,
      description: "Measured by MiScale",
      time: "Today, 8:04 pm",
      value: "60",
      unit: "mg/dL",
      valueChanges: "5 mg/dL",
    },
  ];

  useEffect(() => {
    if (patientProfileData.profile.length != 0) {
      setProfileData(patientProfileData.profile);
    }
  }, [patientProfileData]);

  useEffect(() => {
    if (
      Object.keys(profileData).length != 0 &&
      callPrescribedMedicationList &&
      profileData.user != undefined
    ) {
      dispatch(
        fetch_doctor({
          type: "1",
          patient_user: profileData.user.toString(),
        })
      );
      dispatch(
        prescribed_medication_list({
          id: profileData.user.toString(),
        })
      );
      dispatch(
        fetch_patient_right_data({
          id: profileData.user.toString(),
        })
      );
      setCallPrescribedMedicationList(false);
    }

    if (profileData.patient_right_data != undefined) {
      setRightData(profileData.patient_right_data[profileData.user]);
    }
  }, [profileData]);

  useEffect(() => {
    dispatch(
      patient_profile({
        id: localStorage.getItem("patientId"),
      })
    );
  }, []);

  useEffect(() => {
    if (rightData != undefined) {
      rightData.map((data: rightDataType) => {
        if (data.file != undefined && data.file != null && data.file != "") {
          dispatch(
            getImage({
              url: data.file,
              id: data.user || "",
              type: "food",
            })
          );
        }
      });
    }
  }, [rightData]);

  return (
    <>
      <DashboardLayout
        hideBorder
        HeaderSubTitle={`${
          profileData.first_name != undefined ? profileData.first_name : ""
        } ${profileData.last_name != undefined ? profileData.last_name : ""}`}
        profilePage
      >
        <ProfileTabs tabType="patientInfo" />
        <div className={styles.profileInfo}>
          <div className={styles.profileInfoWrapper}>
            <Row>
              <Col xl={3} className="mb-xl-0 mb-4">
                <div className={styles.profileDetail}>
                  <div
                    className={`theme_border mb-4 ${styles.personalProfileDetail}`}
                  >
                    <Dropdown className={styles.profileOptions_dropdown}>
                      <Dropdown.Toggle variant="" id="dropdown-basic">
                        <OptionIcon />
                      </Dropdown.Toggle>

                      <Dropdown.Menu className="themeDropdown_menu" align="end">
                        <Dropdown.Item as="li">
                          <span className="themeDropdown_menuIcon">
                            <EditIcon />
                          </span>
                          Edit info
                        </Dropdown.Item>
                        <Dropdown.Item as="li">
                          <span className="themeDropdown_menuIcon">
                            <AddNotesIcon />
                          </span>
                          Add Notes
                        </Dropdown.Item>
                        <Dropdown.Item as="li">
                          <span className="themeDropdown_menuIcon">
                            <SendMessageIcon />
                          </span>
                          Send message
                        </Dropdown.Item>
                        <Dropdown.Item as="li">
                          <span className="themeDropdown_menuIcon">
                            <UsersIcon />
                          </span>
                          Reassign doctor
                        </Dropdown.Item>
                        <Dropdown.Item as="li">
                          <span style={{ color: "#FE5500" }}>
                            <span
                              className="themeDropdown_menuIcon"
                              style={{ color: "#FE5500" }}
                            >
                              <ArchiveIcon />
                            </span>
                            Archive
                          </span>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    <div className={styles.personal_info}>
                      <span className={styles.image}>
                        <Image
                          alt=""
                          src={
                            profileData.avatar !== null &&
                            profileData.avatar != undefined
                              ? imageData.user[profileData.user]
                              : profile_placeholder.src
                          }
                        />
                      </span>
                      <h4>
                        {profileData.first_name} {profileData.last_name}
                      </h4>
                      {/* <span className={styles.personalProfileDetail_tag}>
                        Contemplation
                      </span>
                      <span className={styles.personalProfileDetail_id}>
                        ID 13248854
                      </span> */}
                    </div>

                    <div className={styles.profileDetail_fields}>
                      {/* <div className={styles.profileDetail_singleField}>
                        <label>Email</label>
                        <p>jacobdaniel@gmail.com</p>
                      </div> */}
                      <div className={styles.profileDetail_singleField}>
                        <label>Phone number</label>
                        <p>
                          {profileData.contact_no != null
                            ? profileData.contact_no
                            : "NA"}
                        </p>
                      </div>
                      <div className={styles.profileDetail_singleField}>
                        <label>Age</label>
                        <p>
                          {profileData.age != null ? profileData.age : "NA"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <h5 className={`mb-2 ${styles.profileDetailCardHeading}`}>
                    Medical info
                    <span className={styles.icn}>
                      <EditIcon />
                    </span>
                  </h5>
                  <div className={`theme_border ${styles.personalMedicalInfo}`}>
                    <div className={styles.profileDetail_fields}>
                      <div className={styles.profileDetail_singleField}>
                        <label>Readiness</label>
                        <p>
                          {profileData.readiness == undefined
                            ? "NA"
                            : profileData.readiness}
                        </p>
                      </div>
                      <div className={styles.profileDetail_singleField}>
                        <label>Diagnosis</label>
                        <p>
                          {profileData.diagnoses == undefined ||
                          profileData.diagnoses.length == 0
                            ? "NA"
                            : profileData.diagnoses[0]?.name}
                        </p>
                      </div>
                      <div className={styles.profileDetail_singleField}>
                        <label>Medication</label>
                        <div className={styles.medicationField}>
                          {profileData.prescribed_medication_list !=
                            undefined &&
                          profileData.prescribed_medication_list.length > 0 ? (
                            profileData.prescribed_medication_list.map(
                              (data, i) => {
                                return (
                                  <p
                                    key={i}
                                    className={styles.personalProfileDetail_tag}
                                  >
                                    {data.medication.name}
                                  </p>
                                );
                              }
                            )
                          ) : (
                            <p>NA</p>
                          )}
                        </div>
                      </div>
                      <div className={styles.profileDetail_singleField}>
                        <label>Primary doctor</label>
                        {profileData.fetch_doctor != undefined &&
                        Object.keys(profileData.fetch_doctor).length != 0 &&
                        profileData.fetch_doctor[profileData.user] ? (
                          <div className={styles.profileDetail_doctor}>
                            <span className={styles.image}>
                              <Image src={DoctorImage} alt="Doctor Image" />
                            </span>
                            <div className={styles.doctorName}>
                              <h6>
                                {`Dr. ${
                                  profileData.fetch_doctor[profileData.user]
                                    .staff_user.first_name
                                } ${
                                  profileData.fetch_doctor[profileData.user]
                                    .staff_user.last_name
                                }`}
                              </h6>
                              <span>
                                {
                                  profileData.fetch_doctor[profileData.user]
                                    .staff_user.job_title.name
                                }
                              </span>
                            </div>
                          </div>
                        ) : (
                          <p>NA</p>
                        )}
                      </div>
                      {/* <div className={styles.profileDetail_singleField}>
                        <label>Clinics</label>
                        <div className={styles.profileDetail_clinics}>
                          <span className={styles.icon}>
                            <LocationIcon />
                          </span>
                          <div className={styles.clinicAdress}>
                            <h6>
                              Glamorgan House, Croescadarn Rd, Pontprennau,
                              Cardiff CF23 8XL, United Kingdom
                            </h6>
                          </div>
                        </div>
                        <div className={styles.profileDetail_clinics}>
                          <span className={styles.icon}>
                            <LocationIcon />
                          </span>
                          <div className={styles.clinicAdress}>
                            <h6>
                              Glamorgan House, Croescadarn Rd, Pontprennau,
                              Cardiff CF23 8XL, United Kingdom
                            </h6>
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </Col>
              <Col xl={6} className="mb-xl-0 mb-4">
                <DataComparisonGraph />
              </Col>
              <Col xl={3}>
                <div className={styles.profileDiagnosis}>
                  <div className={`theme_border ${styles.profileMoodCard}`}>
                    <span className={styles.cardIcon}>
                      <SadMoodIcon />
                    </span>
                    <div className={styles.card_content}>
                      <div className={styles.card_tittle}>
                        <p>
                          Feels <b>angry</b>, <b>anxious</b> and <br />
                          <b>depressed</b>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={`theme_border ${styles.diagnosisCard}`}>
                    <span className={styles.cardIcon}>
                      <DeviceIcon />
                    </span>
                    <div className={styles.card_content}>
                      <div className={styles.card_tittle}>
                        <h5>Devices</h5>
                        <span
                          className={styles.card_viewBtn}
                          onClick={setDeviceSidebar}
                        >
                          View all
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.accrodionWrap}>
                    <Accordion alwaysOpen>
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>Health</Accordion.Header>
                        <Accordion.Body>
                          {rightData != undefined && (
                            <>
                              {rightData.map((item) => {
                                let type = item.data_type;
                                if (
                                  type == "heart_rate" ||
                                  type == "glucose" ||
                                  type == "blood_pressure" ||
                                  type == "medication"
                                ) {
                                  return (
                                    <div
                                      className={`theme_border ${styles.diagnosisCard}`}
                                      key={item.id}
                                    >
                                      <span className={styles.cardIcon}>
                                        {type == "heart_rate" ? (
                                          <HeartIcon />
                                        ) : type == "glucose" ? (
                                          <GlucoseIcon />
                                        ) : type == "blood_pressure" ? (
                                          <BPIcon />
                                        ) : type == "medication" ? (
                                          <MedicationIcon />
                                        ) : null}
                                      </span>
                                      <div className={styles.card_content}>
                                        <div className={styles.card_tittle}>
                                          <h5>
                                            {type == "heart_rate"
                                              ? `Heart Rate`
                                              : type == "glucose"
                                              ? `Glucose`
                                              : type == "blood_pressure"
                                              ? `Blood pressure`
                                              : type == "medication"
                                              ? `Medication`
                                              : null}
                                          </h5>
                                          <span
                                            className={styles.card_schedule}
                                            onClick={() => {
                                              toggleSidebar(
                                                type == "heart_rate"
                                                  ? `Heart Rate`
                                                  : type == "glucose"
                                                  ? `Glucose`
                                                  : type == "blood_pressure"
                                                  ? `Blood pressure`
                                                  : type == "medication"
                                                  ? `Medication`
                                                  : ""
                                              );
                                            }}
                                          >
                                            <ScheduleIcon />
                                          </span>
                                        </div>
                                        <>
                                          <div className={styles.cardText}>
                                            <span>
                                              {item.data_source == "device" &&
                                                `Measured by ${item.device?.name}`}
                                            </span>
                                            <span>
                                              {moment(item.modified).calendar()}
                                            </span>
                                          </div>
                                          <div className={styles.cardUnit}>
                                            <h6>
                                              {item.data_sub_type != null &&
                                              item.data_sub_type != undefined
                                                ? item.data_sub_type
                                                : item.value}
                                              <span>
                                                {item.data_sub_type != null &&
                                                item.data_sub_type != undefined
                                                  ? `${item.value} ${item.unit}`
                                                  : item.unit}
                                              </span>
                                            </h6>
                                            {item.value_change &&
                                            item.value_change != 0 ? (
                                              <span
                                                className={styles.unitChanges}
                                              >
                                                <span
                                                  style={{
                                                    transform:
                                                      Math.sign(
                                                        item.value_change
                                                      ) == -1
                                                        ? `rotate(180deg)`
                                                        : `rotate(0deg)`,
                                                    color:
                                                      Math.sign(
                                                        item.value_change
                                                      ) == -1
                                                        ? "#fe5500"
                                                        : "#1caec9",
                                                  }}
                                                >
                                                  <DownArrowIcon />
                                                </span>
                                                {item.value_change}
                                                {item.unit != undefined &&
                                                  ` ${item.unit}`}
                                              </span>
                                            ) : null}
                                          </div>
                                        </>
                                      </div>
                                    </div>
                                  );
                                }
                              })}
                              {rightData.filter((item) => {
                                let type = item.data_type;
                                return (
                                  type == "heart_rate" ||
                                  type == "glucose" ||
                                  type == "blood_pressure" ||
                                  type == "medication"
                                );
                              }).length == 0 && <p>No Data Found</p>}
                            </>
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                      <Accordion.Item eventKey="1">
                        <Accordion.Header>Fitness</Accordion.Header>
                        <Accordion.Body>
                          {rightData != undefined && (
                            <>
                              {rightData.map((item) => {
                                let type = item.data_type;
                                if (type == "activity" || type == "steps") {
                                  return (
                                    <div
                                      className={`theme_border ${styles.diagnosisCard}`}
                                      key={item.id}
                                    >
                                      <span className={styles.cardIcon}>
                                        {type == "activity" ? (
                                          <ActivityIcon />
                                        ) : type == "steps" ? (
                                          <StepsIcon />
                                        ) : null}
                                      </span>
                                      <div className={styles.card_content}>
                                        <div className={styles.card_tittle}>
                                          <h5>
                                            {type == "activity"
                                              ? `Activity`
                                              : type == "steps"
                                              ? `Steps`
                                              : null}
                                          </h5>
                                          <span
                                            className={styles.card_schedule}
                                            onClick={() => {
                                              toggleSidebar(
                                                type == "activity"
                                                  ? `Activity`
                                                  : type == "steps"
                                                  ? `Steps`
                                                  : ""
                                              );
                                            }}
                                          >
                                            <ScheduleIcon />
                                          </span>
                                        </div>
                                        <>
                                          <div className={styles.cardText}>
                                            <span>
                                              {item.data_source == "device" &&
                                                `Measured by ${item.device?.name}`}
                                            </span>
                                            <span>
                                              {moment(item.modified).calendar()}
                                            </span>
                                          </div>
                                          <div className={styles.cardUnit}>
                                            <h6>
                                              {item.data_sub_type != null &&
                                              item.data_sub_type != undefined
                                                ? item.data_sub_type
                                                : item.value}
                                              <span>
                                                {item.data_sub_type != null &&
                                                item.data_sub_type != undefined
                                                  ? `${item.value} ${item.unit}`
                                                  : item.unit}
                                              </span>
                                            </h6>
                                            {item.value_change &&
                                            item.value_change != 0 ? (
                                              <span
                                                className={styles.unitChanges}
                                              >
                                                <span
                                                  style={{
                                                    transform:
                                                      Math.sign(
                                                        item.value_change
                                                      ) == -1
                                                        ? `rotate(180deg)`
                                                        : `rotate(0deg)`,
                                                    color:
                                                      Math.sign(
                                                        item.value_change
                                                      ) == -1
                                                        ? "#fe5500"
                                                        : "#1caec9",
                                                  }}
                                                >
                                                  <DownArrowIcon />
                                                </span>
                                                {item.value_change}
                                                {item.unit != undefined &&
                                                  ` ${item.unit}`}
                                              </span>
                                            ) : null}
                                          </div>
                                        </>
                                      </div>
                                    </div>
                                  );
                                }
                              })}
                              {rightData.filter((item) => {
                                let type = item.data_type;
                                return type == "activity" || type == "steps";
                              }).length == 0 && <p>No Data Found</p>}
                            </>
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                      <Accordion.Item eventKey="2">
                        <Accordion.Header>Lifestyle</Accordion.Header>
                        <Accordion.Body>
                          {rightData != undefined && (
                            <>
                              {rightData.map((item) => {
                                let type = item.data_type;
                                if (
                                  type == "weight" ||
                                  type == "hydration" ||
                                  type == "alcohol" ||
                                  type == "cigarette" ||
                                  type == "sleep_in_bed" ||
                                  type == "food"
                                ) {
                                  return (
                                    <div
                                      className={`theme_border ${styles.diagnosisCard}`}
                                      key={item.id}
                                    >
                                      <span className={styles.cardIcon}>
                                        {type == "weight" ? (
                                          <WeightIcon />
                                        ) : type == "hydration" ? (
                                          <HydrationIcon />
                                        ) : type == "alcohol" ? (
                                          <AlcoholIcon />
                                        ) : type == "cigarette" ? (
                                          <SmokingIcon />
                                        ) : type == "sleep_in_bed" ? (
                                          <SleepIcon />
                                        ) : type == "food" ? (
                                          <FoodIcon />
                                        ) : null}
                                      </span>
                                      <div className={styles.card_content}>
                                        <div className={styles.card_tittle}>
                                          <h5>
                                            {type == "weight"
                                              ? `Weight`
                                              : type == "hydration"
                                              ? `Hydration`
                                              : type == "alcohol"
                                              ? `Alcohol`
                                              : type == "cigarette"
                                              ? `Smoking`
                                              : type == "sleep_in_bed"
                                              ? `Sleep`
                                              : type == "food"
                                              ? `Food Log`
                                              : null}
                                          </h5>
                                          <span
                                            className={styles.card_schedule}
                                            onClick={() => {
                                              toggleSidebar(
                                                type == "weight"
                                                  ? `Weight`
                                                  : type == "hydration"
                                                  ? `Hydration`
                                                  : type == "alcohol"
                                                  ? `Alcohol`
                                                  : type == "cigarette"
                                                  ? `Smoking`
                                                  : type == "sleep_in_bed"
                                                  ? `Sleep`
                                                  : ""
                                              );
                                            }}
                                          >
                                            <ScheduleIcon />
                                          </span>
                                        </div>
                                        {type == "food" ? (
                                          <>
                                            <div className={styles.cardText}>
                                              <p>Burger, meat, orange juice</p>
                                            </div>
                                            <div className={styles.cardImages}>
                                              <span className={styles.image}>
                                                <Image
                                                  alt=""
                                                  src={
                                                    item.file != undefined &&
                                                    item.file != null &&
                                                    item.file != ""
                                                      ? imageData.food
                                                      : profile_placeholder.src
                                                  }
                                                ></Image>
                                              </span>
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <div className={styles.cardText}>
                                              <span>
                                                {item.data_source == "device" &&
                                                  `Measured by ${item.device?.name}`}
                                              </span>
                                              <span>
                                                {moment(
                                                  item.modified
                                                ).calendar()}
                                              </span>
                                            </div>
                                            <div className={styles.cardUnit}>
                                              <h6>
                                                {item.data_sub_type != null &&
                                                item.data_sub_type != undefined
                                                  ? item.data_sub_type
                                                  : item.value}
                                                <span>
                                                  {item.data_sub_type != null &&
                                                  item.data_sub_type !=
                                                    undefined
                                                    ? `${item.value} ${item.unit}`
                                                    : item.unit}
                                                </span>
                                              </h6>
                                              {item.value_change &&
                                              item.value_change != 0 ? (
                                                <span
                                                  className={styles.unitChanges}
                                                >
                                                  <span
                                                    style={{
                                                      transform:
                                                        Math.sign(
                                                          item.value_change
                                                        ) == -1
                                                          ? `rotate(180deg)`
                                                          : `rotate(0deg)`,
                                                      color:
                                                        Math.sign(
                                                          item.value_change
                                                        ) == -1
                                                          ? "#fe5500"
                                                          : "#1caec9",
                                                    }}
                                                  >
                                                    <DownArrowIcon />
                                                  </span>
                                                  {item.value_change}
                                                  {item.unit != undefined &&
                                                    ` ${item.unit}`}
                                                </span>
                                              ) : null}
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  );
                                }
                              })}
                              {rightData.filter((item) => {
                                let type = item.data_type;
                                return (
                                  type == "weight" ||
                                  type == "hydration" ||
                                  type == "alcohol" ||
                                  type == "cigarette" ||
                                  type == "sleep_in_bed" ||
                                  type == "food"
                                );
                              }).length == 0 && <p>No Data Found</p>}
                            </>
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  </div>

                  {/* {medicationCards.map((item, index) => (
                    <div
                      className={`theme_border ${styles.diagnosisCard}`}
                      key={index}
                    >
                      <span className={styles.cardIcon}>{item.cardIcon}</span>
                      <div className={styles.card_content}>
                        <div className={styles.card_tittle}>
                          <h5>{item.title}</h5>
                          <span
                            className={styles.card_schedule}
                            onClick={() => {
                              toggleSidebar(item.title);
                            }}
                          >
                            <ScheduleIcon />
                          </span>
                        </div>
                        {item.foodCard ? (
                          <>
                            <div className={styles.cardText}>
                              <p>Burger, meat, orange juice</p>
                            </div>
                            <div className={styles.cardImages}>
                              <span className={styles.image}>
                                <Image src={Food1} alt="food image" />
                              </span>
                              <span className={styles.image}>
                                <Image src={Food2} alt="food image" />
                              </span>
                              <span className={styles.image}>
                                <Image src={Food3} alt="food image" />
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className={styles.cardText}>
                              <span>{item.description}</span>
                              <span>{item.time}</span>
                            </div>
                            <div className={styles.cardUnit}>
                              <h6>
                                {item.value}
                                <span>{item.unit}</span>
                              </h6>
                              {item.valueChanges ? (
                                <span className={styles.unitChanges}>
                                  <DownArrowIcon />
                                  {item.valueChanges}
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))} */}

                  {/* <div className={`theme_border mb-0 ${styles.diagnosisCard}`}>
                    <span className={styles.cardIcon}>
                      <GlucoseIcon />
                    </span>
                    <div className={styles.card_content}>
                      <div className={styles.card_tittle}>
                        <h5>Glucose</h5>
                        <span
                          className={styles.card_schedule}
                          onClick={toggleGlucoseSidebar}
                        >
                          <ScheduleIcon />
                        </span>
                      </div>
                      <div className={styles.cardText}>
                        <span>Measured by MiScale</span>
                        <span>Today, 8:04 pm</span>
                      </div>
                      <div className={styles.cardUnit}>
                        <h6>
                          60<span>mg/dL</span>
                        </h6>
                        <span className={styles.unitChanges}>
                          <DownArrowIcon />5 mg/dL
                        </span>
                      </div>
                    </div>
                  </div> */}
                </div>
              </Col>
            </Row>
          </div>
          <DevicesSidebar
            setDeviceSidebar={setDeviceSidebar}
            openSidebar={deviceSidebar}
          />
          <DrawerLayout
            toggleSidebar={setBloodPressureSidebar}
            openSidebar={bloodPressureSidebar}
            title="Blood pressure History"
          >
            <BloodPressureHistory />
          </DrawerLayout>
          <DrawerLayout
            toggleSidebar={toggleWeightSidebar}
            openSidebar={weightPressureSidebar}
            title="Weight History"
          >
            <WeightHistory />
          </DrawerLayout>
          <DrawerLayout
            toggleSidebar={toggleGlucoseSidebar}
            openSidebar={glucoseSidebar}
            title="Glucose History"
          >
            <GlucoseSidebar />
          </DrawerLayout>
          <DrawerLayout
            toggleSidebar={toggleFoodSidebar}
            openSidebar={foodSidebar}
            title="Food History"
          >
            <FoodSidebar />
          </DrawerLayout>
        </div>
      </DashboardLayout>
    </>
  );
}

export default PatientProfile;
