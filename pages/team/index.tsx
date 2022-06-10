/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
// @ts-nocheck
import React, { useState, useEffect } from "react";
import DashboardLayout from "@components/Layouts/DashboardLayout";
import Search from "@components/PagesComponent/Team/Search/Search";
import DataTableComponent from "@components/Common/DataTableComponent";
import patientImage from "@assets/icons/patientImage.svg";
import styles from "./Team.module.scss";
import {
  ArchiveIcon,
  EditIcon,
  OptionIcon,
} from "@components/Common/Icons/Icons";
import { Dropdown, Image } from "react-bootstrap";
import axios from "axios";
import { constants } from "utils/Constants";
import { useDispatch, useSelector } from "react-redux";
import { getStaffRecord } from "redux/StaffServices/staff.action";
import { refreshToken } from "redux/Auth/action";
import { AppDispatch } from "redux/store";
import { AnyARecord } from "dns";
import Spinner from "react-bootstrap/Spinner";
import { getImageFromStore } from "../../redux/commonServices";
import { string } from "yup/lib/locale";
import { imageOptimizer } from "next/dist/server/image-optimizer";
import profile_placeholder from "@assets/icons/profile_placeholder.svg";
import { getImage } from "redux/Image/action";
import Pagination from "@components/Common/Pagination/Pagination";

