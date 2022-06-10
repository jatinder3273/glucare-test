import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import styles from "./AddLabTestModal.module.scss";
import pdfPickImg from "@assets/icons/pdfPickImg.svg";
import { PdfIcon, CloseIcon } from "@components/Common/Icons/common";
import Select, { SelectInstance, StylesConfig } from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { test_categories, test_record_create } from "redux/Patient/action";
import { AppDispatch } from "redux/store";
import { FileUploader } from "react-drag-drop-files";
import { useToggle } from "rooks";
interface IProps {
  toggleAddLabTestModal: () => void;
}
interface Option {
  readonly value: string;
  readonly label: string;
}

interface labTestType {
  fields: any;
  last_update: string;
  name: string;
  id: number;
}

const AddLabTestModal = ({ toggleAddLabTestModal }: IProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const labData = useSelector((state: any) => state.patient.test_categories);
  const [testCategoriesData, setTestCategoriesData] = useState<labTestType[]>();
  const [idCardImage, setIdCardImage] = useState<File>();
  const [checkUploadClick, setCheckUploadClick] = useState(false);
  const [checkIsData, setCheckIsData] = useState(false);
  const [checkSharePatient, setcheckSharePatient] = useToggle();
  const [noteTxt, setNoteTxt] = useState<string>("");
  const [diagnosisObj, setDiagnosisObj] = useState<labTestType>();
  const [dataObj, setDataObj] = useState({});

  useEffect(() => {
    dispatch(
      test_categories({
        user: localStorage.getItem("userId") || "",
      })
    );
  }, []);

  useEffect(() => {
    labData.test_categories_list != undefined &&
      setTestCategoriesData(labData.test_categories_list);
  }, [labData]);

  const options: readonly Option[] =
    testCategoriesData != undefined
      ? testCategoriesData.map((data: labTestType) => {
          return { value: data.name, label: data.name };
        })
      : [];

  const formatFileSize = (bytes: number, decimalPoint: number) => {
    if (bytes == 0) return "0 Bytes";
    var k = 1000,
      dm = decimalPoint || 2,
      sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const handleChange = (file: File) => {
    setIdCardImage(file);
    setCheckUploadClick(false);
  };

  return (
    <>
      <div className={styles.addLabTestBody}>
        <Form className={styles.addLabTest_form}>
          <Form.Group controlId="formDiagnosis" className="mb-3">
            <Form.Label>Diagnosis</Form.Label>
            <div className="theme_select_field">
              <Select
                menuPlacement="bottom"
                name="diagnosis"
                options={options}
                className={styles.diagnosis}
                classNamePrefix="select"
                placeholder="Select"
                isSearchable={false}
                isClearable={false}
                closeMenuOnSelect={true}
                onChange={(e) => {
                  setCheckIsData(false);
                  if (testCategoriesData != undefined && e != null) {
                    setDiagnosisObj(
                      testCategoriesData.filter(
                        (data) => data.name == e.value
                      )[0]
                    );
                  }
                }}
              />
            </div>
            {checkIsData && (
              <div className="error-message text-danger my-2">
                Option is required
              </div>
            )}
          </Form.Group>
          {testCategoriesData != undefined &&
            diagnosisObj != undefined &&
            diagnosisObj?.name != "" &&
            Object.keys(
              testCategoriesData.filter(
                (data: labTestType) => data.name == diagnosisObj?.name
              )[0].fields
            ).map((key) => (
              <Form.Group className="mb-3" controlId={key}>
                <Form.Label>{key}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Add text"
                  onChange={(e) => {
                    if (e.target.value !== "") {
                      setDataObj({ ...dataObj, [key]: e.target.value });
                    } else {
                      let obj: { [key: string]: {} } = { ...dataObj };
                      delete obj[key];
                      setDataObj(obj);
                    }
                  }}
                />
              </Form.Group>
            ))}

          <Form.Group className="mb-4" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Note (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Additional info"
              onChange={(e) => {
                setNoteTxt(e.target.value);
              }}
            />
          </Form.Group>

          {idCardImage == undefined ? (
            <Form.Group controlId="formIDCard">
              <div className={styles.idCard}>
                <FileUploader
                  multiple={false}
                  handleChange={handleChange}
                  type="file"
                  types={["JPEG", "PNG", "pdf", "vnd.ms-excel"]}
                  name="cardImage"
                  id="cardImage"
                  label=" "
                  hoverTitle=" "
                />
                <label htmlFor="cardImage" className={styles.cardWrap}>
                  <div className={styles.pickImgWrap}>
                    <div className={`mb-2 ${styles.cardTxt2}`}>
                      Drop Lab test to attach or <span>browse</span>
                    </div>
                  </div>
                </label>
              </div>
              {checkUploadClick && (
                <div className="error-message text-danger my-2">
                  File is required
                </div>
              )}
            </Form.Group>
          ) : (
            <div className={styles.uploadedFile}>
              <div className="cardPdf">
                <span className="cardPdf_icon">
                  <PdfIcon />
                </span>
                <div className={styles.cardPdf_content}>
                  <h6 className={styles.nameTxt}>
                    {idCardImage.name.substring(
                      0,
                      idCardImage.name.lastIndexOf(".")
                    )}
                  </h6>
                  <span>{`PDF, ${formatFileSize(idCardImage.size, 2)}`}</span>
                </div>
                <span
                  className="delete_pdf"
                  onClick={() => {
                    setIdCardImage(undefined);
                  }}
                >
                  <CloseIcon />
                </span>
              </div>
            </div>
          )}
          <Form.Check
            className="mt-3"
            type="checkbox"
            id="1"
            label="Share with patient"
            checked={!checkSharePatient}
            onChange={setcheckSharePatient}
          />
        </Form>

        <div className="py-4 text-end">
          <button
            type="button"
            className="btn filled me-3"
            onClick={() => {
              if (diagnosisObj == undefined) {
                setCheckIsData(true);
              } else if (idCardImage == undefined) {
                setCheckUploadClick(true);
              } else {
                toggleAddLabTestModal();
                dispatch(
                  test_record_create({
                    is_showable: checkSharePatient,
                    file: idCardImage,
                    description: noteTxt,
                    user: localStorage.getItem("userId") || "",
                    data: dataObj,
                    id: diagnosisObj?.id?.toString() || "",
                  })
                );
              }
            }}
          >
            Save
          </button>
          <button
            type="button"
            className="btn outline"
            onClick={toggleAddLabTestModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default AddLabTestModal;
