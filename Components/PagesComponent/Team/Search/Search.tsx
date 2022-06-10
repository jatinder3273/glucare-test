// @ts-nocheck
import React, { useEffect, useState } from "react";
import styles from "./Search.module.scss";
import {
  DeleteIcon,
  FilterIcon,
  PlusIcon,
  SettingIcon,
} from "@components/Common/Icons/Icons";
import { SearchIcon } from "@components/Common/Icons/common";
import useTranslation from "next-translate/useTranslation";
import DrawerLayout from "@components/Layouts/DrawerLayout";
import AddUser from "../AddUser/AddUser";
import { useDispatch } from "react-redux";
import { getStaffRecord } from "redux/StaffServices/staff.action";
import { AppDispatch } from "redux/store";

interface searchType {
  pageSize: string;
  currentPage: string;
}

const Search = ({ pageSize, currentPage }: searchType) => {
  const { t } = useTranslation("common");
  const [deviceSidebar, setDeviceSidebar] = useState(false);
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchText(e.target.value);
    dispatch(
      getStaffRecord({
        page_size: pageSize,
        page: "1",
        search: e.target.value,
      })
    );
  };
  const handleClear = () => {
    setSearchText("");
    dispatch(getStaffRecord({ page_size: pageSize, page: "1", search: "" }));
  };

  const toggleDeviceSidebar = () => {
    setDeviceSidebar(!deviceSidebar);
  };

  return (
    <div className={styles.SearchWrap}>
      <div className={styles.searchBarWrap}>
        <span className="searchBar">
          <span className="searchIcon">
            <SearchIcon />
          </span>
          <input type="text" value={searchText} onChange={handleChange} />
        </span>
      </div>
      <div className={styles.searchButtons}>
        <span className="mx-lg-3">
          <button type="button" className="btn outline">
            <span className="btnIcon">
              <FilterIcon />
            </span>
            Filter
          </button>
        </span>
        {searchText !== "" && (
          <span className="mx-lg-3">
            <button type="button" className="btn outline" onClick={handleClear}>
              <span className="btnIcon">
                <DeleteIcon />
              </span>
              Clear Filter
            </button>
          </span>
        )}
        <div className="d-flex">
          <span className="mx-3">
            <button type="button" className="btn outline">
              <SettingIcon />
            </button>
          </span>
          <span className={styles.addBtn} onClick={toggleDeviceSidebar}>
            <button type="button" className="btn filled">
              <span className="btnIcon">
                <PlusIcon />
              </span>
              Add User
            </button>
          </span>
          <DrawerLayout
            title={t("add_user")}
            toggleSidebar={toggleDeviceSidebar}
            openSidebar={deviceSidebar}
          >
            <AddUser toggleSidebar={toggleDeviceSidebar} />
          </DrawerLayout>
        </div>
      </div>
    </div>
  );
};

export default Search;
