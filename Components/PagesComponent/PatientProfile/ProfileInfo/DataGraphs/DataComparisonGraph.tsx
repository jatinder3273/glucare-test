/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import React, { useEffect, useState } from "react";
import ModalLayout from "@components/Layouts/ModalLayout";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { AppDispatch } from "redux/store";
import { Form } from "react-bootstrap";
import CalendarRangeFilter from "../../CalendarRangeFilter";
import styles from "./DataComparisonGraph.module.scss";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { addDays, subDays } from "date-fns";
import WeightGraph from "./WeightGraph";
import { patient_weight } from "redux/Patient/action";
import HeartRateGraph from "./HeartRateGraph";
import InsulinGraph from "./InsulinGraph";
import { useToggle } from "rooks";
import BloodPressure from "./BloodPressure";
import GlucoseGraph from "./GlucoseGraph";

interface objectType {
  startDate: Date;
  endDate: Date;
  key: string;
}

const DataComparisonGraph = () => {
  const todayDate = moment().format("D MMM YYYY");
  const prev3DaysDateToToday = `${moment()
    .subtract(3, "days")
    .format("D MMM YYYY")} - ${todayDate}`;
  const prev7DaysDateToToday = `${moment()
    .subtract(7, "days")
    .format("D MMM YYYY")} - ${todayDate}`;
  const dispatch = useDispatch<AppDispatch>();
  const [calendarModal, setCalendarModal] = useState(false);
  const [weightToggle, setWeightToggle] = useToggle(true);
  const [glucoseToggle, setGlucoseToggle] = useToggle(true);
  const [bloodPressureToggle, setBloodPressureToggle] = useToggle(true);
  const [heartRateToggle, setHeartRateToggle] = useToggle(true);
  const [insulinToggle, setInsulinToggle] = useToggle(true);
  const [selectedDate, setSelectedDate] = useState("1d");
  const [filteredDate, setFilteredDate] = useState<string>(todayDate);
  const [dateRange, setDateRange] = useState<{
    start_datetime: string;
    end_datetime: string;
  }>({ start_datetime: "", end_datetime: "" });

  const [rangeSelectedDate, setRangeSelectedDate] = useState<objectType[]>([
    {
      startDate: subDays(new Date(), 7),
      endDate: addDays(new Date(), 0),
      key: "selection",
    },
  ]);
  const [updateSelectedDate, setUpdateSelectedDate] =
    useState<string>(prev7DaysDateToToday);

  const dateRangeSelectedStart = moment(rangeSelectedDate[0].startDate);
  const dateRangeSelectedEnd = moment(rangeSelectedDate[0].endDate);

  const customDateString = () => {
    setDateRange({
      start_datetime: dateRangeSelectedStart.format("YYYY-MM-DD"),
      end_datetime: dateRangeSelectedEnd.format("YYYY-MM-DD"),
    });
    let date = "";
    if (dateRangeSelectedStart !== dateRangeSelectedEnd) {
      date =
        dateRangeSelectedStart.format("D MMM YYYY").toString() +
        " - " +
        dateRangeSelectedEnd.format("D MMM YYYY").toString();
    } else {
      date = dateRangeSelectedStart.format("D MMM YYYY").toString();
    }
    setUpdateSelectedDate(date);
    setFilteredDate(date);
    let params = {
      user: localStorage.getItem("userId"),
      annotation: 2,
      annotation_in_period: 1,
    };
    if (selectedDate === "custom") {
      params.start_datetime = dateRangeSelectedStart.format("YYYY-MM-DD");
      params.end_datetime = dateRangeSelectedEnd.format("YYYY-MM-DD");
      const dayDiff = dateRangeSelectedEnd.diff(dateRangeSelectedStart, "days");
      if (dayDiff > 3 && dayDiff <= 30) {
        params.period = "2";
      } else if (dayDiff > 30) {
        params.period = "1";
      } else if (dayDiff <= 3) {
        params.period = "3";
      }
      setDateRange({
        start_datetime: dateRangeSelectedStart.format("YYYY-MM-DD"),
        end_datetime: dateRangeSelectedEnd.format("YYYY-MM-DD"),
      });
      dispatch(patient_weight(params));
    }
  };

  const toggleCalendarModal = () => {
    setCalendarModal(!calendarModal);
  };

  const onChangeDays = (event) => {
    setSelectedDate(event.target.value);
  };

  useEffect(() => {
    let params = {
      user: localStorage.getItem("userId"),
      annotation: 2,
      annotation_in_period: 1,
    };
    if (selectedDate === "1d") {
      params.period = "3";
      params.start_datetime = moment().subtract(1, "day").format("YYYY-MM-DD");
      params.end_datetime = moment().format("YYYY-MM-DD");
      setFilteredDate(todayDate);
      setDateRange({
        start_datetime: moment().subtract(1, "day").format("YYYY-MM-DD"),
        end_datetime: moment().format("YYYY-MM-DD"),
      });
      dispatch(patient_weight(params));
    } else if (selectedDate === "3d") {
      params.period = "3";
      params.start_datetime = moment().subtract(3, "day").format("YYYY-MM-DD");
      params.end_datetime = moment().format("YYYY-MM-DD");
      setDateRange({
        start_datetime: moment().subtract(3, "day").format("YYYY-MM-DD"),
        end_datetime: moment().format("YYYY-MM-DD"),
      });
      setFilteredDate(prev3DaysDateToToday);
      dispatch(patient_weight(params));
    } else if (selectedDate === "7d") {
      params.period = "2";
      params.start_datetime = moment().subtract(7, "day").format("YYYY-MM-DD");
      params.end_datetime = moment().format("YYYY-MM-DD");
      setDateRange({
        start_datetime: moment().subtract(7, "day").format("YYYY-MM-DD"),
        end_datetime: moment().format("YYYY-MM-DD"),
      });
      setFilteredDate(prev7DaysDateToToday);
      dispatch(patient_weight(params));
    }
  }, [selectedDate]);

  useEffect(() => {
    setDateRange({
      start_datetime: dateRangeSelectedStart.format("YYYY-MM-DD"),
      end_datetime: dateRangeSelectedEnd.format("YYYY-MM-DD"),
    });
  }, []);

  const Glucose = {
    title: {
      text: "",
    },
    chart: {
      height: 160,
      type: "line",
    },

    series: [
      {
        data: [0, 1.5, 1.5, 2, 1.5, 1],
        lineWidth: 3,
        color: "#1CAEC9",
        marker: {
          radius: 4,
          fillColor: "#FBA521",
        },
      },
    ],
    xAxis: {
      categories: ["", "", "", "", "", "", ""],
      labels: {
        align: "left",
      },
      alignTicks: false,
    },
    yAxis: {
      plotBands: [
        {
          color: "#f6fcfa",
          from: 0,
          to: 2,
        },
      ],
      opposite: true,
      title: {
        text: "",
      },
      categories: ["50", "75", "100"],
    },
    plotOptions: {
      line: {
        dashStyle: "Dot",
      },
    },
    legend: false,
  };

  return (
    <div className={`theme_border ${styles.dataComparison}`}>
      <div className={styles.dataComparison_header}>
        <h5>Data comparison</h5>
        <div className={styles.dataComparison_btnWrap}>
          <div className="theme_radio_select" onChange={onChangeDays}>
            <div className={styles.radioSelectBtn}>
              <input type="radio" name="days" value="custom" id="custom" />
              <label htmlFor="custom" onClick={toggleCalendarModal}>
                Custom
              </label>
            </div>
            <div className={styles.radioSelectBtn}>
              <input
                type="radio"
                name="days"
                value="1d"
                id="1d"
                defaultChecked
              />
              <label htmlFor="1d">1d</label>
            </div>
            <div className={styles.radioSelectBtn}>
              <input type="radio" name="days" value="3d" id="3d" />
              <label htmlFor="3d">3d</label>
            </div>
            <div className={styles.radioSelectBtn}>
              <input type="radio" name="days" value="7d" id="7d" />
              <label htmlFor="7d">7d</label>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.dataComparison_date}>
        <span>{filteredDate}</span>
      </div>
      <div className={styles.labGraph_single}>
        <div className={styles.switchGraphBtn}>
          <Form.Check
            onChange={setBloodPressureToggle}
            type="switch"
            id="blood-pressure"
            label="Blood pressure,  mm/Hg"
            className="formSwitch"
            defaultChecked
          />
        </div>
        {bloodPressureToggle ? (
          <BloodPressure
            selectedDate={selectedDate}
            dateRange={dateRange}
            rangeSelectedDate={rangeSelectedDate}
          />
        ) : (
          ""
        )}
      </div>
      <div className={styles.labGraph_single}>
        <div className={styles.switchGraphBtn}>
          <Form.Check
            onChange={setGlucoseToggle}
            type="switch"
            id="glucose"
            label="Glucose, mg/dL"
            className="formSwitch"
            defaultChecked
          />
        </div>
        {glucoseToggle ? (
          <GlucoseGraph
            selectedDate={selectedDate}
            dateRange={dateRange}
            rangeSelectedDate={rangeSelectedDate}
          />
        ) : (
          ""
        )}
      </div>
      <div className={styles.labGraph_single}>
        <div className={styles.switchGraphBtn}>
          <Form.Check
            onChange={setWeightToggle}
            type="switch"
            id="weight"
            label="Weight, kg"
            className="formSwitch"
            defaultChecked
          />
        </div>
        {weightToggle ? (
          <WeightGraph selectedDate={selectedDate} dateRange={dateRange} />
        ) : (
          ""
        )}
      </div>
      <div className={styles.labGraph_single}>
        <div className={styles.switchGraphBtn}>
          <Form.Check
            onChange={setHeartRateToggle}
            type="switch"
            id="heart-rate"
            label="Heart Rate, BPM"
            className="formSwitch"
            defaultChecked
          />
        </div>
        {heartRateToggle ? (
          <HeartRateGraph
            selectedDate={selectedDate}
            dateRange={dateRange}
            rangeSelectedDate={rangeSelectedDate}
          />
        ) : (
          ""
        )}
      </div>
      <div className={styles.labGraph_single}>
        <div className={styles.switchGraphBtn}>
          <Form.Check
            onChange={setInsulinToggle}
            type="switch"
            id="insulin"
            label="Insulin, u"
            className="formSwitch"
            defaultChecked
          />
        </div>
        {insulinToggle ? (
          <InsulinGraph
            selectedDate={selectedDate}
            dateRange={dateRange}
            rangeSelectedDate={rangeSelectedDate}
          />
        ) : (
          ""
        )}
      </div>
      <ModalLayout
        openModal={calendarModal}
        toggleModal={toggleCalendarModal}
        title="Select date"
        isCalendarPopup
      >
        <CalendarRangeFilter
          state={rangeSelectedDate}
          setState={setRangeSelectedDate}
          disableFuture={moment().toDate()}
        />
        <div className="py-4">
          <button
            type="button"
            className="btn filled me-3"
            onClick={() => {
              toggleCalendarModal();
              customDateString();
            }}
          >
            Apply
          </button>
          <button
            type="button"
            className="btn outline"
            onClick={toggleCalendarModal}
          >
            Cancel
          </button>
        </div>
      </ModalLayout>
    </div>
  );
};

export default DataComparisonGraph;
