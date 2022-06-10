/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import AuthLayout from "@components/Layouts/AuthLayout";
import styles from "@scss/module/Form.module.scss";
import eyeIcon from "@assets/icons/eye.svg";
import Image from "next/image";
import { Form as ReactForm } from "react-bootstrap";
import OtpField from "react-otp-field";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import { AppDispatch } from "redux/store";
import { useRouter } from "next/router";
import { forgot_password_confirm } from "redux/Auth/action";
import { setCurrentUser } from "utils";

const validationSchema = Yup.object().shape({
  activation_code: Yup.string().required("Activation code is required"),
  password: Yup.string().required("Password is required"),
  passwordConfirmation: Yup.string()
    .required("Password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

type FormValuesOTP = {
  phone_number: string;
  password: string;
  passwordConfirmation: string;
  activation_code: string;
};

const NewPassword = () => {
  const [passwordEye, setPasswordEye] = useState(true);
  const [confirmPasswordEye, setConfirmPasswordEye] = useState(true);
  const router = useRouter();
  const formikRef = useRef<FormikProps<FormValuesOTP>>(null);
  const forgotPasswordConfirmData = useSelector((state: any) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const handlePasswordEye = () => {
    setPasswordEye(!passwordEye);
  };
  const handleConfirmPasswordEye = () => {
    setConfirmPasswordEye(!confirmPasswordEye);
  };

  const handleOnSubmit = async (
    values: FormValuesOTP,
    setSubmitting: { (isSubmitting: boolean): void; (arg0: boolean): void }
  ) => {
    setSubmitting(true);
    dispatch(forgot_password_confirm(values));
    setSubmitting(false);
  };

  useEffect(() => {
    if (!forgotPasswordConfirmData.success) {
      if (formikRef && formikRef.current) {
        formikRef.current.setErrors(forgotPasswordConfirmData.errors);
      }
    } else {
      if (forgotPasswordConfirmData.isForgotPassword) {
        setCurrentUser(forgotPasswordConfirmData.data);
        localStorage.removeItem("phoneNumber");
        router.push("/dashboard");
      }
    }
  }, [forgotPasswordConfirmData]);

  return (
    <AuthLayout>
      <div className={styles.formWrapper}>
        <h4>Create new password</h4>
        <Formik
          innerRef={formikRef}
          initialValues={{
            phone_number: "",
            activation_code: "",
            password: "",
            passwordConfirmation: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleOnSubmit(values, setSubmitting);
          }}
        >
          {({ errors, handleChange, values, setFieldValue }) => (
            <Form>
              <ReactForm.Group className="mb-3" controlId="formBasicEmail">
                <ReactForm.Label>Activation code</ReactForm.Label>
                <OtpField
                  value={values.activation_code || ""}
                  onChange={(e: any) => setFieldValue("activation_code", e)}
                  numInputs={6}
                  onChangeRegex={/^([0-9]{0,})$/}
                  autoFocus
                  isTypeNumber
                  inputProps={{
                    className: "otp-field__input",
                    disabled: false,
                  }}
                />
                {errors.activation_code ? (
                  <div className="error-message text-danger">
                    {errors.activation_code}
                  </div>
                ) : null}
              </ReactForm.Group>
              <ReactForm.Group className="mb-3" controlId="formBasicPassword">
                <div className={styles.labelWrapper}>
                  <ReactForm.Label>Create Password</ReactForm.Label>
                </div>
                <div className={styles.passwordEye}>
                  <ReactForm.Control
                    onChange={handleChange}
                    name="password"
                    className={errors.password ? "border-danger" : ""}
                    value={values.password}
                    type={passwordEye ? "password" : "text"}
                    placeholder="Enter password"
                  />
                  <span
                    className={`${styles.passwordEyeImg} ${
                      passwordEye ? styles.hidePassword : ""
                    }`}
                    onClick={handlePasswordEye}
                  >
                    <Image src={eyeIcon} alt="" />
                  </span>
                </div>
                {errors.password ? (
                  <div className="error-message text-danger">
                    {errors.password}
                  </div>
                ) : null}
              </ReactForm.Group>
              <ReactForm.Group controlId="formBasicConfirmPassword">
                <div className={styles.labelWrapper}>
                  <ReactForm.Label>Confirm Password</ReactForm.Label>
                </div>
                <div className={styles.passwordEye}>
                  <ReactForm.Control
                    onChange={handleChange}
                    name="passwordConfirmation"
                    className={
                      errors.passwordConfirmation ? "border-danger" : ""
                    }
                    value={values.passwordConfirmation}
                    type={confirmPasswordEye ? "password" : "text"}
                    placeholder="Enter password"
                  />
                  <span
                    className={`${styles.passwordEyeImg} ${
                      confirmPasswordEye ? styles.hidePassword : ""
                    }`}
                    onClick={handleConfirmPasswordEye}
                  >
                    <Image src={eyeIcon} alt="" />
                  </span>
                </div>
                {errors.passwordConfirmation ? (
                  <div className="error-message text-danger">
                    {errors.passwordConfirmation}
                  </div>
                ) : null}
              </ReactForm.Group>
              <div
                className={styles.form_btns}
                style={{ paddingTop: "0.5rem" }}
              >
                <button type="submit" className="btn filled">
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </AuthLayout>
  );
};

export default NewPassword;
