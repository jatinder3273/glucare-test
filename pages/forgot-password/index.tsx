/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Form as ReactForm } from "react-bootstrap";
import AuthLayout from "@components/Layouts/AuthLayout";
import styles from "@scss/module/Form.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import { AppDispatch } from "redux/store";
import { forgot_password } from "redux/Auth/action";
import { useRouter } from "next/router";

const validationSchema = Yup.object().shape({
  phone_number: Yup.string().required("Phone number is required"),
});
type FormValues = {
  phone_number: string;
};

const ForgotPassword = () => {
  const router = useRouter();
  const formikRef = useRef<FormikProps<FormValues>>(null);
  const forgotPasswordData = useSelector((state: any) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const handleOnSubmit = async (
    values: { phone_number: string },
    setSubmitting: { (isSubmitting: boolean): void; (arg0: boolean): void }
  ) => {
    setSubmitting(true);
    dispatch(forgot_password(values));
    setSubmitting(false);
  };

  useEffect(() => {
    if (!forgotPasswordData.success) {
      if (formikRef && formikRef.current) {
        formikRef.current.setErrors(forgotPasswordData.errors);
      }
    } else {
      router.push("/create-password");
    }
  }, [forgotPasswordData]);

  return (
    <AuthLayout>
      <div className={styles.formWrapper}>
        <h4>Forgot password?</h4>

        <Formik
          innerRef={formikRef}
          initialValues={{
            phone_number: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleOnSubmit(values, setSubmitting);
          }}
        >
          {({ errors, handleChange, touched, values }) => (
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
                  {touched.phone_number && errors.phone_number ? (
                    <div className="error-message text-danger">
                      {errors.phone_number}
                    </div>
                  ) : null}
                </ReactForm.Group>
              </div>
              <div className={styles.form_btns}>
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

export default ForgotPassword;
