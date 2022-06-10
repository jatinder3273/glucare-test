import React, { useState } from "react";
import styles from "./ReportDetailPage.module.scss";
import { Logo } from "@components/Common/Icons/common";
import Image from "next/image";
import {
  PillIcon,
  PreIcon,
  PrinterIcon,
  ShareIcon,
  UploadIcon,
} from "@components/Common/Icons/Icons";
// import Logo from "@assets/logo.svg";
interface IProps {
  closeReportDetail: () => void;
}
const ReportDetailPage = ({ closeReportDetail }: IProps) => {
  return (
    <>
      <div className={styles.reportDetailPage}>
        <div className={styles.reportDetail_back}>
          <button type="button" className="btn" onClick={closeReportDetail}>
            <PreIcon />
            Back to list
          </button>
        </div>
        <div className={styles.reportDetailWrapper}>
          <div className={styles.reportDetail_header}>
            <h5>17 March 2022</h5>
            <div className={styles.buttonGroup}>
              <button
                className="btn outline iconBtn me-md-3 me-2"
                type="button"
              >
                <UploadIcon />
              </button>
              <button
                className="btn outline iconBtn me-md-3 me-2"
                type="button"
              >
                <PrinterIcon />
              </button>
              <button className="btn outline iconBtn" type="button">
                <ShareIcon />
              </button>
            </div>
          </div>
          <div className={`theme_border ${styles.reportDetail_card}`}>
            <div className={styles.reportDetail_title}>
              <span className={styles.logo}>
                <Logo />
              </span>
              <h6>16 March 2022</h6>
            </div>
            <div className={styles.reportDetail_body}>
              <div className={styles.reportDetail_personal}>
                <div className={styles.personal_single}>
                  <h5>Patient</h5>
                  <p>Jacob Hawkins</p>
                </div>
                <div className={styles.personal_single}>
                  <h5>Patient number</h5>
                  <p>#345687</p>
                </div>
                <div className={styles.personal_single}>
                  <h5>Date of Birth</h5>
                  <p>16 March 1997</p>
                </div>
              </div>
              <div className={styles.reportDetail_medical}>
                <div className={styles.reportDetail_list}>
                  <h5>Active alergies:</h5>
                  <ul className="list">
                    <li>Penicillin and related antibiotics</li>
                    <li>Antibiotics containing sulfonamides (sulfa drugs)</li>
                    <li>
                      Aspirin, ibuprofen and other nonsteroidal
                      anti-inflammatory drugs (NSAIDs)
                    </li>
                  </ul>
                </div>
                <div className={styles.reportDetail_list}>
                  <h5>Active diagnosis list:</h5>
                  <ul>
                    <li>High risk of gestational diabetes</li>
                    <li>Gestational diabetes</li>
                    <li>Type 1 diabetes</li>
                  </ul>
                </div>
                <div className={styles.medication}>
                  <h5>Medication</h5>
                  <div className={styles.medication_card}>
                    <div className={styles.cardIcon}>
                      <PillIcon />
                    </div>
                    <div className={styles.cardContent}>
                      <h5>Vitamin D3, 500 mg, Tablets</h5>
                      <p>1 tablet take with food every morning</p>
                      <span>Note: Avoid drinking alcohol </span>
                    </div>
                  </div>

                  <div className={styles.medication_card}>
                    <div className={styles.cardIcon}>
                      <PillIcon />
                    </div>
                    <div className={styles.cardContent}>
                      <h5>Vitamin D3, 500 mg, Tablets</h5>
                      <p>1 tablet take with food every morning</p>
                      <span>Note: Avoid drinking alcohol </span>
                    </div>
                  </div>

                  <div className={styles.medication_card}>
                    <div className={styles.cardIcon}>
                      <PillIcon />
                    </div>
                    <div className={styles.cardContent}>
                      <h5>Vitamin D3, 500 mg, Tablets</h5>
                      <p>1 tablet take with food every morning</p>
                      <span>Note: Avoid drinking alcohol </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportDetailPage;
