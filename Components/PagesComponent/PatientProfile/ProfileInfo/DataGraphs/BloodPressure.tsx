import React, { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import moment from "moment";
import { getBloodPressureGraph } from "redux/Patient/action";
import { AppDispatch } from "redux/store";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import styles from "./DataComparisonGraph.module.scss";
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
const BloodPressure = ({
  selectedDate,
  dateRange,
  rangeSelectedDate,
}: IProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const bloodPressureData = useSelector(
    (state: any) => state.patient.bloodPressureData
  );
  const [xAxisValuesSystolic, setXAxisValuesSystolic] = useState<number[]>([]);
  const [xAxisValuesDiastolic, setXAxisValuesDiastolic] = useState<number[]>(
    []
  );
  const [xAxisLabel, setXAxisLabel] = useState<string[]>([]);
  const [allData, setAllData] = useState<IInsulinData[]>([]);
  const dateRangeSelectedStart = moment(rangeSelectedDate[0].startDate);
  const dateRangeSelectedEnd = moment(rangeSelectedDate[0].endDate);
  useEffect(() => {
    let params: any = {
      period: "",
      user: localStorage.getItem("userId"),
      annotation: 3,
      annotation_in_period: 1,
    };

    if (selectedDate === "1d") {
      params.period = "3";
      params.start_datetime = moment().subtract(1, "day").format("YYYY-MM-DD");
      params.end_datetime = moment().format("YYYY-MM-DD");

      dispatch(getBloodPressureGraph(params));
    } else if (selectedDate === "3d") {
      params.period = "3";
      params.start_datetime = moment().subtract(3, "day").format("YYYY-MM-DD");
      params.end_datetime = moment().format("YYYY-MM-DD");
      dispatch(getBloodPressureGraph(params));
    } else if (selectedDate === "7d") {
      params.period = "2";
      params.start_datetime = moment().subtract(7, "day").format("YYYY-MM-DD");
      params.end_datetime = moment().format("YYYY-MM-DD");
      dispatch(getBloodPressureGraph(params));
    }
  }, [dispatch, selectedDate]);

  useEffect(() => {
    let params: any = {
      period: "",
      user: localStorage.getItem("userId"),
      annotation: 3,
      annotation_in_period: 1,
    };

    if (selectedDate === "custom") {
      params.period = "3";
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
      dispatch(getBloodPressureGraph(params));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, selectedDate, dateRange]);

  useEffect(() => {
    const bloodPressure = _.sortBy(bloodPressureData?.items || [], [
      "recorded_at",
    ]);

    setAllData([...bloodPressure]);
    if (bloodPressure != undefined) {
      let valueArrSystolic: number[] = [];
      let valueArrDiastolic: number[] = [];
      let dateArr: string[] = [];
      bloodPressure.map((data) => {
        const values = data.value.split("/");
        if (values) {
          valueArrSystolic.push(parseFloat(values[0]));
          valueArrDiastolic.push(parseFloat(values[1]));
        } else {
          valueArrSystolic.push(0);
          valueArrDiastolic.push(0);
        }
        if (selectedDate === "1d") {
          dateArr.push(moment(data.recorded_at).format("h:mm A"));
        } else {
          dateArr.push(moment(data.recorded_at).format("lll"));
        }
      });

      setXAxisValuesSystolic(valueArrSystolic);
      setXAxisValuesDiastolic(valueArrDiastolic);
      setXAxisLabel(dateArr);
    }
  }, [bloodPressureData, selectedDate]);

  const BloodPressureOption = {
    title: {
      text: "",
    },
    chart: {
      height: 160,
      type: "line",
    },

    series: [
      {
        data: xAxisValuesDiastolic,
        lineWidth: 1,
        color: "#18338C",
        marker: {
          radius: 2,
        },
      },
      {
        data: xAxisValuesSystolic,
        lineWidth: 1,
        color: "#1CAEC9",
        marker: {
          radius: 2,
        },
      },
    ],
    xAxis: {
      gridLineWidth: 1,
      categories: ["", "", "", "", "", "", ""],
      labels: {
        align: "left",
      },
      alignTicks: false,
    },
    yAxis: {
      opposite: true,
      tickLength: 0,
      gridLineWidth: 1,
      title: {
        text: "",
      },
      categories: ["50", "75", "100"],
    },
    legend: false,
  };
  return (
    <div>
      {allData && allData.length > 0 ? (
        <>
          <HighchartsReact
            highcharts={Highcharts}
            options={BloodPressureOption}
            color="#18338C"
          />
          <div className={styles.lineDetail}>
            <div className={styles.lineDetail_single}>
              <span style={{ backgroundColor: "#1CAEC9" }} />
              Systolic
            </div>
            <div className={styles.lineDetail_single}>
              <span />
              Diastolic
            </div>
          </div>
        </>
      ) : (
        "No Record Found"
      )}
    </div>
  );
};

export default BloodPressure;
