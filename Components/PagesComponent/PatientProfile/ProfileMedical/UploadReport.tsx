// @ts-nocheck
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import styles from "./UploadReport.module.scss";
import pdfPickImg from "@assets/icons/pdfPickImg.svg";
import { PdfIcon, CloseIcon } from "@components/Common/Icons/common";
import { useToggle } from "rooks";
import { useDispatch } from "react-redux";
import { AppDispatch } from "redux/store";
import { file_record_create } from "redux/Patient/action";
import { FileUploader } from "react-drag-drop-files";
interface IProps {
  toggleUploadReportModal: () => void;
  toggleHitApi: () => void;
}
const UploadReport = ({ toggleUploadReportModal, toggleHitApi }: IProps) => {
  const [idCardImage, setIdCardImage] = useState<File>();
  const [checkSharePatient, setcheckSharePatient] = useToggle();
  const dispatch = useDispatch<AppDispatch>();
  const [noteTxt, setNoteTxt] = useState<string>("");
  const [checkUploadClick, setCheckUploadClick] = useState(false);

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
      <div className={styles.uploadReportBody}>
        <Form className={styles.uploadReport_form}>
          <Form.Group controlId="formDOB" className="mb-4">
            <Form.Label>Date taken</Form.Label>
            <Form.Control type="date" placeholder="" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
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
              <Form.Label>ID card</Form.Label>
              <div className={styles.idCard}>
                <FileUploader
                  multiple={false}
                  handleChange={handleChange}
                  type="file"
                  types={["pdf", "vnd.ms-excel"]}
                  name="cardImage"
                  id="cardImage"
                  label=" "
                  hoverTitle=" "
                />
                <label htmlFor="cardImage" className={styles.cardWrap}>
                  <div className={styles.pickImgWrap}>
                    <div className={styles.cardPickImg}>
                      <Image src={pdfPickImg} alt="CardPickImg"></Image>
                    </div>
                    <div className={`mb-2 ${styles.cardTxt2}`}>
                      Drop Lab test to attach or <span>browse</span>
                    </div>
                    <div className={styles.cardTxt1}>
                      You can upload files with the extensions:
                      <br /> PDF,XLS, DOCX, TXT JPEG, BMP, PMG, GIF, or TIFF.
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

        <div className="py-4">
          <button
            type="button"
            className="btn filled me-3"
            onClick={() => {
              if (idCardImage == undefined) {
                setCheckUploadClick(true);
              } else {
                toggleUploadReportModal();
                dispatch(
                  file_record_create({
                    is_showable: checkSharePatient,
                    file: idCardImage,
                    note: noteTxt,
                    user: localStorage.getItem("userId") || "",
                  })
                ).then(() => {
                  toggleHitApi();
                });
              }
            }}
          >
            Upload
          </button>
          <button
            type="button"
            className="btn outline"
            onClick={toggleUploadReportModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default UploadReport;