const Team = () => {
  const [userData, setUserData] = useState([]);
  const staffData = useSelector((state: any) => state?.staffRecord?.staffData);
  const imageData = useSelector((state: { image: string }) => state.image);
  const dispatch = useDispatch<AppDispatch>();
  const [callApi, setCallApi] = useState(true);
  const [pagination, setPagination] = useState<any>();
  const [currentPage, setCurrentPage] = useState(
    pagination != undefined ? pagination.page : 1
  );
  const [pageSize, setPageSize] = useState(
    pagination != undefined ? pagination.page_size : 10
  );

  interface rowType {
    row: {
      avatar?: null | string;
      cgm?: string;
      closed?: string;
      eScore?: string;
      name?: string;
      recentActivity?: string;
      role?: string;
      status?: string;
      user: number;
      weight?: string;
    };
  }

  const ProfileData = ({ row }: rowType) => {
    return (
      <span className={styles.patientImgWrap}>
        <span className={styles.patientImg}>
          <Image
            src={
              row.avatar !== null
                ? imageData.user[row.user]
                : profile_placeholder.src
            }
          ></Image>
        </span>
        <span className={styles.patientNameWrap}>
          <div className={styles.patientName}>{row.name}</div>
        </span>
      </span>
    );
  };

  const TeamAssignedData = () => {
    const [showMenu, setShowMenu] = useState(false);

    return (
      <ul className={styles.teamList}>
        <li className={styles.teamListItem}>
          <Image src={patientImage.src} alt="avatar" />
        </li>
        <li className={styles.teamListItem}>
          <Image src={patientImage.src} alt="avatar" />
        </li>
        <li className={styles.teamListItem}>
          <Image src={patientImage.src} alt="avatar" />
        </li>
        <div className={styles.teamListNumber}>
          <Dropdown className={styles.teamList_dropdown}>
            <Dropdown.Toggle variant="" id="dropdown-basic">
              <span className={styles.imgContent}>+4</span>
            </Dropdown.Toggle>

            <Dropdown.Menu
              className={`themeDropdown_menu ${styles.teamList_DropMenu}`}
              align="end"
            >
              <Dropdown.Item as="li">
                <span className="themeDropdown_menuImage">
                  <Image src={patientImage.src} alt="avatar" />
                </span>
                John Doe
              </Dropdown.Item>
              <Dropdown.Item as="li">
                <span className="themeDropdown_menuImage">
                  <Image src={patientImage.src} alt="avatar" />
                </span>
                Darlene Robertson
              </Dropdown.Item>
              <Dropdown.Item as="li">
                <span className="themeDropdown_menuImage">
                  <Image src={patientImage.src} alt="avatar" />
                </span>
                Jenny Wilson
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {/* {showMenu && (
          <Dropdown.Menu show>
            <Dropdown.Item eventKey="2">
              <span className={styles.team_menuIcon}>
                <Image src={patientImage} alt="avatar" />
              </span>
              <span className={styles.listContent}>John Doe</span>
            </Dropdown.Item>
            <Dropdown.Item eventKey="3">
              <span className={styles.team_menuIcon}>
                <Image src={patientImage} alt="avatar" />
              </span>
              <span className={styles.listContent}>John Doe</span>
            </Dropdown.Item>
            <Dropdown.Item eventKey="4">
              <span className={styles.team_menuIcon}>
                <Image src={patientImage} alt="avatar" />
              </span>
              <span className={styles.listContent}>John Doe</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        )} */}
      </ul>
    );
  };

  const Option = ({ row }: rowType) => {
    return (
      <span style={{ color: "#818496" }} className={styles.option}>
        <Dropdown className={styles.headerProfile_dropdown}>
          <Dropdown.Toggle variant="" id="dropdown-basic">
            <OptionIcon />
          </Dropdown.Toggle>

          <Dropdown.Menu className="themeDropdown_menu" align="end">
            <Dropdown.Item as="li">
              <span className="themeDropdown_menuIcon">
                <EditIcon />
              </span>
              Edit info
            </Dropdown.Item>

            <Dropdown.Item as="li">
              <span style={{ color: "#FE5500" }}>
                <span
                  className="themeDropdown_menuIcon"
                  style={{ color: "#FE5500" }}
                >
                  <ArchiveIcon />
                </span>
                Archive
              </span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </span>
    );
  };

  const columns = [
    {
      cell: (row: rowType["row"]) => <ProfileData row={row} />,
      name: "Name",
      selector: (row: { name: string }) => row.name,
      sortable: true,
      minWidth: "185px",
    },
    {
      name: "Role",
      selector: (row: { role: string }) => row.role,
      sortable: true,
      minWidth: "185px",
    },
    {
      name: "Caseload",
      selector: (row: { eScore: string }) => row.eScore,
      sortable: true,
      minWidth: "74px",
    },
    {
      name: "Assigned",
      selector: (row: { eScore: string }) => row.eScore,
      cell: () => <TeamAssignedData />,
      sortable: true,
      minWidth: "88px",
    },
    {
      name: "Closed",
      selector: (row: { closed: string }) => row.closed,
      sortable: true,
      minWidth: "98px",
    },
    {
      name: "Recent activity",
      selector: (row: { recentActivity: string }) => row.recentActivity,
      sortable: true,
      minWidth: "190px",
    },
    {
      cell: (row: rowType["row"]) => <Option row={row} />,
      width: "64px",
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        color: "#6C7893",
      },
    },
    rows: {
      style: {
        height: "64px",
        marginBottom: "-1px",
      },
    },
  };

  useEffect(() => {
    if (
      staffData !== undefined &&
      Object.keys(staffData).length > 0 &&
      staffData.status !== "FAIL"
    ) {
      let finalData: any = [];
      staffData?.data.map((item: rowType["row"]) => {
        let dataObj = {
          user: item.user,
          name: item.first_name + " " + item.last_name,
          role: item.role,
          cgm: "3/14",
          eScore: "23",
          closed: "23",
          weight: "33kg",
          recentActivity: "Today at 11:12 PM",
          status: item.status,
          avatar: item.avatar,
        };
        finalData.push(dataObj);
      });
      setUserData(finalData);
    } else {
      setUserData([]);
      if (
        staffData !== undefined &&
        Object.keys(staffData).length > 0 &&
        staffData.status === "FAIL"
      ) {
        dispatch(
          getStaffRecord({
            page_size: pageSize,
            page: currentPage,
            search: "",
          })
        );
      }
    }
    setPagination(staffData.pagination);
  }, [staffData]);

  useEffect(() => {
    if (callApi && userData.length != 0) {
      staffData.data.map((data: { avatar: string | null; user: number }) => {
        if (data.avatar != null) {
          dispatch(
            getImage({
              url: data.avatar,
              id: data.user,
              type: "user",
            })
          );
        }
      });
      setCallApi(false);
    }
  }, [userData]);

  useEffect(() => {
    dispatch(
      getStaffRecord({
        page_size: pageSize,
        page: currentPage,
        search: "",
      })
    );
    setCallApi(true);
  }, [pageSize, currentPage]);

  return (
    <DashboardLayout isTeamPage HeaderSubTitle={`(${userData.length})`}>
      <Search pageSize={pageSize} currentPage={currentPage} />
      {Object.keys(staffData).length > 0 ? (
        <DataTableComponent
          data={userData}
          customStyles={customStyles}
          columns={columns}
        />
      ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden text-center">Loading...</span>
          </Spinner>
        </div>
      )}
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

export default Team;
