import Link from "next/link";
import React from "react";
import styles from "./ProfileTabs.module.scss";
import useTranslation from "next-translate/useTranslation";

interface IProps {
  tabType?: string;
}
function ProfileTabs({ tabType }: IProps) {
  const { t } = useTranslation("profile");
  return (
    <div className={styles.ProfileTabs}>
      <div className={styles.ProfileTabs_inner}>
        <ul>
          <Link href="/patient/profile" passHref={true}>
            <li className={tabType === "patientInfo" ? styles.active : ""}>
              {t("tab1")}
            </li>
          </Link>
          <Link href="/patient/profile/notes" passHref={true}>
            <li className={tabType === "notes" ? styles.active : ""}>
              {t("tab2")}
            </li>
          </Link>
          <Link href="/patient/profile/lab-test" passHref={true}>
            <li className={tabType === "labTest" ? styles.active : ""}>
              {t("tab3")}
            </li>
          </Link>
          <Link href="/patient/profile/lab-test-history" passHref={true}>
            <li className={tabType === "labHistory" ? styles.active : ""}>
              {t("tab4")}
            </li>
          </Link>
          <Link href="/patient/profile/medical-reports" passHref={true}>
            <li className={tabType === "medicalReports" ? styles.active : ""}>
              {t("tab5")}
            </li>
          </Link>
          {/* <li>Prescriptions</li>
          <li>Pharmacies</li> */}
        </ul>
      </div>
    </div>
  );
}

export default ProfileTabs;
