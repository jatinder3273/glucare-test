import React, { useState } from "react";
import { Accordion, Col, Form, Row } from "react-bootstrap";
import styles from "./LabTestDetailGraph.module.scss";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function TestDetailGraph() {
  const HBA1c = {
    title: {
      text: "HBA1c",
      align: "left",
    },

    series: [
      {
        data: [0, 1.5, 3, 2, 3, 1],
        lineWidth: 1,
        color: "#18338C",
        marker: {
          radius: 2,
        },
      },
    ],
    xAxis: {
      gridLineWidth: 1,
      categories: [
        "25/04/22",
        "25/04/22",
        "25/04/22",
        "25/04/22",
        "25/04/22",
        "25/04/22",
        "25/04/22",
      ],
      labels: {
        align: "left",
      },
      alignTicks: false,
    },
    yAxis: {
      gridLineWidth: 1,
      title: {
        text: "",
      },
      rangeDescription: "hello",
      categories: ["0", "10", "20", "30", "40", "50", "60"],
    },
    legend: false,
  };
  const bloodGlucose = {
    title: {
      text: "Blood glucose",
      align: "left",
    },

    series: [
      {
        data: [0, 2, 4, 3, 1, 1, 2],
        lineWidth: 1,
        color: "#18338C",
        marker: {
          radius: 2,
        },
      },
    ],
    xAxis: {
      gridLineWidth: 1,
      categories: [
        "25/04/22",
        "26/04/22",
        "27/04/22",
        "28/04/22",
        "29/04/22",
        "30/04/22",
        "01/05/22",
      ],
      labels: {
        align: "left",
      },
      alignTicks: false,
    },
    yAxis: {
      gridLineWidth: 1,
      title: {
        text: "",
      },
      rangeDescription: "hello",
      categories: ["0", "10", "20", "30", "40", "50", "60"],
    },
    legend: false,
  };
  return (
    <div className={styles.labGraph}>
      <div className={styles.labGraph_sidebar}>
        <div className={styles.labGraph_sidebarData}>
          <Accordion defaultActiveKey={["0", "1", "2"]} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Glucose</Accordion.Header>
              <Accordion.Body>
                <Form.Check type="checkbox" id={"Glucose1"} label="HBA1c" />
                <Form.Check
                  type="checkbox"
                  id={"Glucose2"}
                  label="Blood glucose"
                />
                <Form.Check
                  type="checkbox"
                  id={"Glucose3"}
                  label="Time in range"
                />
                <Form.Check
                  type="checkbox"
                  id={"Glucose4"}
                  label="Fructosamine"
                />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Lipids:</Accordion.Header>
              <Accordion.Body>
                <Form.Check type="checkbox" id={"Lipids1"} label="LDL" />
                <Form.Check type="checkbox" id={"Lipids2"} label="HDL" />
                <Form.Check
                  type="checkbox"
                  id={"Lipids3"}
                  label="Total cholesterol"
                />
                <Form.Check
                  type="checkbox"
                  id={"Lipids4"}
                  label="Cholesterol/HDL"
                />
                <Form.Check type="checkbox" id={"Lipids5"} label="Ratio" />
                <Form.Check
                  type="checkbox"
                  id={"Lipids6"}
                  label="Tryglycerids"
                />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Weight:</Accordion.Header>
              <Accordion.Body>
                <Form.Check type="checkbox" id={"Lipids1"} label="LDL" />
                <Form.Check type="checkbox" id={"Lipids2"} label="HDL" />
                <Form.Check
                  type="checkbox"
                  id={"Lipids3"}
                  label="Total cholesterol"
                />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
      <div className={styles.labGraph_wrapper}>
        <div className={styles.labGraph_single}>
          <HighchartsReact
            highcharts={Highcharts}
            options={HBA1c}
            color="#18338C"
          />
        </div>
        <div className={styles.labGraph_single}>
          <HighchartsReact
            highcharts={Highcharts}
            options={bloodGlucose}
            visible={false}
            color="#18338C"
          />
        </div>
      </div>
    </div>
  );
}

export default TestDetailGraph;
