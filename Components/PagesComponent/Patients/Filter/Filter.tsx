// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import styles from "./Filter.module.scss";
import Select from "react-select";
import Image from "next/image";
import closeIcon from "@assets/icons/closeIcon.svg";
import { FormCheckIcon } from "@components/Common/Icons/Icons";
import { CalendarIcon, CloseIcon } from "@components/Common/Icons/common";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Form } from "react-bootstrap";
import useTranslation from "next-translate/useTranslation";

interface IProps {
  toggleModal: () => void;
  toggleModalTitle: () => void;
  modalColorName: string;
}
interface ListType {
  id: number;
  label: string;
  value: string;
  type: number;
}

interface Option {
  id: number;
  value: string;
  label: string;
}

interface DoctorOption {
  readonly value: string;
  readonly label: string;
  readonly img: string;
}

interface ColorType {
  id: number;
  color: string;
  bgColor: string;
}

const Filter = ({ toggleModal, toggleModalTitle, modalColorName }: IProps) => {
  const { t } = useTranslation("patient");
  const [lastDate, setLastdate] = useState({ from: false, to: false });
  const [chatDate, setChatdate] = useState({ from: false, to: false });

  const [list, setList] = useState<Option[]>([
    { id: 2, value: "Diagnosis", label: "Diagnosis" },
    { id: 3, value: "Age", label: "Age" },
    { id: 4, value: "Doctor", label: "Doctor" },
    { id: 5, value: "Last update", label: "Last update" },
    { id: 6, value: "Status", label: "Status" },
    { id: 7, value: "Weight", label: "Weight" },
    { id: 8, value: "Score", label: "Score" },
    { id: 9, value: "Food Log", label: "Food Log" },
    { id: 10, value: "Blood pressure", label: "Blood pressure" },
    { id: 11, value: "Band active", label: "Band active" },
    { id: 12, value: "Chat active", label: "Chat active" },
  ]);

  const [criteriaList, setCriteriaList] = useState<ListType[]>([
    {
      id: 1,
      label: "Gender",
      value: "",
      type: 1,
    },
  ]);

  const primaryDoctorOptions: readonly DoctorOption[] = [
    {
      value: "Dr. Jacob Jones",
      label: "Dr. Jacob Jones",
      img: "https://randomuser.me/api/portraits/men/71.jpg",
    },
    {
      value: "Dr. Guy Hawkins",
      label: "Dr. Guy Hawkins",
      img: "https://randomuser.me/api/portraits/men/80.jpg",
    },
    {
      value: "Dr. Robert Fox",
      label: "Dr. Robert Fox",
      img: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
      value: "Dr. Jenny Wilson",
      label: "Dr. Jenny Wilson",
      img: "https://randomuser.me/api/portraits/men/58.jpg",
    },
  ];

  const selectInputRef = useRef<any | null>(null);

  const renderCriteria = (data: ListType) => {
    return (
      <div className={styles.criteriaWrap} key={data.id}>
        <div className={`theme_select_field ${styles.selectWrap}`}>
          <Select
            menuPlacement="auto"
            value={data}
            classNamePrefix="select"
            isClearable={false}
            closeMenuOnSelect={true}
            // @ts-ignore
            options={list}
            onChange={(e) => {
              const objIndex = criteriaList.findIndex(
                (obj) => obj.label == data.label
              );
              const newObj = [...criteriaList];

              // Update list

              const newListObj = [...list];
              newListObj.unshift({
                id: e?.id,
                value: newObj[objIndex].label,
                label: newObj[objIndex].label,
              });
              setList(newListObj.filter((data) => data.label !== e?.label));

              // Update CriteriaList

              newObj[objIndex].label = e?.label;
              newObj[objIndex].value = "";
              switch (e?.label) {
                case "Gender":
                  newObj[objIndex].type = 1;
                  break;
                case "Diagnosis":
                  newObj[objIndex].type = 1;
                  break;
                case "Age":
                  newObj[objIndex].type = 2;
                  break;
                case "Doctor":
                  newObj[objIndex].type = 3;
                  break;
                case "Last update":
                  newObj[objIndex].type = 4;
                  break;
                case "Status":
                  newObj[objIndex].type = 1;
                  break;
                case "Weight":
                  newObj[objIndex].type = 2;
                  break;
                case "Score":
                  newObj[objIndex].type = 2;
                  break;
                case "Food Log":
                  newObj[objIndex].type = 1;
                  break;
                case "Blood pressure":
                  newObj[objIndex].type = 2;
                  break;
                case "Band active":
                  newObj[objIndex].type = 1;
                  break;
                case "Chat active":
                  newObj[objIndex].type = 4;
                  break;
                default:
                  newObj[objIndex].type = 1;
                  break;
              }

              setCriteriaList(newObj);
            }}
          />
        </div>
        <div className={styles.valueWrap}>
          {data.type == 1 ? (
            <div className={`theme_select_field ${styles.type1}`}>
              <Select
                menuPlacement="auto"
                classNamePrefix="select"
                isClearable={false}
                closeMenuOnSelect={true}
                placeholder="Select"
                onChange={(e) => {
                  const objIndex = criteriaList.findIndex(
                    (obj) => obj.label == data.label
                  );

                  const newObj = [...criteriaList];
                  newObj[objIndex].value = e?.label;
                  setCriteriaList(newObj);
                }}
                options={
                  data.label == "Gender"
                    ? [
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" },
                        { value: "others", label: "Others" },
                      ]
                    : data.label == "Diagnosis"
                    ? [
                        { value: "Type 1 diabetes", label: "Type 1 diabetes" },
                        { value: "Type 2 diabetes", label: "Type 2 diabetes" },
                        { value: "Type 3 diabetes", label: "Type 3 diabetes" },
                        { value: "Type 4 diabetes", label: "Type 4 diabetes" },
                      ]
                    : data.label == "Status"
                    ? [
                        { value: "Active", label: "Active" },
                        { value: "Inactive", label: "Inactive" },
                      ]
                    : data.label == "Food Log"
                    ? [
                        { value: "20", label: "20" },
                        { value: "25", label: "25" },
                        { value: "30", label: "30" },
                        { value: "35", label: "35" },
                      ]
                    : data.label == "Band active"
                    ? [
                        { value: "active", label: "active" },
                        { value: "inactive", label: "inactive" },
                      ]
                    : null
                }
              />
            </div>
          ) : data.type == 2 ? (
            <div className={styles.type2}>
              <div className={`theme_select_field ${styles.type2Input}`}>
                <input
                  type="text"
                  placeholder="From"
                  onChange={(e) => {
                    const objIndex = criteriaList.findIndex(
                      (obj) => obj.label == data.label
                    );

                    const newObj = [...criteriaList];
                    newObj[objIndex].value = {
                      ...newObj[objIndex].value,
                      from: e.target.value,
                    };
                    setCriteriaList(newObj);
                  }}
                />
              </div>
              <div className={`theme_select_field ${styles.type2Input}`}>
                <input
                  type="text"
                  placeholder="To"
                  onChange={(e) => {
                    const objIndex = criteriaList.findIndex(
                      (obj) => obj.label == data.label
                    );

                    const newObj = [...criteriaList];
                    newObj[objIndex].value = {
                      ...newObj[objIndex].value,
                      to: e.target.value,
                    };
                    setCriteriaList(newObj);
                  }}
                />
              </div>
            </div>
          ) : data.type == 3 ? (
            <div className={`theme_select_field ${styles.type3}`}>
              <div className="filterDoctorWrap">
                <Select
                  menuPlacement="auto"
                  ref={selectInputRef}
                  createOptionPosition="first"
                  name="primarydoctor"
                  options={primaryDoctorOptions}
                  classNamePrefix="select"
                  placeholder="select"
                  isClearable={false}
                  closeMenuOnSelect={true}
                  getOptionLabel={(e) => (
                    <div className="menuItemWrap">
                      <div className="menuItem_detail">
                        <img
                          src={e.img}
                          style={{
                            height: "32px",
                            width: "32px",
                            borderRadius: "50%",
                          }}
                        />
                        <p
                          style={{
                            marginLeft: "16px",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            color: "black",
                          }}
                        >
                          {e.label}
                        </p>
                      </div>
                      <div className="menuItem_check">
                        <FormCheckIcon />
                      </div>
                      <div
                        role="button"
                        className="menuItem_close "
                        onClick={(event) => {}}
                      >
                        <CloseIcon />
                      </div>
                    </div>
                  )}
                  onChange={(e) => {
                    const objIndex = criteriaList.findIndex(
                      (obj) => obj.label == data.label
                    );

                    const newObj = [...criteriaList];
                    newObj[objIndex].value = e;
                    setCriteriaList(newObj);
                  }}
                />
              </div>
            </div>
          ) : (
            <div className={styles.type4}>
              <div className={styles.fromInputWrap}>
                <span className={styles.searchIcon}>
                  <CalendarIcon />
                </span>
                <DatePicker
                  selected={
                    data.label == "Last update" ? lastDate.from : chatDate.from
                  }
                  onChange={(date: Date) => {
                    const newObj =
                      data.label == "Last update"
                        ? { ...lastDate, from: date }
                        : { ...chatDate, from: date };
                    data.label == "Last update"
                      ? setLastdate(newObj)
                      : setChatdate(newObj);

                    const objIndex = criteriaList.findIndex(
                      (obj) => obj.label == data.label
                    );

                    const newObj2 = [...criteriaList];
                    newObj2[objIndex].value = newObj;
                    setCriteriaList(newObj2);
                  }}
                  placeholderText={"From:"}
                  className={styles.fromInput}
                />
              </div>
              <div className={styles.toInputWrap}>
                <DatePicker
                  selected={
                    data.label == "Last update" ? lastDate.to : chatDate.to
                  }
                  onChange={(date: Date) => {
                    const newObj =
                      data.label == "Last update"
                        ? { ...lastDate, to: date }
                        : { ...lastDate, to: date };
                    data.label == "Last update"
                      ? setLastdate(newObj)
                      : setChatdate(newObj);

                    const objIndex = criteriaList.findIndex(
                      (obj) => obj.label == data.label
                    );

                    const newObj2 = [...criteriaList];
                    newObj2[objIndex].value = newObj;
                    setCriteriaList(newObj2);
                  }}
                  placeholderText={"To:"}
                  className={styles.toInput}
                />
              </div>
            </div>
          )}
        </div>
        {data.id !== 1 ? (
          <div
            className={styles.closeWrap}
            onClick={() => {
              const newObj = [...criteriaList];

              setCriteriaList(
                newObj.filter(
                  (secondData: ListType) => secondData.id !== data.id
                )
              );

              // Update list

              const newListObj = [...list];
              newListObj.unshift({
                id: data.id,
                value: data.label,
                label: data.label,
              });
              setList(newListObj);
            }}
          >
            <Image src={closeIcon} alt="closeIcon" />
          </div>
        ) : null}
      </div>
    );
  };

  const [showSaveModal, setShowSaveModal] = useState(false);

  const selectColor = [
    { id: 1, color: "#B433AF", bgColor: "#B433AF33" },
    { id: 2, color: "#636363", bgColor: "#C4C4C4" },
    { id: 3, color: "#74b9c2", bgColor: "#E1F8FB" },
    { id: 4, color: "#a8a9b3", bgColor: "#E7E9F5" },
    { id: 5, color: "#eb9d8a", bgColor: "#FBE9E5" },
    { id: 6, color: "#71a394", bgColor: "#E0F4EE" },
    { id: 7, color: "#cfc055", bgColor: "#FFF8C3" },
    { id: 8, color: "#7333B4", bgColor: "#7333B433" },
    { id: 9, color: "#FF6D2F", bgColor: "#FF6D2F33" },
    { id: 10, color: "#AA33B4", bgColor: "#AA33B433" },
    { id: 11, color: "#B43371", bgColor: "#B4337133" },
  ];

  const renderColors = (data: ColorType) => {
    return (
      <div className={styles.radioCheck} key={data.id}>
        <input
          type="radio"
          name="color"
          id={`color${data.id}`}
          defaultChecked={data.id == 1 ? true : false}
        />
        <label
          htmlFor={`color${data.id}`}
          style={{
            backgroundColor: data.bgColor,
            color: data.color,
            border: `1px solid ${data.color}`,
          }}
        >
          <span className={styles.checkIcon}>
            <FormCheckIcon />
          </span>
        </label>
      </div>
    );
  };

  useEffect(() => {
    modalColorName != "false"
      ? setShowSaveModal(true)
      : setShowSaveModal(false);
  }, []);

  return (
    <div className={styles.mainWrap}>
      {showSaveModal ? (
        <div className={styles.saveFilterWrap}>
          <Form.Group controlId="filterTitle">
            <Form.Label>{t("filter_title")}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t("new_filter")}
              value={modalColorName != "false" ? modalColorName : ""}
            />
          </Form.Group>
          <Form.Group controlId="filterColor" className={styles.colorWrap}>
            <Form.Label>{t("select_color")}</Form.Label>
            <div className={styles.radio}>{selectColor.map(renderColors)}</div>
          </Form.Group>
        </div>
      ) : null}

      <div
        className={styles.contentWrap}
        style={{ minHeight: !showSaveModal ? "525px" : "345px" }}
      >
        <div className={styles.contentHeadingWrap}>
          <div>{t("criteria")}</div>
          <div>{t("value")}</div>
        </div>
        {criteriaList.map(renderCriteria)}
        {list.length > 0 ? (
          <div className="theme_select_field">
            <div className={styles.selectCriteriaWrap}>
              <Select
                menuPlacement="auto"
                options={list}
                classNamePrefix="select"
                placeholder={t("select_criteria")}
                isClearable={false}
                closeMenuOnSelect={true}
                value=""
                onChange={(e) => {
                  const newObj = [...criteriaList];
                  let objType = 1;
                  switch (e?.label) {
                    case "Gender":
                      objType = 1;
                      break;
                    case "Diagnosis":
                      objType = 1;
                      break;
                    case "Age":
                      objType = 2;
                      break;
                    case "Doctor":
                      objType = 3;
                      break;
                    case "Last update":
                      objType = 4;
                      break;
                    case "Status":
                      objType = 1;
                      break;
                    case "Weight":
                      objType = 2;
                      break;
                    case "Score":
                      objType = 2;
                      break;
                    case "Food Log":
                      objType = 1;
                      break;
                    case "Blood pressure":
                      objType = 2;
                      break;
                    case "Band active":
                      objType = 1;
                      break;
                    case "Chat active":
                      objType = 4;
                      break;
                    default:
                      objType = 1;
                      break;
                  }
                  newObj.push({
                    id: e?.id,
                    label: e?.label,
                    value: {
                      label: "Male",
                    },
                    type: objType,
                  });
                  setCriteriaList(newObj);

                  // Update list

                  const newListObj = [...list];
                  setList(newListObj.filter((data) => data.label !== e?.label));
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
      <div className={styles.buttonWrap}>
        <div className="applySaveWrap">
          {!showSaveModal ? (
            <>
              <button
                type="button"
                className="btn filled"
                onClick={toggleModal}
              >
                {t("apply_filters")}
              </button>
              <button
                type="button"
                className={`btn outline ${styles.cancelButton}`}
                onClick={() => {
                  toggleModalTitle();
                  setShowSaveModal(true);
                }}
              >
                {t("save_filter_set")}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn filled"
                onClick={toggleModal}
              >
                {t("save_filter")}
              </button>
              <button
                type="button"
                className={`btn outline ${styles.cancelButton}`}
                onClick={toggleModal}
              >
                {t("cancel")}
              </button>
            </>
          )}
        </div>
        {!showSaveModal ? (
          <div className="cancelWrap">
            <button
              type="button"
              className={`btn outline ${styles.cancelButton}`}
              onClick={toggleModal}
            >
              {t("cancel")}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Filter;
