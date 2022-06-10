/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { patient_weight } from "redux/Patient/action";
import { AppDispatch } from "redux/store";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import _ from "lodash";

function WeightGraph({ selectedDate, dateRange }) {
  const dispatch = useDispatch<AppDispatch>();
  const weightData = useSelector((state: any) => state.patient.manual_data);
  const [allWeightData, setAllWeightData] = useState([]);
  const [weightValueArray, setWeightValueArray] = useState([]);
  const [weightDateArray, setWeightDateArray] = useState([]);

  useEffect(() => {
    const weight = _.sortBy(weightData.items || [], ["recorded_at"]);

    setAllWeightData([...weight]);
    if (weight != undefined) {
      let valueArr = [];
      let dateArr = [];
      weight.map((data) => {
        valueArr.push(data.value);
        if (selectedDate === "1d") {
          dateArr.push(moment(data.recorded_at).format("h:mm A"));
        } else {
          dateArr.push(moment(data.recorded_at).format("lll"));
        }
      });
      setWeightValueArray(valueArr);
      setWeightDateArray(dateArr);
    }
  }, [weightData]);

  const weight = {
    title: {
      text: "",
    },
    chart: {
      height: 400,
      type: "line",
    },

    series: [
      {
        name: "weight",
        data: weightValueArray,
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
      categories: weightDateArray,
      labels: {
        align: "center",
      },
      alignTicks: false,
    },
    yAxis: {
      min: Math.min(...weightValueArray),
      max: Math.max(...weightValueArray) + 10,
      tickInterval: 20,
      startOnTick: false,
      endOnTick: false,
      alignTicks: false,
      categories: [""],
      plotBands: [
        {
          color: "#f6fcfa",
          from: 55,
          to: 80,
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
        '<tr><td style="color: {series.color}">Weight </td>' +
        '<td style="text-align: right"><b>{point.y} KG</b></td></tr>',
      footerFormat: "</table>",
      valueDecimals: 2,
    },
    legend: false,
  };
  return (
    <div>
      {allWeightData && allWeightData.length > 0 ? (
        <HighchartsReact
          highcharts={Highcharts}
          options={weight}
          color="#18338C"
        />
      ) : (
        "No record found"
      )}
    </div>
  );
}

export default WeightGraph;
