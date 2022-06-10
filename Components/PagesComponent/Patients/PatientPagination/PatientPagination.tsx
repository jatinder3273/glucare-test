import { NextIcon, PreIcon } from "@components/Common/Icons/Icons";
import React from "react";
import styles from "./PatientPagination.module.scss";
import useTranslation from "next-translate/useTranslation";

const PatientPagination = () => {
  const { t } = useTranslation("patient");

  return (
    <div className={styles.patientPaginationWrap}>
      <span className={styles.paginationNumber}>
        <ul>
          <li className={styles.pre}>
            <PreIcon />
          </li>
          <li className={styles.active}>1</li>
          <li>2</li>
          <li>3</li>
          <li>...</li>
          <li>10</li>
          <li>
            <NextIcon />
          </li>
        </ul>
      </span>
      <span className={styles.rowPerPage}>
        <span className={styles.rowPerPageTxt}>{t("rows_per_page")}</span>
        <span className={styles.rowPerPageDropdown}>
          <select>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="30">30</option>
          </select>
        </span>
      </span>
    </div>
  );
};

export default PatientPagination;
