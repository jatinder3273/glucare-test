/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState } from "react";
import styles from "./AddPatient.module.scss";
import { Form } from "react-bootstrap";
import { FormCheckIcon } from "@components/Common/Icons/Icons";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import Image from "next/image";
import CardPickImg from "@assets/icons/cardPickImg.svg";
import Select from "react-select";
import { CloseIcon } from "@components/Common/Icons/common";
import SelectDoctors from "../SelectDoctors/SelectDoctors";
import useTranslation from "next-translate/useTranslation";

interface Option {
  readonly value: string;
  readonly label: string;
}

interface IProps {
  setDeviceSidebar: (action: any) => any;
}

interface DoctorOption {
  readonly value: string;
  readonly label: string;
  readonly img: string;
}

const options: readonly Option[] = [
  { value: "Diabetes 1 type", label: "Diabetes 1 type" },
  { value: "Diabetes 2 type", label: "Diabetes 2 type" },
  { value: "Diabetes 3 type", label: "Diabetes 3 type" },
  { value: "Diabetes 4 type", label: "Diabetes 4 type" },
];

const medicationOptions: readonly Option[] = [
  { value: "Peniciline", label: "Peniciline" },
  { value: "Vitamin D3", label: "Vitamin D3" },
  { value: "Peniciline 2", label: "Peniciline 2" },
  { value: "Vitamin D4", label: "Vitamin D4" },
];

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

const AddPatient = ({ setDeviceSidebar }: IProps) => {
  const { t } = useTranslation("patient");
  const [value, setValue] = useState<string>("");
  const [idCardImage, setIdCardImage] = useState<string>("");

  const selectInputRef = useRef<any | null>(null);

  return (
    <div className={styles.wrap}>
      <span className={styles.infoTxt}>{t("personal_info")}</span>
      <Form className={styles.form}>
        <div className={styles.formFields}>
          <Form.Group controlId="formFirstName">
            <Form.Label>{t("first_name")}</Form.Label>
            <Form.Control type="text" placeholder={t("first_name")} />
          </Form.Group>
          <Form.Group controlId="formLastName">
            <Form.Label>{t("last_name")}</Form.Label>
            <Form.Control type="text" placeholder={t("last_name")} />
          </Form.Group>
          <Form.Group controlId="formDOB">
            <Form.Label>{t("date_of_birth")}</Form.Label>
            <Form.Control type="date" placeholder="mm/dd/yyyy" />
          </Form.Group>
          <Form.Group controlId="selectGender">
            <Form.Label>{t("select_gender")}</Form.Label>

            <div className={styles.radio}>
              <div className={styles.radioCheck}>
                <input type="radio" name="gender" id="male" />
                <label htmlFor="male">
                  {t("male")}
                  <span className={styles.checkIcon}>
                    <FormCheckIcon />
                  </span>
                </label>
              </div>
              <div className={styles.radioCheck}>
                <input type="radio" name="gender" id="female" />
                <label htmlFor="female">
                  {t("female")}
                  <span className={styles.checkIcon}>
                    <FormCheckIcon />
                  </span>
                </label>
              </div>
              <div className={styles.radioCheck}>
                <input type="radio" name="gender" id="other" />
                <label htmlFor="other">
                  {t("other")}
                  <span className={styles.checkIcon}>
                    <FormCheckIcon />
                  </span>
                </label>
              </div>
            </div>
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>
              {t("email")} ({t("optional")})
            </Form.Label>
            <Form.Control type="text" placeholder="example@example.com" />
          </Form.Group>
          <Form.Group controlId="formNumber">
            <Form.Label>{t("phone")}</Form.Label>
            <div>
              <PhoneInput
                className={styles.phoneNumber}
                placeholder="(XXX) XXX XXX"
                //   international
                value={value}
                defaultCountry="US"
                onChange={(e: string) => setValue(e)}
              />
            </div>
          </Form.Group>
          <Form.Group controlId="formInsurance">
            <Form.Label>{t("insurance_id")}</Form.Label>
            <Form.Control type="text" placeholder={t("insurance_id")} />
          </Form.Group>
          <Form.Group controlId="formIDCard">
            <Form.Label>{t("id_card")}</Form.Label>
            <div className={styles.idCard}>
              <input
                type="file"
                accept="image/*"
                name="cardImage"
                id="cardImage"
                onChange={(e) =>
                  setIdCardImage(
                    e.target?.files?.[0]
                      ? URL.createObjectURL(e.target.files[0])
                      : ""
                  )
                }
              />
              <label htmlFor="cardImage" className={styles.cardWrap}>
                {!idCardImage ? (
                  <div className={styles.pickImgWrap}>
                    <div className={styles.cardTxt1}>
                      Up to 15 files. Limit for 1 file is 50Mb.
                    </div>
                    <div className={styles.cardPickImg}>
                      <Image src={CardPickImg} alt="CardPickImg"></Image>
                    </div>
                    <div className={styles.cardTxt2}>
                      Drop ID Card picture to attach or{" "}
                      <span>{t("browse")}</span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.showImgWrap}>
                    <Image
                      src={idCardImage ?? ""}
                      alt="CardPickImg"
                      width="100"
                      height="100"
                    />
                  </div>
                )}
              </label>
            </div>
          </Form.Group>
          <Form.Group controlId="formDiagnosis">
            <Form.Label>{t("diagnosis")}</Form.Label>
            <div className="theme_select_field">
              <div className={styles.diagnosisWrap}>
                <Select
                  menuPlacement="top"
                  name="diagnosis"
                  options={options}
                  classNamePrefix="select"
                  placeholder={t("select")}
                  isClearable={false}
                  closeMenuOnSelect={true}
                />
              </div>
            </div>
          </Form.Group>
          <Form.Group controlId="formMediacation">
            <Form.Label>{t("medication")}</Form.Label>
            <div className="theme_select_field">
              <div className={styles.medicationWrap}>
                <Select
                  menuPlacement="top"
                  isMulti
                  name="medication"
                  options={medicationOptions}
                  classNamePrefix="select"
                  placeholder={t("select")}
                  isClearable={false}
                  closeMenuOnSelect={false}
                />
              </div>
            </div>
          </Form.Group>
          <Form.Group controlId="formPrimaryDoctor">
            <Form.Label>{t("primary_doctor")}</Form.Label>
            <div className="theme_select_field">
              <div className="primaryDoctorWrap">
                <Select
                  ref={selectInputRef}
                  createOptionPosition="first"
                  menuPlacement="top"
                  name="primarydoctor"
                  options={primaryDoctorOptions}
                  classNamePrefix="select"
                  placeholder={t("select")}
                  isClearable={false}
                  closeMenuOnSelect={true}
                  // @ts-ignore
                  getOptionLabel={(e) => (
                    <div className="menuItemWrap">
                      <div className="menuItem_detail">
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
                      <div className="menuItem_check">
                        <FormCheckIcon />
                      </div>
                      <div
                        role="button"
                        className="menuItem_close "
                        onClick={(event) => {}}
                      >
                        <CloseIcon />
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>
          </Form.Group>
          <SelectDoctors />
        </div>
        <div className={styles.formButtons}>
          <div className={styles.buttonWrap}>
            <button type="button" className="btn filled">
              {t("add_patient")}
            </button>
            <button
              type="button"
              className={`btn outline ${styles.cancelButton}`}
              onClick={setDeviceSidebar}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default AddPatient;
