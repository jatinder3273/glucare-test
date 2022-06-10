import React, { useContext, useEffect, useState } from "react";
import Sidebar from "@components/Common/Sidebar/Sidebar";
import Header from "@components/Common/Header/index";
import styles from "./Dashboard.module.scss";
import { ToggleContext } from "Context/CommonContext";
import { getCurrentUser } from "utils";
import { useRouter } from "next/router";

interface IProps {
  children: React.ReactNode;
  hideBorder?: boolean;
  HeaderSubTitle: string;
  profilePage?: boolean;
  isTeamPage?: boolean;
}

const DashboardLayout = ({
  children,
  hideBorder,
  HeaderSubTitle,
  profilePage,
  isTeamPage,
}: IProps) => {
  const router = useRouter();
  const { toggle } = useContext(ToggleContext);
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser.token) {
      router.push("/");
    }
  }, [router]);

  return (
    <div style={{ transition: "all 0.2s", paddingLeft: toggle ? 243 : 60 }}>
      <Sidebar />
      <Header
        hideBorder={hideBorder}
        HeaderSubTitle={HeaderSubTitle}
        profilePage={profilePage}
        isTeamPage={isTeamPage}
      />
      <div className={styles.dashboardWrapper}>{children}</div>
    </div>
  );
};

export default DashboardLayout;
