import { NotificationIcon, PrivacyIcon } from "@components/Common/Icons/Icons";
import React, { useEffect, useState } from "react";
import styles from "./ShowSettings.module.scss";
import { Col, Form, Nav, Row, Spinner, Tab } from "react-bootstrap";
import eyeIcon from "@assets/icons/eye.svg";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { changePassword } from "redux/Auth/query";
import { toast } from "react-toastify";
import {
  settingDisableAll,
  settingEnableAll,
  settingList,
  updateSetting,
} from "redux/Settings/action";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "redux/store";
import _ from "lodash";
interface IProps {
  setShowModal?: (action: any) => any;
}

interface ListType {
  id: number;
  name: string;
  check: number;
}

interface categoriesType {
  created: string;
  id: number;
  is_active: boolean;
  modified: string;
  name: string;
}

interface settingDataType {
  categories: categoriesType[];
  channel_types: [number, string][];
  not_allowed: {
    category: number;
    channel_type: string;
    id: number;
    user: number;
  }[];
}

interface notAllowedType {
  category: number;
  channel_type: string;
  id: number;
  user: number;
}

const ShowSettings = ({ setShowModal }: IProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const fetchSettingData = useSelector((state: any) => state.setting);
  const { t } = useTranslation("profile");
  const [passwordEye, setPasswordEye] = useState<boolean>(true);
  const [confirmPasswordEye, setConfirmPasswordEye] = useState<boolean>(true);
  const [settingData, setSettingData] = useState<settingDataType>(
    fetchSettingData.setting_list
  );
  const [hitApi, setHitApi] = useState(false);

  const renderCheckboxes = (data: categoriesType, index: number) => {
    return (
      <div className={styles.innerContent} key={index}>
        <div className={styles.innerTxt}>{data.name}</div>
        <div className={styles.innerCheckboxes}>
          {settingData.channel_types.map((typeData, typeIndex) => (
            <Form.Check
              defaultChecked={
                settingData.not_allowed.filter(
                  (notAllowedData: notAllowedType) =>
                    notAllowedData.category == data.id &&
                    notAllowedData.channel_type == typeData[1]
                ).length == 0
                  ? true
                  : false
              }
              type="checkbox"
              id="1"
              label={typeData[1]}
              key={typeIndex}
              onChange={(e) => {
                setHitApi(!hitApi);
                dispatch(
                  updateSetting({
                    category: data.id.toString(),
                    channel_type: typeData[0].toString(),
                    action: e.target.checked ? "1" : "2",
                  })
                );
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  const handlePasswordEye = () => {
    setPasswordEye(!passwordEye);
  };
  const handleConfirmPasswordEye = () => {
    setConfirmPasswordEye(!confirmPasswordEye);
  };

  const validationSchema = Yup.object().shape({
    old_password: Yup.string().required("Old password is required."),
    new_password: Yup.string()
      .required("New password is required.")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
  });

  const formik = useFormik({
    initialValues: {
      old_password: "",
      new_password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const response = changePassword(values);
      response
        .then((res) => {
          if (res.data.status !== "FAIL") {
            toast.success(res.data.message);
          } else {
            const errMessage: any =
              Object.values(res.data.message).length > 0
                ? Object.values(res.data.message)[0]
                : "Something Went Wrong.";
            toast.error(`${errMessage}`);
          }
        })
        .catch((err) => {});
    },
  });

  useEffect(() => {
    dispatch(settingList());
  }, [hitApi]);

  useEffect(() => {
    setSettingData(fetchSettingData.setting_list);
  }, [fetchSettingData]);

  return (
    <div className={styles.mainWrap}>
      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        <Row>
          <Col md={3}>
            <Nav variant="pills" className={styles.switchWrap}>
              <Nav.Item>
                <Nav.Link eventKey="first" className={styles.switchButton}>
                  <span className={styles.notificationIcon}>
                    <NotificationIcon />
                  </span>
                  <span className={styles.switchTxt}>{t("notification")}</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second" className={styles.switchButton}>
                  <span className={styles.privacyIcon}>
                    <PrivacyIcon />
                  </span>
                  <span className={styles.switchTxt}>{t("privacy")}</span>
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col md={9}>
            <Tab.Content>
              <Tab.Pane eventKey="first">
                <div className={styles.notificationWrap}>
                  <div className={styles.notificationHeading}>
                    <Form>
                      {settingData.not_allowed != undefined && (
                        <Form.Check
                          type="switch"
                          id="custom-switch"
                          label={
                            settingData.not_allowed.length == 0
                              ? `Disable all notifications`
                              : `Allow all notifications`
                          }
                          className="formSwitch"
                          checked={
                            settingData.not_allowed.length == 0 ? true : false
                          }
                          onChange={(e) => {
                            e.target.checked
                              ? dispatch(settingEnableAll())
                              : dispatch(settingDisableAll());
                          }}
                        />
                      )}
                    </Form>
                  </div>
                  <div className={styles.notificationContent}>
                    {settingData.categories != undefined ? (
                      settingData.categories.map(renderCheckboxes)
                    ) : (
                      <div className={styles.ceterData}>
                        <Spinner animation="border" role="status">
                          <span className="visually-hidden text-center">
                            Loading...
                          </span>
                        </Spinner>
                      </div>
                    )}
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <div className={styles.privacyWrap}>
                  <h5>{t("password")}</h5>
                  <div className={styles.privacyContent}>
                    <Form onSubmit={formik.handleSubmit}>
                      <Form.Group controlId="formBasicPassword">
                        <div className="labelWrapper">
                          <Form.Label>{t("current_password")}</Form.Label>
                        </div>
                        <div className="passwordEye">
                          <Form.Control
                            type={passwordEye ? "password" : "text"}
                            name="old_password"
                            value={formik.values.old_password}
                            onChange={formik.handleChange}
                          />
                          <span
                            className={`passwordEyeImg ${
                              passwordEye ? "hidePassword" : ""
                            }`}
                            onClick={handlePasswordEye}
                          >
                            <Image src={eyeIcon} alt="" />
                          </span>
                        </div>
                      </Form.Group>
                      <div className="text-danger">
                        {formik.errors.old_password
                          ? "Current password is required."
                          : null}
                      </div>
                      <Form.Group controlId="formBasicConfirmPassword">
                        <div className="labelWrapper">
                          <Form.Label>{t("new_password")}</Form.Label>
                        </div>
                        <div className="passwordEye">
                          <Form.Control
                            type={confirmPasswordEye ? "password" : "text"}
                            name="new_password"
                            value={formik.values.new_password}
                            onChange={formik.handleChange}
                          />
                          <span
                            className={`passwordEyeImg ${
                              confirmPasswordEye ? "hidePassword" : ""
                            }`}
                            onClick={handleConfirmPasswordEye}
                          >
                            <Image src={eyeIcon} alt="" />
                          </span>
                        </div>
                        <div className="labelWrapper">
                          <Form.Label>{t("warning_txt")}</Form.Label>
                        </div>
                      </Form.Group>
                      <div className="text-danger">
                        {formik.errors.new_password
                          ? formik.errors.new_password
                          : null}
                      </div>
                      <div className={`${styles.saveCancel} mt-3`}>
                        <div className={styles.buttonWrap}>
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
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};

export default ShowSettings;
