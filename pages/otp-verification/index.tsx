/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import OtpField from "react-otp-field";
import AuthLayout from "@components/Layouts/AuthLayout";
import styles from "@scss/module/Form.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "utils";
import { useRouter } from "next/router";
import { AppDispatch } from "redux/store";
import {
  getChatToken,
  sentOtpToPhoneNumberLogin,
  verifyOtp,
} from "redux/Auth/action";
const OtpVerification = () => {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const loginData = useSelector((state: any) => state.auth);
  const [error, setError] = useState("");
  const sendOtpCode = () => {
    const phoneNumber = localStorage.getItem("phoneNumber");
    if (phoneNumber) {
      dispatch(sentOtpToPhoneNumberLogin({ phone_number: phoneNumber }));
    }
  };

  const handleOnClickSubmit = () => {
    setError("");
    if (!otp || otp.length !== 6) {
      if (otp.length !== 6) {
        setError("Otp is invalid.");
      } else {
        setError("Otp is required.");
      }
      return false;
    }
    const phoneNumber = localStorage.getItem("phoneNumber") || "";
    const params = {
      activation_code: otp,
      phone_number: phoneNumber,
    };
    dispatch(verifyOtp(params));
  };

  useEffect(() => {
    sendOtpCode();
  }, []);

  useEffect(() => {
    if (!loginData.success) {
      setError(loginData.errors.activation_code);
    } else {
      if (loginData.isLoggedIn) {
        setCurrentUser(loginData.data);
        dispatch(getChatToken());
        router.push("/dashboard");
      }
    }
    // console.log("loginData ==> ", loginData);
    setOtp(loginData.data.activation_code_for_debug);
  }, [loginData]);

  return (
    <AuthLayout>
      <div className={styles.formWrapper}>
        <h4>Verify phone number</h4>
        <p style={{ lineHeight: 1.8, marginBottom: "1.9rem" }}>
          We sent you a 6-digit verification code at +380931435076
          <span className="blueLink text_small">Edit number</span>
        </p>
        <Form className={styles.form}>
          <div className={styles.formFields}>
            <Form.Group className="my-4" controlId="formBasicEmail">
              <Form.Label>Enter confirmation code</Form.Label>
              <OtpField
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
              {error ? (
                <div className="error-message text-danger">{error}</div>
              ) : null}
            </Form.Group>
          </div>
          <div className={styles.optVerificationTest}>
            <p className="text_small">
              Expires at <span className={styles.counterTag}>3:00</span>
            </p>
            <p className="text_small">
              Didn’t get a code?{" "}
              <span className="blueLink" onClick={sendOtpCode}>
                Resend
              </span>
            </p>
          </div>
          <div className={styles.form_btns}>
            <button
              type="button"
              className="btn filled"
              onClick={handleOnClickSubmit}
              autoFocus
            >
              Next
            </button>
          </div>
        </Form>
      </div>
    </AuthLayout>
  );
};

export default OtpVerification;
