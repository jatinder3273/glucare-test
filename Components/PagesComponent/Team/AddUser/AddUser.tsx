// @ts-nocheck
import React, { useEffect, useState } from "react";
import styles from "./AddUser.module.scss";
import useTranslation from "next-translate/useTranslation";
import { Form, Spinner } from "react-bootstrap";
import { FormCheckIcon } from "@components/Common/Icons/Icons";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import Select from "react-select";
import { useFormik } from "formik";
import { addStaff } from "redux/StaffServices/staffApiServices";
import { useDispatch, useSelector } from "react-redux";
import {
  addStaffAction,
  getStaffRecord,
  jobTitleList,
} from "redux/StaffServices/staff.action";
import { AppDispatch } from "redux/store";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { string } from "yup/lib/locale";
import { AnyARecord } from "dns";

interface Option {
  readonly value: string;
  readonly label: string;
}

interface IProps {
  toggleSidebar: () => void;
}

const options: readonly Option[] = [
  { value: "Diabitologist", label: "Diabitologist" },
  { value: "Entecrenologist", label: "Entecrenologist" },
  { value: "Life coach", label: "Life coach" },
  { value: "Nutritionist", label: "Nutritionist" },
  { value: "Other", label: "Other" },
];

const AddUser = ({ toggleSidebar }: IProps) => {
  const { t } = useTranslation("common");
  const [value, setValue] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const jobTitleOptions = useSelector(
    (state: any) => state?.staffRecord.jobTitles
  );
  const [selectedOption, setSelectedOption] = useState({ value: "" });
  const [jobOptions, setJobOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required."),
    last_name: Yup.string().required("Last name is required."),
    role: Yup.string().required("Role is required."),
    phone_number: Yup.string().required("Phone Number is required."),
  });

  const formik = useFormik({
    initialValues: {
      phone_number: "",
      first_name: "",
      last_name: "",
      role: "",
      gender: "",
      //medical_no:312312
      job_title: "",
    },
    validationSchema,
    onSubmit: (values) => {
      setIsLoading(true);
      values.phone_number = value;
      values.job_title = selectedOption !== null ? selectedOption.value : "";
      const res = dispatch(addStaffAction(values));

      res
        .then((response: any) => {
          setIsLoading(false);
          toast.success(response.data.message);
          toggleSidebar();
          dispatch(getStaffRecord({ search: "" }));
        })
        .catch((err: any) => {
          setIsLoading(false);
          toast.error(
            typeof err.response.data.message == "string"
              ? err.response.data.message
              : `${Object.values(err.response.data.message)[0]}`
          );
          // toggleSidebar();
        });
    },
  });

  useEffect(() => {
    dispatch(jobTitleList());
  }, []);

  useEffect(() => {
    if (jobTitleOptions !== undefined && jobTitleOptions.length > 0) {
      let finalData: any = [];

      jobTitleOptions.map((item: any) => {
        const obj = { value: item.id, label: item.name };

        finalData.push(obj);
      });
      setJobOptions(finalData);
    }
  }, [jobTitleOptions]);
  const handleValue = (e: any) => {
    setValue(e);
    formik.setFieldValue("phone_number", e);
  };
  return (
    <div className={styles.wrap}>
      <span className={styles.infoTxt}>{t("personal_info")}</span>
      <Form className={styles.form} onSubmit={formik.handleSubmit}>
        <div className={styles.formFields}>
          <Form.Group controlId="formFirstName">
            <Form.Label>{t("first_name")}</Form.Label>
            <Form.Control
              name="first_name"
              type="text"
              placeholder={t("first_name")}
              onChange={formik.handleChange}
              value={formik.values.first_name}
            />
          </Form.Group>
          <div className="text-danger">
            {formik.errors.first_name ? formik.errors.first_name : null}
          </div>
          <Form.Group controlId="formLastName">
            <Form.Label>{t("last_name")}</Form.Label>
            <Form.Control
              name="last_name"
              type="text"
              placeholder={t("last_name")}
              onChange={formik.handleChange}
              value={formik.values.last_name}
            />
          </Form.Group>
          <div className="text-danger">
            {formik.errors.last_name ? formik.errors.last_name : null}
          </div>
          {/* <Form.Group controlId="formDOB">
            <Form.Label>{t("date_of_birth")}</Form.Label>
            <Form.Control
              type="date"
              placeholder="mm/dd/yyyy"
              style={{ color: "#A5ADC0" }}
            />
          </Form.Group> */}
          <Form.Group controlId="selectGender">
            <Form.Label>{t("select_gender")}</Form.Label>

            <div className={styles.radio}>
              <div className={styles.radioCheck}>
                <input
                  type="radio"
                  name="gender"
                  id="male"
                  onChange={formik.handleChange}
                  value="2"
                />
                <label htmlFor="male">
                  {t("male")}
                  <span className={styles.checkIcon}>
                    <FormCheckIcon />
                  </span>
                </label>
              </div>
              <div className={styles.radioCheck}>
                <input
                  type="radio"
                  name="gender"
                  id="female"
                  onChange={formik.handleChange}
                  value="1"
                />
                <label htmlFor="female">
                  {t("female")}
                  <span className={styles.checkIcon}>
                    <FormCheckIcon />
                  </span>
                </label>
              </div>
              <div className={styles.radioCheck}>
                <input
                  type="radio"
                  name="gender"
                  id="other"
                  onChange={formik.handleChange}
                  value="3"
                />
                <label htmlFor="other">
                  {t("other")}
                  <span className={styles.checkIcon}>
                    <FormCheckIcon />
                  </span>
                </label>
              </div>
            </div>
          </Form.Group>
          {/* <Form.Group controlId="formEmail">
            <Form.Label>{t("email")}</Form.Label>
            <Form.Control type="text" placeholder="example@example.com" />
          </Form.Group> */}
          <Form.Group controlId="formNumber">
            <Form.Label>{t("phone")}</Form.Label>
            <div>
              <PhoneInput
                className={styles.phoneNumber}
                placeholder="(XXX) XXX XXX"
                //   international
                name="phone_number"
                value={value}
                defaultCountry="US"
                onChange={(e: string) => handleValue(e)}
              />
            </div>
          </Form.Group>
          <div className="text-danger">
            {formik.errors.phone_number ? formik.errors.phone_number : null}
          </div>
          <span className={styles.infoTxt} style={{ marginTop: "7px" }}>
            {t("professional_info")}
          </span>
          {/* <Form.Group controlId="formSpeciality">
            <Form.Label>{t("speciality")}</Form.Label>
            <div className="theme_select_field">
              <div className={styles.diagnosisWrap}>
                <Select
                  menuPlacement="top"
                  name="speciality"
                  options={options}
                  classNamePrefix="select"
                  placeholder={t("select_speciality")}
                  isClearable={false}

                  closeMenuOnSelect={true}
                />
              </div>
            </div>
          </Form.Group> */}
          <Form.Group controlId="selectGender">
            <Form.Label>{t("select_role")}</Form.Label>

            <div className={styles.radio}>
              <div className={styles.radioCheck}>
                <input
                  type="radio"
                  name="role"
                  id="physician"
                  onChange={formik.handleChange}
                  value="1"
                />
                <label htmlFor="physician">
                  {t("physician")}
                  <span className={styles.checkIcon}>
                    <FormCheckIcon />
                  </span>
                </label>
              </div>
              <div className={styles.radioCheck}>
                <input
                  type="radio"
                  name="role"
                  id="coach"
                  onChange={formik.handleChange}
                  value="2"
                />
                <label htmlFor="coach">
                  {t("coach")}
                  <span className={styles.checkIcon}>
                    <FormCheckIcon />
                  </span>
                </label>
              </div>
              <div className={styles.radioCheck}>
                <input
                  type="radio"
                  name="role"
                  id="admin"
                  onChange={formik.handleChange}
                  value="4"
                />
                <label htmlFor="admin">
                  {t("admin")}
                  <span className={styles.checkIcon}>
                    <FormCheckIcon />
                  </span>
                </label>
              </div>
            </div>
          </Form.Group>
          <div className="text-danger">
            {formik.errors.role ? formik.errors.role : null}
          </div>
          <Form.Group controlId="formJobTitle">
            <Form.Label>{t("job_title")}</Form.Label>
            <div className="theme_select_field">
              <div className={styles.diagnosisWrap}>
                <Select
                  menuPlacement="top"
                  name="job_title"
                  defaultValue={selectedOption}
                  // onChange={(e) => handleChange(e)}
                  onChange={(e: any) => setSelectedOption({ ...e })}
                  options={jobOptions}
                  classNamePrefix="select"
                  placeholder={t("select_job_title")}
                  isClearable={false}
                  closeMenuOnSelect={true}
                />
              </div>
            </div>
          </Form.Group>
        </div>
        <div className={styles.formButtons}>
          <div className={styles.buttonWrap}>
            <button type="submit" className="btn filled">
              {isLoading ? (
                <>
                  Saving.. <Spinner size="sm" animation="border" />
                </>
              ) : (
                t("add_user")
              )}
            </button>
            <button
              type="button"
              className={`btn outline ${styles.cancelButton}`}
              onClick={toggleSidebar}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default AddUser;
