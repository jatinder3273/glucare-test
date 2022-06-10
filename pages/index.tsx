import React, { useEffect, useRef, useState } from "react";
import { Form as ReactForm } from "react-bootstrap";
import AuthLayout from "@components/Layouts/AuthLayout";
import eyeIcon from "@assets/icons/eye.svg";
import styles from "@scss/module/Form.module.scss";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { getChatToken, login } from "redux/Auth/action";
import { useRouter } from "next/router";

import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import { AppDispatch } from "redux/store";
import { setCurrentUser } from "utils";

const validationSchema = Yup.object().shape({
  phone_number: Yup.string().required("Phone number is required"),
  password: Yup.string().required("Password is required"),
});
type FormValues = {
  phone_number: string;
  password: string;
};
const Login = () => {
  const router = useRouter();
  const formikRef = useRef<FormikProps<FormValues>>(null);
  const loginData = useSelector((state: any) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const [passwordEye, setPasswordEye] = useState(true);
  const handlePasswordEye = () => {
    setPasswordEye(!passwordEye);
  };

  const handleOnSubmit = async (
    values: { phone_number: string; password: string },
    setSubmitting: { (isSubmitting: boolean): void; (arg0: boolean): void }
  ) => {
    setSubmitting(true);
    dispatch(login(values));
    setSubmitting(false);
  };

  useEffect(
    () => {
      if (!loginData.success) {
        if (!loginData.isAgentNotTrusted) {
          if (formikRef && formikRef.current) {
            formikRef.current.setErrors(loginData.errors);
          }
        } else {
          router.push("/otp-verification");
        }
      } else {
        if (loginData.isLoggedIn) {
          setCurrentUser(loginData.data);
          dispatch(getChatToken());
          router.push("/dashboard");
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loginData]
  );
  return (
    <AuthLayout>
      <div className={styles.formWrapper}>
        <h4>Login</h4>
        <Formik
          innerRef={formikRef}
          initialValues={{
            phone_number: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleOnSubmit(values, setSubmitting);
          }}
        >
          {({ isSubmitting, errors, handleChange, touched, values }) => (
            <Form className={styles.form}>
              <div className={styles.formFields}>
                <ReactForm.Group className="mb-3" controlId="formBasicEmail">
                  <ReactForm.Label>Phone number</ReactForm.Label>
                  <ReactForm.Control
                    type="text"
                    placeholder="Enter phone number"
                    onChange={handleChange}
                    name="phone_number"
                    className={
                      touched.phone_number && errors.phone_number
                        ? "border-danger"
                        : ""
                    }
                    value={values.phone_number}
                  />
                </ReactForm.Group>
                <ReactForm.Group controlId="formBasicPassword">
                  <div className={styles.labelWrapper}>
                    <ReactForm.Label>Enter Password</ReactForm.Label>
                    <span>
                      <Link href="/forgot-password" passHref={true}>
                        Forgot password?
                      </Link>
                    </span>
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
                </ReactForm.Group>
                <div className={styles.rememberField}>
                  <ReactForm.Check
                    type="checkbox"
                    id="Remember_me"
                    label="Remember me"
                  />
                </div>
                <div className={styles.form_btns}>
                  <button type="submit" className="btn filled">
                    Next
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </AuthLayout>
  );
};

export default Login;
