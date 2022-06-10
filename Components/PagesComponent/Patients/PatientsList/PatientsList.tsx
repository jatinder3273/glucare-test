/* eslint-disable @next/next/no-img-element */
// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import styles from "./PatientsList.module.scss";
import DataTable from "react-data-table-component";
import patientImage from "@assets/icons/patientImage.svg";
import ExpandPatient from "../ExpandPatient/ExpandPatient";
import ModalLayout from "@components/Layouts/ModalLayout";
import { Form, Image } from "react-bootstrap";
import Select from "react-select";
import { FormCheckIcon } from "@components/Common/Icons/Icons";
import { CloseIcon } from "@components/Common/Icons/common";
import useTranslation from "next-translate/useTranslation";
import profile_placeholder from "@assets/icons/profile_placeholder.svg";

import {
  OptionIcon,
  StatusIcon,
  UpArrowIcon,
  EditIcon,
  UsersIcon,
  AddNotesIcon,
  SendMessageIcon,
  ArchiveIcon,
} from "../../../Common/Icons/Icons";
import { Dropdown } from "react-bootstrap";
import Link from "next/link";

interface DoctorOption {
  readonly value: string;
  readonly label: string;
  readonly img: any;
}

interface IProps {
  data: { avatar: null | string; user: number }[];
}

const primaryDoctorOptions: readonly DoctorOption[] = [
  {
    value: "Dr. Jacob Jones",
    label: "Dr. Jacob Jones",
    img: "https://randomuser.me/api/portraits/men/71.jpg",
  },
  {
    value: "Dr. Guy Hawkins",
    label: "Dr. Guy Hawkins",
    img: "https://randomuser.me/api/portraits/men/80.jpg",
  },
  {
    value: "Dr. Robert Fox",
    label: "Dr. Robert Fox",
    img: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    value: "Dr. Jenny Wilson",
    label: "Dr. Jenny Wilson",
    img: "https://randomuser.me/api/portraits/men/58.jpg",
  },
];

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "redux/store";
import { reset_profile } from "redux/Patient/action";
import { setPatientId } from "redux/Patient/action";
import { getImage } from "redux/Image/action";

