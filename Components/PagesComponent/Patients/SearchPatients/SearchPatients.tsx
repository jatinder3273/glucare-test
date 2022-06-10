// @ts-nocheck
import React, { useEffect, useState } from "react";
import styles from "./SearchPatients.module.scss";
import Image from "next/image";
import searchIcon from "@assets/icons/searchPatients.svg";
import editIcon from "@assets/icons/editIcon.svg";
import deleteIcon from "@assets/icons/deleteIcon.svg";
import DrawerLayout from "@components/Layouts/DrawerLayout";
import {
  FilterIcon,
  FormCheckIcon,
  PlusIcon,
  SettingIcon,
} from "@components/Common/Icons/Icons";
import AddPatient from "../AddPatient/AddPatient";
import { Dropdown } from "react-bootstrap";
import SettingDropdown from "../SettingDropdown/SettingDropdown";
import useTranslation from "next-translate/useTranslation";
import ModalLayout from "@components/Layouts/ModalLayout";
import Filter from "../Filter/Filter";
import { OptionIcon } from "@components/Common/Icons/common";
import { useToggle } from "rooks";

interface FilterType {
  id: number;
  color: string;
  bgColor: string;
  name: string;
}

const SearchPatients = () => {
  const { t } = useTranslation("patient");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState(t("filter"));
  const [modalColorName, setModalColorName] = useState<string>("false");
  const [deviceSidebar, setDeviceSidebar] = useToggle(false);

  const toggleModal = () => {
    setShowModal(!showModal);
    setModalTitle(t("filter"));
  };

  const toggleModalTitle = () => {
    setModalTitle(t("save_filter"));
  };

  const selectFilter = [
    { id: 1, color: "#B433AF", bgColor: "#B433AF33", name: "Type 1 diabetes" },
    { id: 2, color: "#cfc055", bgColor: "#FFF8C3", name: "My patients" },
    { id: 3, color: "#74b9c2", bgColor: "#E1F8FB", name: "Hight weight" },
    { id: 4, color: "#a8a9b3", bgColor: "#E7E9F5", name: "Last filter" },
  ];

  const renderFilters = (data: FilterType) => {
    return (
      <div className={styles.radioCheck} key={data.id}>
        <input type="radio" name="color" id={`color${data.id}`} />
        <label
          htmlFor={`color${data.id}`}
          style={{
            backgroundColor: data.bgColor,
          }}
        >
          <span className={styles.filterTxt}>{data.name}</span>
          <span className={styles.checkIcon}>
            <FormCheckIcon />
          </span>

          <Dropdown className={styles.headerProfile_dropdown}>
            <Dropdown.Toggle variant="" id="dropdown-basic">
              <span className={styles.optionIcon}>
                <OptionIcon />
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu
              className={`${styles.dropDown} themeDropdown_menu`}
              align="end"
            >
              <Dropdown.Item
                as="li"
                onClick={() => {
                  toggleModal();
                  setModalTitle(t("save_filter"));
                  setModalColorName(data.name);
                }}
              >
                <span className={styles.dropDownImage}>
                  <Image src={editIcon} alt="" />
                </span>
                Edit
              </Dropdown.Item>
              <Dropdown.Item as="li" style={{ color: "#fe5500" }}>
                <span className={styles.dropDownImage}>
                  <Image src={deleteIcon} alt="" />
                </span>
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </label>
      </div>
    );
  };

  return (
    <div className={styles.SearchPatientsWrap}>
      <div className={styles.filterButtonWrap}>
        <div className={styles.left}>
          <span className="searchBar">
            <span className="searchIcon">
              <Image src={searchIcon} alt="searchIcon" />
            </span>
            <input type="text" placeholder="Search" />
          </span>
          <span
            className={styles.filterBtn}
            onClick={() => {
              toggleModal();
              setModalColorName("false");
            }}
          >
            <button type="button" className="btn outline">
              <span className="btnIcon">
                <FilterIcon />
              </span>
              {t("filter")}
            </button>
          </span>
          <ModalLayout
            title={modalTitle}
            openModal={showModal}
            toggleModal={toggleModal}
            isFilterPopup
          >
            <Filter
              toggleModal={toggleModal}
              toggleModalTitle={toggleModalTitle}
              modalColorName={modalColorName}
            />
          </ModalLayout>
        </div>
        <div className={styles.right}>
          <Dropdown className={styles.setting_dropdown}>
            <Dropdown.Toggle
              variant=""
              id="dropdown-basic"
              className="btn outline me-3"
            >
              <span>
                <SettingIcon />
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu
              className={`theme_checkBox_menu ${styles.settingMenu}`}
              align="end"
            >
              <SettingDropdown />
            </Dropdown.Menu>
          </Dropdown>

          <span className={styles.addPatientBtn} onClick={setDeviceSidebar}>
            <button type="button" className="btn filled">
              <span className="btnIcon">
                <PlusIcon />
              </span>
              {t("add_patient")}
            </button>
          </span>
          <DrawerLayout
            title={t("add_patient")}
            toggleSidebar={setDeviceSidebar}
            openSidebar={deviceSidebar}
          >
            <AddPatient setDeviceSidebar={setDeviceSidebar} />
          </DrawerLayout>
        </div>
      </div>
      <div className={styles.savedFilterWrap}>
        <span className={styles.savedTxt}>{`${t("saved_filters")}:`}</span>
        <div className={styles.filtersListWrap}>
          {selectFilter.map(renderFilters)}
        </div>
      </div>
    </div>
  );
};

export default SearchPatients;
