/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { Form as ReactForm } from "react-bootstrap";
import AuthLayout from "@components/Layouts/AuthLayout";
import OtpField from "react-otp-field";
import eyeIcon from "@assets/icons/eye.svg";
import styles from "@scss/module/Form.module.scss";
import Image from "next/image";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import { sentOtpToPhoneNumber, register } from "redux/Auth/action";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "redux/store";
import { setCurrentUser } from "utils";
import { useRouter } from "next/router";

const validationSchema = Yup.object().shape({
  phone_number: Yup.string().required("Phone number is required"),
});
const validationSchemaForOtp = Yup.object().shape({
  phone_number: Yup.string().required("Phone number is required"),
  // activation_code: Yup.string().required("OTP is required"),
  password: Yup.string().required("Password is required"),
  passwordConfirmation: Yup.string()
    .required("Password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});
type FormValues = {
  phone_number: string;
};
type FormValuesOTP = {
  phone_number: string;
  password: string;
  passwordConfirmation: string;
  activation_code: string;
};

const SignUp = () => {
  const router = useRouter();
  const formikRef = useRef<FormikProps<FormValues>>(null);
  const formikRefForOtp = useRef<FormikProps<FormValuesOTP>>(null);
  const dispatch = useDispatch<AppDispatch>();
  const registerData = useSelector((store: any) => store.auth);
  const [phoneNumberPage, setPhoneNumberPage] = useState(true);
  const [passwordEye, setPasswordEye] = useState(true);
  const [confirmPasswordEye, setConfirmPasswordEye] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const handlePhoneNumberPage = () => {
    setPhoneNumberPage(false);
  };
  const handlePasswordEye = () => {
    setPasswordEye(!passwordEye);
  };
  const handleConfirmPasswordEye = () => {
    setConfirmPasswordEye(!confirmPasswordEye);
  };

  const handleOnSubmitSentOtpForm = async (
    values: { phone_number: string },
    setSubmitting: { (isSubmitting: boolean): void; (arg0: boolean): void }
  ) => {
    setSubmitting(true);
    dispatch(sentOtpToPhoneNumber(values));
    setSubmitting(false);
    setPhoneNumber(values.phone_number);
  };

  const handleOnSubmitConfirmOtpForm = async (
    values: FormValuesOTP,
    setSubmitting: { (isSubmitting: boolean): void; (arg0: boolean): void }
  ) => {
    setSubmitting(true);
    dispatch(register(values));
    setSubmitting(false);
  };

  useEffect(() => {
    if (!registerData.success) {
      if (phoneNumberPage) {
        if (formikRef && formikRef.current) {
          formikRef.current.setErrors(registerData.errors);
        }
      } else {
        if (formikRefForOtp && formikRefForOtp.current) {
          formikRefForOtp.current.setErrors(registerData.errors);
        }
      }
    } else {
      if (registerData.isOtpSent) {
        handlePhoneNumberPage();
      }
      if (registerData.isRegisterd) {
        setCurrentUser(registerData.data);
        router.push("/dashboard");
      }
    }
    setOtp(registerData.data.activation_code_for_debug);
  }, [registerData]);

  return (
    <AuthLayout>
      <div className={styles.formWrapper}>
        <h4>Sign Up</h4>
        <div className={styles.form}>
          <div className={styles.formFields}>
            {phoneNumberPage ? (
              <>
                <Formik
                  innerRef={formikRef}
                  initialValues={{
                    phone_number: "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={(values, { setSubmitting }) => {
                    handleOnSubmitSentOtpForm(values, setSubmitting);
                  }}
                >
                  {({
                    isSubmitting,
                    errors,
                    handleChange,
                    touched,
                    values,
                  }) => (
                    <Form>
                      <ReactForm.Group
                        className="mb-3"
                        controlId="formBasicPhone"
                      >
                        <ReactForm.Label>Phone number</ReactForm.Label>
                        <ReactForm.Control
                          onChange={handleChange}
                          name="phone_number"
                          type="text"
                          className={
                            touched.phone_number && errors.phone_number
                              ? "border-danger"
                              : ""
                          }
                          value={values.phone_number}
                          placeholder="Enter Phone number"
                        />
                        {touched.phone_number && errors.phone_number ? (
                          <div className="error-message text-danger">
                            {errors.phone_number}
                          </div>
                        ) : null}
                      </ReactForm.Group>
                      <div
                        className={styles.form_btns}
                        style={{ paddingTop: "0.5rem" }}
                      >
                        <button
                          disabled={isSubmitting || registerData.loading}
                          type="submit"
                          className="btn filled"
                        >
                          {registerData.loading ? "loading..." : ""} Next
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </>
            ) : (
              <>
                <Formik
                  innerRef={formikRefForOtp}
                  initialValues={{
                    phone_number: phoneNumber,
                    activation_code: "",
                    password: "",
                    passwordConfirmation: "",
                  }}
                  validationSchema={validationSchemaForOtp}
                  onSubmit={(values, { setSubmitting }) => {
                    handleOnSubmitConfirmOtpForm(values, setSubmitting);
                  }}
                >
                  {({
                    isSubmitting,
                    errors,
                    handleChange,
                    touched,
                    values,
                    setFieldValue,
                  }) => (
                    <Form>
                      <ReactForm.Group
                        className="mb-3"
                        controlId="formBasicEmail"
                      >
                        <ReactForm.Label>Activation code</ReactForm.Label>
                        <OtpField
                          // value={values.activation_code || ""}
                          // onChange={(e: any) =>
                          //   setFieldValue("activation_code", e)
                          // }
                          value={otp}
                          onChange={setOtp}
                          numInputs={6}
                          onChangeRegex={/^([0-9]{0,})$/}
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
                      <ReactForm.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <div className={styles.labelWrapper}>
                          <ReactForm.Label>Create Password</ReactForm.Label>
                        </div>
                        <div className={styles.passwordEye}>
                          <ReactForm.Control
                            autoFocus
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
                        <button
                          disabled={registerData.loading}
                          type="submit"
                          className="btn filled"
                        >
                          Next
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </>
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
