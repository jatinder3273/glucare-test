// @ts-nocheck
import { DeleteIcon, FormCheckIcon } from "@components/Common/Icons/Icons";
import React, { useState } from "react";
import { Image } from "react-bootstrap";
import styles from "./ShowProfile.module.scss";
import UserImage from "../../../../assets/avatar3.png";
import { Form } from "react-bootstrap";
import PhoneInput from "react-phone-number-input";
import useTranslation from "next-translate/useTranslation";
import { useFormik } from "formik";
import { updateProfile } from "redux/Auth/query";
import { handleInputChange } from "react-select/dist/declarations/src/utils";
import { toast } from "react-toastify";
import * as Yup from "yup";
import profile_placeholder from "@assets/icons/profile_placeholder.svg";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "redux/Auth/action";
import { AppDispatch } from "redux/store";
interface Option {
  readonly value: string;
  readonly label: string;
}

const options: readonly Option[] = [
  { value: "India", label: "India" },
  { value: "United States", label: "United States" },
  { value: "Australia", label: "Australia" },
];

interface IProps {
  setShowModal: (action: any) => any;
  toggleProfile?: () => void;
  profileData: any;
  imageUrl: string;
}

const ShowProfile = ({
  profileData,
  setShowModal,
  imageUrl,
  toggleProfile,
}: IProps) => {
  const { t } = useTranslation("profile");
  const [value, setValue] = useState<string>("");
  const [userImage, setUserImage] = useState<string>(imageUrl);
  const [imageFile, setImageFile] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required."),
    last_name: Yup.string().required("Last name is required."),
    gender: Yup.string().required("Gender is required"),
  });

  const formik = useFormik({
    initialValues: {
      avatar: "",
      first_name: profileData !== undefined ? profileData.first_name : "",
      last_name: profileData !== undefined ? profileData.last_name : "",
      role:
        profileData !== undefined && profileData.role === "physician"
          ? 1
          : profileData.role === "coach"
          ? 2
          : profileData.role === "admin"
          ? 4
          : "",
      gender:
        profileData !== undefined && profileData.gender === "male"
          ? "2"
          : profileData.gender === "female"
          ? "1"
          : profileData.gender === "other"
          ? "3"
          : "",
      //medical_no:312312
      job_title:
        profileData !== undefined && profileData.job_title !== null
          ? profileData.job_title?.name
          : "",
    },
    validationSchema,
    onSubmit: (values) => {
      values.avatar = imageFile;

      values.job_title =
        profileData !== undefined && profileData.job_title !== null
          ? profileData.job_title.id
          : "";
      const res = dispatch(updateUserProfile(values));
      res.then((resp: any) => {
        if (resp.success) {
          toast.success("Profile Updated Successfully.");
          setShowModal;
          toggleProfile();
        } else {
          toast.error(`Sometthing Went Wrong.`);
        }
      });
    },
  });

  const handleImageUpload = (e: any) => {
    setImageFile(e.target?.files?.[0] ? e.target?.files?.[0] : "");
    setUserImage(
      e.target?.files?.[0] ? URL.createObjectURL(e.target.files[0]) : ""
    );
  };

  return (
    <div className={styles.showProfileWrap}>
      <div className={styles.imageWrap}>
        <div className={styles.image}>
          <Image src={userImage} placeholder={profile_placeholder.src} />
        </div>
        <div className={styles.uploadDeleteWrap}>
          <button type="button" className="btn outline">
            <input
              type="file"
              accept="image/*"
              name="cardImage"
              id="userImage"
              onChange={(e) => handleImageUpload(e)}
            />
            <label htmlFor="userImage" className={styles.userImage}>
              {t("upload_photo")}
            </label>
          </button>
          <button
            type="button"
            className={`${styles.deleteButton} btn deleteButton`}
            onClick={() => setUserImage("")}
          >
            <DeleteIcon />
          </button>
        </div>
      </div>
      <div className={styles.contentWrap}>
        <h5>Personal info</h5>
        <Form onSubmit={formik.handleSubmit} className={styles.form}>
          <div className={styles.formFields}>
            <div className={styles.nameFields}>
              <Form.Group controlId="formFirstName">
                <Form.Label>{t("first_name")}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t("first_name")}
                  name="first_name"
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                />
                <div className="text-danger">
                  {`${
                    formik.errors.first_name ? formik.errors.first_name : ""
                  }`}
                </div>
              </Form.Group>

              <Form.Group controlId="formLastName">
                <Form.Label>{t("last_name")}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t("last_name")}
                  name="last_name"
                  value={formik.values.last_name}
                  onChange={formik.handleChange}
                />
                <div className="text-danger">
                  {`${formik.errors.last_name ? formik.errors.last_name : ""}`}
                </div>
              </Form.Group>
            </div>
            <Form.Group controlId="selectGender">
              <Form.Label>{t("select_gender")}</Form.Label>

              <div className={styles.radio}>
                <div className={styles.radioCheck}>
                  <input
                    type="radio"
                    name="gender"
                    id="male"
                    value="2"
                    checked={formik.values.gender === "2"}
                    onChange={formik.handleChange}
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
                    value="1"
                    checked={formik.values.gender === "1"}
                    onChange={formik.handleChange}
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
                    value="3"
                    checked={formik.values.gender === "3"}
                    onChange={formik.handleChange}
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
            <h5 className="mt-4">{t("professional_info")}</h5>
            <Form.Group controlId="formRole">
              <Form.Label>{t("role")}</Form.Label>
              <div>
                {profileData !== undefined
                  ? profileData.role.toUpperCase()
                  : ""}
              </div>
            </Form.Group>
            {profileData.job_title && (
              <>
                <Form.Group controlId="formJobTitle">
                  <Form.Label>{t("job_title")}</Form.Label>
                  <div>
                    {profileData.job_title !== null &&
                    profileData.job_title !== ""
                      ? profileData.job_title.name.toUpperCase()
                      : ""}
                  </div>
                </Form.Group>
                <div className="theme_divider"></div>
              </>
            )}

            <div className={`mt-3 ${styles.buttonWrap}`}>
              <button type="submit" className="btn filled">
                {t("save")}
              </button>
              <button
                type="button"
                className={`btn outline ${styles.cancelButton}`}
                onClick={setShowModal}
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ShowProfile;
