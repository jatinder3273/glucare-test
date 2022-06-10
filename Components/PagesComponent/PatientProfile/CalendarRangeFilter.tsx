// @ts-nocheck
import React, { useEffect, useState } from "react";
import moment from "moment";
import styles from "./CalendarRangeFilter.module.scss";
import { DateRangePicker } from "react-date-range";

interface objectType {
  startDate: Date;
  endDate: Date;
  key: string;
  disableFuture?: Date;
}
interface IProps {
  state: objectType[];
  setState: any;
}

function CalendarRangeFilter({ state, setState, disableFuture }: IProps) {
  const handleOnChange = (ranges) => {
    const { selection } = ranges;
    setState([selection]);
  };

  return (
    <>
      <div className={styles.calendarModalWrapper}>
        <span className={styles.dateRangeValue}>
          {`${moment(state[0].startDate).format("D MMM YYYY")} - ${moment(
            state[0].endDate
          ).format("D MMM YYYY")}`}
        </span>
        <div className={`theme_dateRangePicker ${styles.dateRangePicker}`}>
          <DateRangePicker
            onChange={handleOnChange}
            // showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={2}
            ranges={state}
            direction="horizontal"
            showMonthAndYearPickers={false}
            fixedHeight={true}
            maxDate={disableFuture}
          />
        </div>
      </div>
    </>
  );
}

export default CalendarRangeFilter;
