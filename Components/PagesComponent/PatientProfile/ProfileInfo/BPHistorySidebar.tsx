import React from "react";
import styles from "./HistorySidebar.module.scss";

function BloodPressureHistory() {
  const readingValues = [
    {
      time: "10:32am",
      value: "120/80",
    },
    {
      time: "06:32am",
      value: "120/80",
    },
    {
      time: "11:03am",
      value: "140/80",
    },
  ];
  const singleDay = [
    {
      date: "9 Mar, 2022",
      readings: readingValues,
    },
    {
      date: "8 Mar, 2022",
      readings: readingValues,
    },
    {
      date: "7 Mar, 2022",
      readings: readingValues,
    },
    {
      date: "6 Mar, 2022",
      readings: readingValues,
    },
    {
      date: "5 Mar, 2022",
      readings: readingValues,
    },
  ];
  return (
    <div className={styles.historyTables}>
      <div className={styles.historyTables_head}>
        <div className={styles.historyTables_column}>
          <span>Date</span>
        </div>
        <div className={styles.historyTables_column}>
          <span>
            Blood Pressure <b>mm/Hg</b>
          </span>
        </div>
      </div>
      {singleDay.map((day, index) => (
        <div className={styles.historyTables_day} key={index}>
          <div className={styles.historyTables_date}>{day.date}</div>
          {day.readings.map((reading: any, j) => (
            <div className={styles.historyTables_time} key={j}>
              <div className={styles.historyTables_column}>
                <span>{reading.time}</span>
              </div>
              <div className={styles.historyTables_column}>
                <span>{reading.value}</span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default BloodPressureHistory;
