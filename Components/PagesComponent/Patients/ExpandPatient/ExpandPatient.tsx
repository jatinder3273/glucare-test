import React, { useEffect, useState } from "react";
import styles from "./ExpandPatient.module.scss";
import DoctorImage from "@assets/doctor.png";
import Image from "next/image";
import {
  BPIcon,
  DownArrowIcon,
  GlucoseIcon,
  MedicationIcon,
  ScheduleIcon,
  WeightIcon,
} from "@components/Common/Icons/Icons";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "redux/store";
import { fetch_doctor, fetch_patient_right_data } from "redux/Patient/action";
import moment from "moment";
import _ from "lodash";
import { Spinner } from "react-bootstrap";

interface profileType {
  staff_user: {
    first_name: string;
    last_name: string;
    job_title: {
      name: string;
    };
  };
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

const ExpandPatient = ({ data }: any) => {
  const doctorData = useSelector(
    (state: any) => state.patient.profile.fetch_doctor
  );
  const rightData = useSelector(
    (state: any) => state.patient.profile.patient_right_data
  );
  const dispatch = useDispatch<AppDispatch>();
  const [profileData, setProfileData] = useState<profileType>(
    {} as profileType
  );
  const [profileRightData, setProfileRightData] = useState<any>();

  useEffect(() => {
    dispatch(
      fetch_doctor({
        type: "1",
        patient_user: data.user,
      })
    );
    dispatch(
      fetch_patient_right_data({
        id: data.user.toString(),
      })
    );
  }, []);

  useEffect(() => {
    if (doctorData != undefined && doctorData[data.user]) {
      setProfileData(doctorData[data.user]);
    }
  }, [doctorData]);

  useEffect(() => {
    if (rightData != undefined && rightData[data.user]) {
      setProfileRightData(_.uniqBy(rightData[data.user], "data_type"));
    }
  }, [rightData]);

  return (
    <div className={styles.expandWrap}>
      <div className={styles.wrap1}>
        <div className={styles.first}>
          {/* <div className={styles.profileDetail_singleField}>
            <label>Email</label>
            <p>jacobdaniel@gmail.com</p>
          </div> */}
          <div className={styles.profileDetail_singleField}>
            <label>Phone number</label>
            <p>{data.contact_no != null ? data.contact_no : "NA"}</p>
          </div>
          <div className={styles.profileDetail_singleField}>
            <label>Age</label>
            <p>{data.age != null ? data.age : "NA"}</p>
          </div>
          <div className={styles.profileDetail_singleField}>
            <label>Gender</label>
            <p>{data.gender != null ? data.gender : "NA"}</p>
          </div>
        </div>
        <div className={styles.second}>
          <div className={styles.profileDetail_singleField}>
            <label>Primary doctor</label>
            {Object.keys(profileData).length != 0 ? (
              <div className={styles.profileDetail_doctor}>
                <span className={styles.image}>
                  <Image src={DoctorImage} alt="Doctor Image" />
                </span>
                <div className={styles.doctorName}>
                  <h6>
                    {`Dr. ${profileData.staff_user.first_name} ${profileData.staff_user.last_name}`}
                  </h6>
                  <span>{profileData.staff_user.job_title.name}</span>
                </div>
              </div>
            ) : (
              <p>NA</p>
            )}
          </div>
          <div className={styles.profileDetail_singleField}>
            <label>Diagnosis</label>
            <p>{data.diagnoses.length < 1 ? "NA" : data.diagnoses[0].name}</p>
          </div>
        </div>
      </div>
      <div className={styles.wrap2}>
        <div className={styles.third}>
          <div className={styles.profileDetail_singleField}>
            <label>Statistic Info</label>

            <div className={styles.cardsWrap}>
              {profileRightData != undefined ? (
                <>
                  {profileRightData.map((item: rightDataType) => {
                    let type = item.data_type;
                    if (
                      type == "weight" ||
                      type == "glucose" ||
                      type == "blood_pressure" ||
                      (type == "medication" && item.data_sub_type == "Insulin")
                    ) {
                      return (
                        <div
                          className={`theme_border ${styles.diagnosisCard}`}
                          key={item.id}
                        >
                          <span className={styles.cardIcon}>
                            {type == "weight" ? (
                              <WeightIcon />
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
                                {type == "weight"
                                  ? `Weight`
                                  : type == "glucose"
                                  ? `Glucose`
                                  : type == "blood_pressure"
                                  ? `Blood pressure`
                                  : type == "medication"
                                  ? `Medication`
                                  : null}
                              </h5>
                            </div>
                            <>
                              <div className={styles.cardText}>
                                <span>
                                  {item.data_source == "device" &&
                                    `Measured by ${item.device?.name}`}
                                </span>
                                <span>{moment(item.modified).calendar()}</span>
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
                                {item.value_change && item.value_change != 0 ? (
                                  <span className={styles.unitChanges}>
                                    <span
                                      style={{
                                        transform:
                                          Math.sign(item.value_change) == -1
                                            ? `rotate(180deg)`
                                            : `rotate(0deg)`,
                                        color:
                                          Math.sign(item.value_change) == -1
                                            ? "#fe5500"
                                            : "#1caec9",
                                      }}
                                    >
                                      <DownArrowIcon />
                                    </span>
                                    {item.value_change}
                                    {item.unit != undefined && ` ${item.unit}`}
                                  </span>
                                ) : null}
                              </div>
                            </>
                          </div>
                        </div>
                      );
                    }
                  })}{" "}
                  {profileRightData.filter(
                    (item: rightDataType) =>
                      item.data_type == "weight" ||
                      item.data_type == "glucose" ||
                      item.data_type == "blood_pressure" ||
                      item.data_type == "medication"
                  ).length == 0 ? (
                    <>
                      <div className={`theme_border ${styles.diagnosisCard}`}>
                        <span className={styles.cardIcon}>
                          <BPIcon />
                        </span>
                        <div className={styles.card_content}>
                          <div className={styles.card_tittle}>
                            <h5>Blood pressure</h5>
                          </div>
                          <>
                            <div className={styles.cardText}>No Data Found</div>
                          </>
                        </div>
                      </div>
                      <div className={`theme_border ${styles.diagnosisCard}`}>
                        <span className={styles.cardIcon}>
                          <GlucoseIcon />
                        </span>
                        <div className={styles.card_content}>
                          <div className={styles.card_tittle}>
                            <h5>Glucose</h5>
                          </div>
                          <>
                            <div className={styles.cardText}>No Data Found</div>
                          </>
                        </div>
                      </div>
                      <div className={`theme_border ${styles.diagnosisCard}`}>
                        <span className={styles.cardIcon}>
                          <WeightIcon />
                        </span>
                        <div className={styles.card_content}>
                          <div className={styles.card_tittle}>
                            <h5>Weight</h5>
                          </div>
                          <>
                            <div className={styles.cardText}>No Data Found</div>
                          </>
                        </div>
                      </div>
                      <div className={`theme_border ${styles.diagnosisCard}`}>
                        <span className={styles.cardIcon}>
                          <MedicationIcon />
                        </span>
                        <div className={styles.card_content}>
                          <div className={styles.card_tittle}>
                            <h5>Medication</h5>
                          </div>
                          <>
                            <div className={styles.cardText}>No Data Found</div>
                          </>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {profileRightData
                        .filter(
                          (item: rightDataType) =>
                            item.data_type == "weight" ||
                            item.data_type == "glucose" ||
                            item.data_type == "blood_pressure" ||
                            item.data_type == "medication"
                        )
                        .filter(
                          (item: rightDataType) =>
                            item.data_type == "blood_pressure"
                        ).length == 0 && (
                        <div className={`theme_border ${styles.diagnosisCard}`}>
                          <span className={styles.cardIcon}>
                            <BPIcon />
                          </span>
                          <div className={styles.card_content}>
                            <div className={styles.card_tittle}>
                              <h5>Blood pressure</h5>
                            </div>
                            <>
                              <div className={styles.cardText}>
                                No Data Found
                              </div>
                            </>
                          </div>
                        </div>
                      )}
                      {profileRightData
                        .filter(
                          (item: rightDataType) =>
                            item.data_type == "weight" ||
                            item.data_type == "glucose" ||
                            item.data_type == "blood_pressure" ||
                            item.data_type == "medication"
                        )
                        .filter(
                          (item: rightDataType) => item.data_type == "glucose"
                        ).length == 0 && (
                        <div className={`theme_border ${styles.diagnosisCard}`}>
                          <span className={styles.cardIcon}>
                            <GlucoseIcon />
                          </span>
                          <div className={styles.card_content}>
                            <div className={styles.card_tittle}>
                              <h5>Glucose</h5>
                            </div>
                            <>
                              <div className={styles.cardText}>
                                No Data Found
                              </div>
                            </>
                          </div>
                        </div>
                      )}
                      {profileRightData
                        .filter(
                          (item: rightDataType) =>
                            item.data_type == "weight" ||
                            item.data_type == "glucose" ||
                            item.data_type == "blood_pressure" ||
                            item.data_type == "medication"
                        )
                        .filter(
                          (item: rightDataType) => item.data_type == "weight"
                        ).length == 0 && (
                        <div className={`theme_border ${styles.diagnosisCard}`}>
                          <span className={styles.cardIcon}>
                            <WeightIcon />
                          </span>
                          <div className={styles.card_content}>
                            <div className={styles.card_tittle}>
                              <h5>Weight</h5>
                            </div>
                            <>
                              <div className={styles.cardText}>
                                No Data Found
                              </div>
                            </>
                          </div>
                        </div>
                      )}
                      {profileRightData
                        .filter(
                          (item: rightDataType) =>
                            item.data_type == "weight" ||
                            item.data_type == "glucose" ||
                            item.data_type == "blood_pressure" ||
                            item.data_type == "medication"
                        )
                        .filter(
                          (item: rightDataType) =>
                            item.data_type == "medication"
                        ).length == 0 && (
                        <div className={`theme_border ${styles.diagnosisCard}`}>
                          <span className={styles.cardIcon}>
                            <MedicationIcon />
                          </span>
                          <div className={styles.card_content}>
                            <div className={styles.card_tittle}>
                              <h5>Medication</h5>
                            </div>
                            <>
                              <div className={styles.cardText}>
                                No Data Found
                              </div>
                            </>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div className={styles.ceterData}>
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden text-center">
                      Loading...
                    </span>
                  </Spinner>
                </div>
              )}
              {/* <div className={`theme_border ${styles.diagnosisCard}`}>
                <span className={styles.cardIcon}>
                  <BPIcon />
                </span>
                <div className={styles.card_content}>
                  <div className={styles.card_tittle}>
                    <h5>Blood pressure</h5>
                  </div>
                  <>
                    <div className={styles.cardText}>
                      <span>Measured by Apple Watch</span>
                    </div>
                    <div className={styles.cardUnit}>
                      <h6>
                        140/100
                        <span>mm/Hg</span>
                      </h6>
                      {"+0.2 kg" ? (
                        <span
                          className={styles.unitChanges}
                          style={{ backgroundColor: "#FBE9E5" }}
                        >
                          Heavy
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </>
                </div>
              </div>

              <div className={`theme_border ${styles.diagnosisCard}`}>
                <span className={styles.cardIcon}>
                  <GlucoseIcon />
                </span>
                <div className={styles.card_content}>
                  <div className={styles.card_tittle}>
                    <h5>Glucose</h5>
                  </div>
                  <>
                    <div className={styles.cardText}>
                      <span>Measured by Apple Watch</span>
                    </div>
                    <div className={styles.cardUnit}>
                      <h6>
                        60
                        <span>mg/dL</span>
                      </h6>
                      {"+0.2 kg" ? (
                        <span className={styles.unitChanges}>
                          <DownArrowIcon />5 mg/dL
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </>
                </div>
              </div>

              <div className={`theme_border ${styles.diagnosisCard}`}>
                <span className={styles.cardIcon}>
                  <WeightIcon />
                </span>
                <div className={styles.card_content}>
                  <div className={styles.card_tittle}>
                    <h5>Weight</h5>
                  </div>
                  <>
                    <div className={styles.cardText}>
                      <span>Measured by MiScale</span>
                    </div>
                    <div className={styles.cardUnit}>
                      <h6>
                        54
                        <span>kg</span>
                      </h6>
                      {"+0.2 kg" ? (
                        <span className={styles.unitChanges}>
                          <DownArrowIcon />
                          +0.2 kg
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </>
                </div>
              </div>

              <div className={`theme_border ${styles.diagnosisCard}`}>
                <span className={styles.cardIcon}>
                  <MedicationIcon />
                </span>
                <div className={styles.card_content}>
                  <div className={styles.card_tittle}>
                    <h5>Medication</h5>
                  </div>
                  <>
                    <div className={styles.cardText}>
                      <span>Insulin</span>
                    </div>
                    <div
                      className={styles.cardUnit}
                      style={{ paddingRight: "50px" }}
                    >
                      <h6>
                        <span style={{ margin: "0px" }}>Rapid </span>
                        60
                        <span>u.</span>
                      </h6>
                      <h6>
                        <span>Basal </span>
                        65
                        <span>u.</span>
                      </h6>
                    </div>
                  </>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandPatient;
