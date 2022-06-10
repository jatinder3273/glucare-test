import React, { useState } from "react";
import { Form, Image } from "react-bootstrap";
import styles from "./SelectDoctors.module.scss";
import toggleIcon from "../../../../assets/icons/inputToggle.svg";
import { Dropdown } from "react-bootstrap";
import useTranslation from "next-translate/useTranslation";

interface ListType {
  id: number;
  name: string;
  check: boolean;
  img: string;
}

const SelectDoctors = () => {
  const { t } = useTranslation("patient");
  const [list, setList] = useState([
    {
      id: 1,
      name: "Dr. Robert Fox",
      check: false,
      img: "https://randomuser.me/api/portraits/men/82.jpg",
    },
    {
      id: 2,
      name: "Dr. Darlene Robertson",
      check: false,
      img: "https://randomuser.me/api/portraits/men/73.jpg",
    },
    {
      id: 3,
      name: "Dr. Jacob Jones",
      check: false,
      img: "https://randomuser.me/api/portraits/men/7.jpg",
    },
    {
      id: 4,
      name: "Dr. Guy Hawkins",
      check: false,
      img: "https://randomuser.me/api/portraits/men/66.jpg",
    },
    {
      id: 5,
      name: "Dr. Jenny Wilson",
      check: false,
      img: "https://randomuser.me/api/portraits/men/21.jpg",
    },
    {
      id: 6,
      name: "Dr. Courtney Henry",
      check: false,
      img: "https://randomuser.me/api/portraits/men/18.jpg",
    },
    {
      id: 7,
      name: "Dr. Robert Fox",
      check: false,
      img: "https://randomuser.me/api/portraits/men/82.jpg",
    },
    {
      id: 8,
      name: "Dr. Darlene Robertson",
      check: false,
      img: "https://randomuser.me/api/portraits/men/73.jpg",
    },
    {
      id: 9,
      name: "Dr. Jacob Jones",
      check: false,
      img: "https://randomuser.me/api/portraits/men/7.jpg",
    },
    {
      id: 10,
      name: "Dr. Guy Hawkins",
      check: false,
      img: "https://randomuser.me/api/portraits/men/66.jpg",
    },
    {
      id: 11,
      name: "Dr. Jenny Wilson",
      check: false,
      img: "https://randomuser.me/api/portraits/men/21.jpg",
    },
    {
      id: 12,
      name: "Dr. Courtney Henry",
      check: false,
      img: "https://randomuser.me/api/portraits/men/18.jpg",
    },
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

  const renderSelectBox = (data: ListType) => {
    return (
      <div className={styles.selectBox} key={data.id}>
        <div className={styles.selectTxtWrap}>
          <Form.Check
            type="checkbox"
            id="1"
            // label={data.name}
            checked={data.check}
            onChange={() => {
              const objIndex = list.findIndex((obj) => obj.id == data.id);
              const newObj = [...list];
              newObj[objIndex].check = !newObj[objIndex].check;
              setList(newObj);
              handleCheckedNumber(newObj);
            }}
          />
          <div className={styles.selectImage}>
            <Image src={data.img} />
          </div>
          <p className={styles.labelTxt}>{data.name}</p>
        </div>
      </div>
    );
  };

  return (
    <Form.Group controlId="formSecondaryTeam" className={styles.mainWrap}>
      <Dropdown className={styles.select_dropdown} drop="up">
        <Dropdown.Toggle variant="" id="dropdown-basic">
          <div className={styles.firstDiv}>
            <Form.Label>Secondary team</Form.Label>
            <div className={styles.selectWrap}>
              <span
                className={styles.selectPlaceholder}
                style={{
                  display: checkedNumber == 0 ? "block" : "none",
                }}
              >
                Select
              </span>
              <span
                className={styles.selectTxt}
                style={{
                  display: checkedNumber == 0 ? "none" : "block",
                }}
              >
                {checkedNumber} {t("doctors_selected")}
              </span>
              <span className={styles.selectToggle}>
                <Image src={toggleIcon.src} alt={toggleIcon} />
              </span>
            </div>
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu className={styles.select_dropdown_menu} align="end">
          <div className={styles.secondDiv}>
            <div className={styles.selectDoctorsWrap}>
              <div className={styles.clearAllWrap}>
                <div className={styles.clearAll}>
                  <Form.Check
                    type="checkbox"
                    id="1"
                    label={`${checkedNumber} doctors selected`}
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

              <div className={styles.selectBoxWrap}>
                {list.map(renderSelectBox)}
              </div>
            </div>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </Form.Group>
  );
};

export default SelectDoctors;
