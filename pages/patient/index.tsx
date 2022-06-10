/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@components/Layouts/DashboardLayout";
import SearchPatients from "@components/PagesComponent/Patients/SearchPatients/SearchPatients";
import PatientsList from "@components/PagesComponent/Patients/PatientsList/PatientsList";
import { patient_list } from "redux/Patient/action";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "redux/store";
import Pagination from "@components/Common/Pagination/Pagination";

const Patients = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState<any>();
  const patientListData = useSelector((state: any) => state.patient);
  const dispatch = useDispatch<AppDispatch>();
  const [currentPage, setCurrentPage] = useState(
    pagination != undefined ? pagination.page : 1
  );
  const [pageSize, setPageSize] = useState(
    pagination != undefined ? pagination.page_size : 10
  );

  useEffect(() => {
    dispatch(
      patient_list({
        page_size: pageSize,
        ordering: "-created",
        page: currentPage,
      })
    );
  }, [pageSize, currentPage]);

  useEffect(() => {
    setData(patientListData.body);
    setPagination(patientListData.pagination);
  }, [patientListData]);

  return (
    <DashboardLayout HeaderSubTitle={`(${data.length})`}>
      <SearchPatients />
      <PatientsList data={data} />
      <Pagination
        currentPage={currentPage}
        totalCount={pagination != undefined ? pagination.count : 1}
        pageSize={pageSize}
        siblingCount={1}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
      />
    </DashboardLayout>
  );
};

export default Patients;
