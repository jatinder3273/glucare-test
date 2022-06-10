// @ts-nocheck
import { DragIcon } from "@components/Common/Icons/Icons";
import React, { useRef, useState } from "react";
import { Form } from "react-bootstrap";
import styles from "./SettingDropdown.module.scss";
import useTranslation from "next-translate/useTranslation";

interface ListType {
  id: number;
  name: string;
  check: boolean;
}

const SettingDropdown = () => {
  const { t } = useTranslation("patient");
  const [list, setList] = useState([
    { id: 1, name: "Patient", check: false },
    { id: 2, name: "Doctor", check: false },
    { id: 3, name: "Contact", check: false },
    { id: 4, name: "Last update", check: false },
    { id: 5, name: "Status", check: false },
    { id: 6, name: "Diagnosis", check: false },
    { id: 7, name: "Date of Birth", check: false },
    { id: 8, name: "Food log", check: false },
    { id: 9, name: "Chat active", check: false },
    { id: 10, name: "E.score", check: false },
    { id: 11, name: "Band active", check: false },
    { id: 12, name: "CGM", check: false },
    { id: 13, name: "Weigh", check: false },
  ]);

  const [allChecked, setAllChecked] = useState(false);
  const [checkedNumber, setCheckedNumber] = useState(0);

  const handleCheckedNumber = (obj: Array<ListType>) => {
    const number = obj.reduce((acc, curr) => {
      if (curr.check == true) {
        acc++;
      }
      return acc;
    }, 0);
    setCheckedNumber(number);
  };

  const renderSelectBox = (data: ListType, index: number) => {
    return (
      <div
        className={styles.selectBox}
        key={data.id}
        onDragStart={(e) => dragStart(e, index)}
        onDragEnter={(e) => dragEnter(e, index)}
        onDragEnd={drop}
        onDragOver={(e) => e.preventDefault()}
        draggable
      >
        <div className={styles.selectTxtWrap}>
          <Form.Check
            type="checkbox"
            id="1"
            label={data.name}
            checked={data.check}
            onChange={() => {
              const objIndex = list.findIndex((obj) => obj.id == data.id);
              const newObj = [...list];
              newObj[objIndex].check = !newObj[objIndex].check;
              setList(newObj);
              handleCheckedNumber(newObj);
            }}
          />
        </div>
        <div className={styles.dragIcon}>
          <DragIcon />
        </div>
      </div>
    );
  };

  // Drag and Drop

  const dragItem = useRef();
  const dragOverItem = useRef();

  const dragStart = (
    e: React.DragEvent<HTMLDivElement>,
    position: number | undefined
  ) => {
    dragItem.current = position;
  };

  const dragEnter = (
    e: React.DragEvent<HTMLDivElement>,
    position: number | undefined
  ) => {
    dragOverItem.current = position;
  };

  const drop = (e: any) => {
    const copyListItems = [...list];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setList(copyListItems);
  };

  return (
    <div className={styles.settingWrap}>
      <div className={styles.clearAllWrap}>
        <div className={styles.clearAll}>
          <Form.Check
            type="checkbox"
            id="1"
            label={`${checkedNumber} ${t("items_selected")}`}
            checked={allChecked}
            onChange={() => {
              const newObj = list.map((data) => {
                if (!allChecked) {
                  return { ...data, check: true };
                } else {
                  return { ...data, check: false };
                }
              });
              setList(newObj);
              setAllChecked(!allChecked);
              handleCheckedNumber(newObj);
            }}
          />
        </div>
        <span
          className={styles.clearAllTxt}
          onClick={() => {
            const newObj = list.map((data) => {
              return { ...data, check: false };
            });
            setList(newObj);
            setAllChecked(false);
            handleCheckedNumber(newObj);
          }}
        >
          {t("clear_all")}
        </span>
      </div>

      <div className={styles.selectBoxWrap}>{list.map(renderSelectBox)}</div>

      <div className={styles.applyButton}>
        <button type="button" className="btn filled me-3">
          {t("apply")}
        </button>
        <button type="button" className="btn outline">
          {t("cancel")}
        </button>
      </div>
    </div>
  );
};

export default SettingDropdown;
