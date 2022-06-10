import React, { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import moment from "moment";
import { patientInsulin } from "redux/Patient/action";
import { AppDispatch } from "redux/store";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
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
const InsulinGraph = ({
  selectedDate,
  dateRange,
  rangeSelectedDate,
}: IProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const insulinData = useSelector((state: any) => state.patient.insulinData);
  const [xAxisValues, setXAxisValues] = useState<number[]>([]);
  const [xAxisLabel, setXAxisLabel] = useState<string[]>([]);
  const [allData, setAllData] = useState<IInsulinData[]>([]);
  const dateRangeSelectedStart = moment(rangeSelectedDate[0].startDate);
  const dateRangeSelectedEnd = moment(rangeSelectedDate[0].endDate);
  useEffect(() => {
    let params: any = {
      period: "",
      user: localStorage.getItem("userId"),
      annotation: 1,
      annotation_in_period: 2,
    };

    if (selectedDate === "1d") {
      params.period = "3";
      params.start_datetime = moment().subtract(1, "day").format("YYYY-MM-DD");
      params.end_datetime = moment().format("YYYY-MM-DD");

      dispatch(patientInsulin(params));
    } else if (selectedDate === "3d") {
      params.period = "3";
      params.start_datetime = moment().subtract(3, "day").format("YYYY-MM-DD");
      params.end_datetime = moment().format("YYYY-MM-DD");
      dispatch(patientInsulin(params));
    } else if (selectedDate === "7d") {
      params.period = "2";
      params.start_datetime = moment().subtract(7, "day").format("YYYY-MM-DD");
      params.end_datetime = moment().format("YYYY-MM-DD");
      dispatch(patientInsulin(params));
    }
  }, [dispatch, selectedDate]);

  useEffect(() => {
    let params: any = {
      period: "",
      user: localStorage.getItem("userId"),
      annotation: 1,
      annotation_in_period: 2,
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
      dispatch(patientInsulin(params));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, selectedDate, dateRange]);

  useEffect(() => {
    const insulins = _.sortBy(insulinData?.items || [], ["recorded_at"]);

    setAllData([...insulins]);
    if (insulins != undefined) {
      let valueArr: number[] = [];
      let dateArr: string[] = [];
      insulins.map((data) => {
        valueArr.push(parseFloat(data.value));
        if (selectedDate === "1d") {
          dateArr.push(moment(data.recorded_at).format("h:mm A"));
        } else {
          dateArr.push(moment(data.recorded_at).format("lll"));
        }
      });

      setXAxisValues(valueArr);
      setXAxisLabel(dateArr);
    }
  }, [insulinData, selectedDate]);
  const heartRate = {
    title: {
      text: "",
    },
    chart: {
      height: 400,
      type: "line",
    },

    series: [
      {
        name: "insulin",
        data: xAxisValues,
        lineWidth: 1,
        color: "#18338C",
        marker: {
          radius: 2,
        },
        rows: 3,
      },
    ],
    xAxis: {
      gridLineWidth: 1,
      tickInterval: selectedDate === "1d" ? 1 : selectedDate === "3d" ? 3 : 1,
      categories: xAxisLabel,
      labels: {
        align: "center",
      },
      alignTicks: false,
    },
    yAxis: {
      min: Math.min(...xAxisValues),
      max: Math.max(...xAxisValues) + 1,
      tickInterval: 10,
      startOnTick: false,
      endOnTick: false,
      alignTicks: false,
      categories: [""],
      plotBands: [
        {
          color: "#f6fcfa",
          from: 20,
          to: 1,
        },
      ],
      opposite: true,
      tickLength: 0,
      gridLineWidth: 1,
      title: {
        text: "",
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
      headerFormat: '<table><tr><th colspan="2">{point.key}</th></tr>',
      pointFormat:
        '<tr><td style="color: {series.color}">Insulin </td>' +
        '<td style="text-align: right"><b>{point.y} u</b></td></tr>',
      footerFormat: "</table>",
      valueDecimals: 2,
    },
    legend: false,
  };
  return (
    <div>
      {allData && allData.length > 0 ? (
        <HighchartsReact
          highcharts={Highcharts}
          options={heartRate}
          color="#18338C"
        />
      ) : (
        "No Record Found"
      )}
    </div>
  );
};

export default InsulinGraph;
