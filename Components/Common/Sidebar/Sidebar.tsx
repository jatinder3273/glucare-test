import React, { useContext, useEffect, useState } from "react";
import styles from "./Sidebar.module.scss";
import sidebarLogoImg from "../../../assets/icons/sidebarLogo.svg";
import sidebarLogoTxt from "../../../assets/icons/sidebarLogoTxt.svg";
import sidebarIcon1 from "../../../assets/icons/sidebarIcon1.svg";
import sidebarIcon2 from "../../../assets/icons/sidebarIcon2.svg";
import sidebarIcon3 from "../../../assets/icons/sidebarIcon3.svg";
import sidebarIcon4 from "../../../assets/icons/sidebarIcon4.svg";
import arrowImg from "../../../assets/icons/arrow.svg";
import Image from "next/image";
import { ToggleContext } from "Context/CommonContext";
import Link from "next/link";

const Sidebar = () => {
  const { toggle, setToggle } = useContext(ToggleContext);

  return (
    <div
      className={`${toggle ? styles.open : ""} ${styles.sidebarWrap}`}
      style={{ width: toggle ? "243px" : "60px" }}
    >
      <div className={styles.sidebarLogo}>
        <div className={styles.sidebarLogoImg}>
          <Image src={sidebarLogoImg} alt="sidebarLogoImg"></Image>
        </div>
        <div
          className={`${toggle ? styles.openSidebarLogoTxt : ""} ${
            styles.sidebarLogoTxt
          }`}
        >
          <Image src={sidebarLogoTxt} alt="sidebarLogoTxt"></Image>
        </div>

        <span
          className={styles.toggleSidebarBtn}
          onClick={() => setToggle(!toggle)}
        >
          <Image src={arrowImg} alt="arrowImg"></Image>
        </span>
      </div>
      <div className={styles.sidebarIconsWrap}>
        <div className={styles.sidebarIcon}>
          <Image src={sidebarIcon1} alt="sidebarIcon1"></Image>
          <span
            className={`${toggle ? styles.openSpan : ""} ${styles.spanTxt}`}
          >
            Today
          </span>
        </div>
        <Link href="/patient" passHref={true}>
          <div className={styles.sidebarIcon}>
            <Image src={sidebarIcon2} alt="sidebarIcon2"></Image>
            <span
              className={`${toggle ? styles.openSpan : ""} ${styles.spanTxt}`}
            >
              Patients
            </span>
          </div>
        </Link>
        <Link href="/chat" passHref={true}>
          <div className={styles.sidebarIcon}>
            <Image src={sidebarIcon3} alt="sidebarIcon3"></Image>
            <span
              className={`${toggle ? styles.openSpan : ""} ${styles.spanTxt}`}
            >
              Chat
            </span>
          </div>
        </Link>
        <Link href="/team" passHref={true}>
          <div className={styles.sidebarIcon}>
            <Image src={sidebarIcon4} alt="sidebarIcon4"></Image>
            <span
              className={`${toggle ? styles.openSpan : ""} ${styles.spanTxt}`}
            >
              Users
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
