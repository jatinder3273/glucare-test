import React, { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import moment from "moment";
import {
  getFoodLogGraph,
  getGlucoseGraph,
  patientInsulin,
} from "redux/Patient/action";
import { AppDispatch } from "redux/store";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import styles from "./DataComparisonGraph.module.scss";
import FoodIcon from "@assets/FoodIcon.png";
import Image from "next/image";
interface objectType {
  startDate: Date;
  endDate: Date;
  key: string;
}
interface IProps {
  selectedDate: string;
  dateRange: {
    start_datetime: string;
    end_datetime: string;
  };
  rangeSelectedDate: objectType[];
}
interface IInsulinData {
  recorded_at: string;
  value: number;
}
const GlucoseGraph = ({
  selectedDate,
  dateRange,
  rangeSelectedDate,
}: IProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { glucoseData, insulinData, foodLogData } = useSelector(
    (state: any) => state.patient
  );
  const [xAxisValueInsulin, setXAxisValueInsulin] = useState<number[]>([]);
  const [xAxisValueGlucose, setXAxisValueGlucose] = useState<number[]>([]);
  const [xAxisValueFoodLog, setXAxisValueFoodLog] = useState<number[]>([]);
  const dateRangeSelectedStart = moment(rangeSelectedDate[0].startDate);
  const dateRangeSelectedEnd = moment(rangeSelectedDate[0].endDate);

  useEffect(() => {
    let foodParams: any = {
      user: localStorage.getItem("userId"),
    };
    let glucoseParams: any = {
      period: "",
      user: localStorage.getItem("userId"),
      annotation: 2,
      annotation_in_period: 3,
    };
    let insulinParams: any = {
      period: "",
      user: localStorage.getItem("userId"),
      annotation: 1,
      annotation_in_period: 2,
    };
    if (selectedDate === "1d") {
      foodParams.start_datetime = moment()
        .subtract(1, "day")
        .format("YYYY-MM-DD");
      foodParams.end_datetime = moment().format("YYYY-MM-DD");
      insulinParams.period = "3";
      glucoseParams.period = "3";
      glucoseParams.start_datetime = moment()
        .subtract(1, "day")
        .format("YYYY-MM-DD");
      glucoseParams.end_datetime = moment().format("YYYY-MM-DD");
      insulinParams.start_datetime = moment()
        .subtract(1, "day")
        .format("YYYY-MM-DD");
      insulinParams.end_datetime = moment().format("YYYY-MM-DD");

      dispatch(getFoodLogGraph(foodParams));
      dispatch(getGlucoseGraph(glucoseParams));
      dispatch(patientInsulin(insulinParams));
    } else if (selectedDate === "3d") {
      foodParams.start_datetime = moment()
        .subtract(3, "day")
        .format("YYYY-MM-DD");
      foodParams.end_datetime = moment().format("YYYY-MM-DD");
      glucoseParams.period = "3";
      insulinParams.period = "3";
      glucoseParams.start_datetime = moment()
        .subtract(3, "day")
        .format("YYYY-MM-DD");
      glucoseParams.end_datetime = moment().format("YYYY-MM-DD");
      insulinParams.start_datetime = moment()
        .subtract(3, "day")
        .format("YYYY-MM-DD");
      insulinParams.end_datetime = moment().format("YYYY-MM-DD");
      dispatch(getFoodLogGraph(foodParams));
      dispatch(getGlucoseGraph(glucoseParams));
      dispatch(patientInsulin(insulinParams));
    } else if (selectedDate === "7d") {
      foodParams.start_datetime = moment()
        .subtract(7, "day")
        .format("YYYY-MM-DD");
      foodParams.end_datetime = moment().format("YYYY-MM-DD");
      glucoseParams.period = "2";
      insulinParams.period = "2";
      glucoseParams.start_datetime = moment()
        .subtract(7, "day")
        .format("YYYY-MM-DD");
      glucoseParams.end_datetime = moment().format("YYYY-MM-DD");
      insulinParams.start_datetime = moment()
        .subtract(7, "day")
        .format("YYYY-MM-DD");
      insulinParams.end_datetime = moment().format("YYYY-MM-DD");
      dispatch(getFoodLogGraph(foodParams));
      dispatch(getGlucoseGraph(glucoseParams));
      dispatch(patientInsulin(insulinParams));
    }
  }, [dispatch, selectedDate]);

  useEffect(() => {
    let foodParams: any = {
      period: "",
      user: localStorage.getItem("userId"),
      annotation: 3,
      annotation_in_period: 1,
    };
    let glucoseParams: any = {
      period: "",
      user: localStorage.getItem("userId"),
      annotation: 2,
      annotation_in_period: 3,
    };
    let insulinParams: any = {
      period: "",
      user: localStorage.getItem("userId"),
      annotation: 1,
      annotation_in_period: 2,
    };
    if (selectedDate === "custom") {
      insulinParams.period = "3";
      insulinParams.start_datetime =
        dateRangeSelectedStart.format("YYYY-MM-DD");
      insulinParams.end_datetime = dateRangeSelectedEnd.format("YYYY-MM-DD");
      foodParams.start_datetime = dateRangeSelectedStart.format("YYYY-MM-DD");
      foodParams.end_datetime = dateRangeSelectedEnd.format("YYYY-MM-DD");
      glucoseParams.period = "3";
      glucoseParams.start_datetime =
        dateRangeSelectedStart.format("YYYY-MM-DD");
      glucoseParams.end_datetime = dateRangeSelectedEnd.format("YYYY-MM-DD");
      const dayDiff = dateRangeSelectedEnd.diff(dateRangeSelectedStart, "days");
      if (dayDiff > 3 && dayDiff <= 30) {
        insulinParams.period = "2";
        glucoseParams.period = "2";
      } else if (dayDiff > 30) {
        insulinParams.period = "1";
        glucoseParams.period = "1";
      } else if (dayDiff <= 3) {
        insulinParams.period = "3";
        glucoseParams.period = "3";
      }
      dispatch(getFoodLogGraph(foodParams));
      dispatch(getGlucoseGraph(glucoseParams));
      dispatch(patientInsulin(insulinParams));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, selectedDate, dateRange]);

  useEffect(() => {
    const insulin = _.sortBy(insulinData?.items || [], ["recorded_at"]);

    if (insulin != undefined) {
      let valueArrInsulin: number[] = [];
      let dateArr: string[] = [];
      insulin.map((data) => {
        valueArrInsulin.push(parseFloat(data.value));
        if (selectedDate === "1d") {
          dateArr.push(moment(data.recorded_at).format("h:mm A"));
        } else {
          dateArr.push(moment(data.recorded_at).format("lll"));
        }
      });
      setXAxisValueInsulin(valueArrInsulin);
    }
  }, [insulinData, selectedDate]);
  useEffect(() => {
    const glucose = _.sortBy(glucoseData?.items || [], ["recorded_at"]);

    if (glucose != undefined) {
      let valueArrGlucose: number[] = [];
      let dateArr: string[] = [];
      glucose.map((data) => {
        valueArrGlucose.push(parseFloat(data.value));
        if (selectedDate === "1d") {
          dateArr.push(moment(data.recorded_at).format("h:mm A"));
        } else {
          dateArr.push(moment(data.recorded_at).format("lll"));
        }
      });
      setXAxisValueGlucose(valueArrGlucose);
    }
  }, [glucoseData, selectedDate]);
  useEffect(() => {
    const foodLog = _.sortBy(foodLogData || [], ["recorded_at"]);

    if (foodLog != undefined) {
      let valueArrFoodLog: number[] = [];
      let dateArr: string[] = [];
      foodLog.map((data) => {
        valueArrFoodLog.push(0);
        if (selectedDate === "1d") {
          dateArr.push(moment(data.recorded_at).format("h:mm A"));
        } else {
          dateArr.push(moment(data.recorded_at).format("lll"));
        }
      });
      setXAxisValueFoodLog(valueArrFoodLog);
    }
  }, [foodLogData, selectedDate]);

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
        name: "Insulin",
        data: xAxisValueInsulin,
        lineWidth: 3,
        color: "transparent",
        marker: {
          radius: 4,
          fillColor: "#FBA521",
        },
      },
      {
        name: "Glucose",
        data: xAxisValueGlucose,
        lineWidth: 3,
        color: "#1CAEC9",
        marker: {
          radius: 4,
          fillColor: "#41C3D8",
        },
      },
      {
        name: "FoodLog",
        data: xAxisValueFoodLog,
        lineWidth: 3,
        color: "transparent",
        marker: {
          lineColor: null,
          symbol:
            "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiByeD0iOCIgZmlsbD0iIzAwODM1QyIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPHBhdGggZD0iTTQuOTEzMTUgMTIuMjkyOEM0LjcxODM0IDEyLjQ4NzQgNC40MDI2OCAxMi40ODc0IDQuMjA3OTcgMTIuMjkyN0M0LjAxMzI2IDEyLjA5NzkgNC4wMTMxOCAxMS43ODIzIDQuMjA3NzkgMTEuNTg3NUw4LjY4MDQ3IDcuMTEwMTZMOC41ODA0NyA3LjAwMDE2QzguNDg3OCA2LjkwODE0IDguNDE0MjUgNi43OTg2OSA4LjM2NDA2IDYuNjc4MTJDOC4zMTM4NyA2LjU1NzU2IDguMjg4MDMgNi40MjgyNSA4LjI4ODAzIDYuMjk3NjZDOC4yODgwMyA2LjE2NzA2IDguMzEzODcgNi4wMzc3NSA4LjM2NDA2IDUuOTE3MTlDOC40MTQyNSA1Ljc5NjYyIDguNDg3OCA1LjY4NzE4IDguNTgwNDcgNS41OTUxNkwxMC41MjA1IDMuNjQxNzFDMTAuNjQ3NiAzLjUxMzc1IDEwLjg1NDMgMy41MTI4NCAxMC45ODI1IDMuNjM5NjZDMTEuMTExMSAzLjc2Njg3IDExLjExMTkgMy45NzQzMiAxMC45ODQ0IDQuMTAyNjJMOS41OTU0NyA1LjUwMDE2TDEwLjA3NTUgNS45NzAxNkwxMS40NjU4IDQuNTc1NTFDMTEuNTkyNiA0LjQ0ODM1IDExLjc5ODUgNC40NDgxOSAxMS45MjU1IDQuNTc1MTZDMTIuMDUyNCA0LjcwMjEyIDEyLjA1MjMgNC45MDgwMyAxMS45MjUxIDUuMDM0OEwxMC41MzA1IDYuNDI1MTZMMTEuMDAwNSA2LjkwNTE2TDEyLjM5NTcgNS41MTQyM0MxMi41MjUgNS4zODUzMSAxMi43MzQ2IDUuMzg2NTkgMTIuODYyNCA1LjUxNzFDMTIuOTg4NiA1LjY0NjA5IDEyLjk4NzEgNS44NTI3NyAxMi44NTkxIDUuOTc5OTVMMTAuOTA1NSA3LjkyMDE2QzEwLjUxNTUgOC4zMTAxNiA5Ljg4NTQ3IDguMzEwMTYgOS41MDA0NyA3LjkyMDE2TDkuMzkwNDcgNy44MjAxNkw0LjkxMzE1IDEyLjI5MjhaIiBmaWxsPSIjMjFCMDg5Ii8+Cjwvc3ZnPgo=)",
        },
        tooltip: {
          pointFormatter: function () {
            return "";
          },
        },
      },
    ],
    xAxis: {
      categories: [],
      labels: {
        align: "left",
        enabled: false,
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
  const allData = [
    ...xAxisValueInsulin,
    ...xAxisValueGlucose,
    ...xAxisValueFoodLog,
  ];
  return (
    <div>
      {allData && allData.length > 0 ? (
        <>
          <HighchartsReact
            highcharts={Highcharts}
            options={Glucose}
            color="#18338C"
          />
          <div className={styles.lineDetail}>
            <div className={styles.lineDetail_single}>
              <span style={{ backgroundColor: "#FBA521" }} />
              Insulin
            </div>
            <div className={styles.lineDetail_single}>
              <span style={{ backgroundColor: "#41C3D8" }} />
              Glucose
            </div>
            <div className={styles.lineDetail_single}>
              <Image src={FoodIcon} alt="Food Log" />
              Food log
            </div>
          </div>
        </>
      ) : (
        "No Record Found"
      )}
    </div>
  );
};

export default GlucoseGraph;