interface ImageProp {
  device: any;
  errors: any;
  food: string;
  loading: boolean;
  success: boolean;
  user: any;
}
const PatientsList = ({ data }: IProps) => {
  const { t } = useTranslation("patient");
  const [uploadReportModal, setUploadReportModal] = useState(false);
  const selectInputRef = useRef<any | null>(null);
  const [showReasignMessage, setShowReasignMessage] = useState(false);
  const imageData = useSelector((state: { image: ImageProp }) => state.image);
  const [callApi, setCallApi] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  const toggleUploadReportModal = () => {
    setShowReasignMessage(false);
    setUploadReportModal(!uploadReportModal);
  };
  const handleReasignClick = () => {
    if (showReasignMessage) {
      setUploadReportModal(!uploadReportModal);
    } else {
      setShowReasignMessage(true);
    }
  };
  const PatientImgData = ({ row }: any) => {
    return (
      <Link href={{ pathname: "/patient/profile" }} passHref={true}>
        <span
          className={styles.patientImgWrap}
          onClick={() => {
            dispatch(reset_profile());
            localStorage.setItem("patientId", row.id);
            localStorage.setItem("userId", row.user);
          }}
        >
          <span className={styles.patientImg}>
            <Image
              src={
                row.avatar !== null && imageData.user[row.user] != undefined
                  ? imageData.user[row.user]
                  : profile_placeholder.src
              }
            ></Image>
          </span>
          <span className={styles.patientNameWrap}>
            <div className={styles.patientName}>{`${
              row.first_name != undefined ? row.first_name : ""
            } ${row.last_name != undefined ? row.last_name : ""}`}</div>
            <div className={styles.patientNumber}>
              {row.contact_no != null ? row.contact_no : "NA"}
            </div>
          </span>
        </span>
      </Link>
    );
  };

  const Weight = ({ row }: any) => {
    return (
      <span className={styles.weightWrap}>
        <span className={styles.weight}>
          {row.weight_last_value != null ? `${row.weight_last_value}kg` : "NA"}
        </span>
        {/* <span
          style={{
            color: row.weight_last_value[0] == "+" ? "#21B089" : "#FE5500",
          }}
          className={styles.changeInWeightWrap}
        >
          <span
            className={row.weight_last_value[0] == "+" ? "" : styles.arrowDown}
          >
            <UpArrowIcon />
          </span>
          <span className={styles.changeInWeightText}>"null"</span>
        </span> */}
      </span>
    );
  };

  const Status = ({ row }: any) => {
    return (
      <span className={styles.statusWrap}>
        <span
          style={{
            color:
              row.status == "approved"
                ? "#1CAEC9"
                : row.status == "invited"
                ? "#5369B9"
                : "#FDBD28",
          }}
          className={styles.statusIcon}
        >
          <StatusIcon />
        </span>
        <span className={styles.statusText}>{row.status}</span>
      </span>
    );
  };

  const Option = ({ row }: any) => {
    return (
      <span style={{ color: "#818496" }} className={styles.option}>
        <Dropdown className={styles.headerProfile_dropdown}>
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
            <Dropdown.Item as="li" onClick={toggleUploadReportModal}>
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
      </span>
    );
  };

  const columns = [
    {
      cell: (row: any) => <PatientImgData row={row} />,
      name: t("patient"),
      selector: (row: any) => `${row.first_name} ${row.last_name}`,
      sortable: true,
      minWidth: "185px",
    },
    {
      name: t("diagnosis"),
      selector: (row: any) =>
        row.diagnoses.length < 1 ? "NA" : row.diagnoses[0].name,
      sortable: true,
      minWidth: "185px",
    },
    {
      name: t("cgm"),
      selector: (row: any) =>
        row.cgm_last_value != null ? row.cgm_last_value : "NA",
      sortable: true,
      minWidth: "100px",
    },
    {
      name: t("escore"),
      selector: (row: any) => "NA",
      sortable: true,
      minWidth: "110px",
    },
    {
      name: t("food_log"),
      selector: (row: any) =>
        row.food_log_count != null ? row.food_log_count : "NA",
      sortable: true,
      minWidth: "120px",
    },
    {
      name: t("weight"),
      selector: (row: any) =>
        row.weight_last_value != null ? row.weight_last_value : "NA",
      cell: (row: any) => <Weight row={row} />,
      sortable: true,
      minWidth: "190px",
    },
    {
      name: t("chat_active"),
      selector: (row: any) => "NA",
      sortable: true,
      minWidth: "145px",
    },
    {
      name: t("status"),
      selector: (row: any) => (row.status != null ? row.status : "NA"),
      cell: (row: any) => <Status row={row} />,
      sortable: true,
      minWidth: "122px",
    },
    {
      selector: (row: any) => row.option,
      cell: (row: any) => <Option row={row} />,
      width: "64px",
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        color: "#6C7893",
      },
    },
    rows: {
      style: {
        height: "64px",
        marginBottom: "-1px",
      },
    },
  };

  useEffect(() => {
    if (callApi && data.length != 0) {
      data.map((da: { avatar: string | null; user: number }) => {
        if (da.avatar != null) {
          dispatch(
            getImage({
              url: da.avatar,
              id: da.user,
              type: "user",
            })
          );
        }
      });
      setCallApi(false);
    }
  }, [data]);

  return (
    <div className={styles.PatientsListWrap}>
      <DataTable
        columns={columns}
        data={data}
        expandableRows
        expandableRowsComponent={ExpandPatient}
        selectableRows
        defaultSortFieldId={1}
        customStyles={customStyles}
      />
      <ModalLayout
        openModal={uploadReportModal}
        toggleModal={toggleUploadReportModal}
        title={t("reasign_doctor")}
      >
        <div className="my-4">
          {!showReasignMessage ? (
            <Form.Group controlId="formPrimaryDoctor">
              <Form.Label>{t("primary_doctor")}</Form.Label>
              <div className={styles.primaryDoctorWrap}>
                <Select
                  ref={selectInputRef}
                  createOptionPosition="first"
                  menuPlacement="top"
                  name="primarydoctor"
                  options={primaryDoctorOptions}
                  className={styles.primaryDoctor}
                  classNamePrefix="filter"
                  placeholder={t("select_doctor")}
                  isClearable={false}
                  closeMenuOnSelect={true}
                  // @ts-ignore
                  getOptionLabel={(e) => (
                    <div className={styles.menuItemWrap}>
                      <div className={styles.menuItem_detail}>
                        <img
                          alt=""
                          src={e.img}
                          style={{
                            height: "32px",
                            width: "32px",
                            borderRadius: "50%",
                          }}
                        />
                        <p
                          style={{
                            marginLeft: "16px",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            color: "black",
                          }}
                        >
                          {e.label}
                        </p>
                      </div>
                      <div className={styles.menuItem_check}>
                        <FormCheckIcon />
                      </div>
                      <div className={styles.menuItem_close}>
                        <CloseIcon />
                      </div>
                    </div>
                  )}
                />
              </div>
            </Form.Group>
          ) : (
            <span>
              Are you sure that you want to reassign the doctor for patients?{" "}
              <br /> Patients will be notified about this change.
            </span>
          )}
        </div>
        <div>
          <button
            type="button"
            className="btn filled me-3"
            onClick={handleReasignClick}
          >
            {!showReasignMessage ? t("reasign") : t("yes")}
          </button>
          <button
            type="button"
            className="btn outline"
            onClick={toggleUploadReportModal}
          >
            {t("cancel")}
          </button>
        </div>
      </ModalLayout>
    </div>
  );
};

export default PatientsList;
