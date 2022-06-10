import React from "react";
import DashboardLayout from "@components/Layouts/DashboardLayout";
import useTranslation from "next-translate/useTranslation";

interface IProps {
  props: unknown;
}
const Dashboard = ({ props }: IProps) => {
  const { t } = useTranslation("common");
  return (
    <DashboardLayout HeaderSubTitle={""}>
      <div>Dashboard {t("title", { siteName: "GluCare" })}</div>
    </DashboardLayout>
  );
};

export default Dashboard;
