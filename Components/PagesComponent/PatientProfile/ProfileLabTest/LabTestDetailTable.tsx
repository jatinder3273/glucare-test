// @ts-nocheck
import React, { useEffect, useState } from "react";
import styles from "./LabTestDetailTable.module.scss";
import { useToggle } from "rooks";
import { GraphIcon, TriangleIcon } from "@components/Common/Icons/Icons";
import { Spinner, Table } from "react-bootstrap";
import moment from "moment";

interface testDataType {
  date: string;
  tests: { fields: {}; id: number; name: string }[];
}

interface tableDataType {
  headerData?: string[];
}

interface IProps {
  testData: testDataType | undefined;
  searchTxt: string;
}

interface IAllTestData {
  [key: string]: {
    [key: string]: { value: number; date: string }[];
  };
}

function TestDetailTable({ testData, searchTxt }: IProps) {
  const [toggleRow, setToggleRow] = useState<string[]>([]);
  const [tableData, setTableData] = useState<tableDataType>({});
  const [searchTableData, setSearchTableData] = useState<tableDataType>({});
  const [headerData, setHeaderData] = useState<string[]>([]);

  useEffect(() => {
    if (testData != undefined) {
      let allTestData: IAllTestData = {};
      let arr: string[] = [];
      testData.map((data: testDataType) => {
        arr.push(moment(data.date).format("D/MM/YY"));
        data.tests.map((fieldsData) => {
          allTestData = {
            ...allTestData,
            [fieldsData.name]: {
              ...allTestData[fieldsData.name],
              ...Object.keys(fieldsData.fields).map((key) => {
                if (allTestData[fieldsData.name] != undefined) {
                  return {
                    [key]: [
                      ...allTestData[fieldsData.name][key],
                      { value: fieldsData.fields[key], date: data.date },
                    ],
                  };
                } else {
                  return {
                    [key]: [{ value: fieldsData.fields[key], date: data.date }],
                  };
                }
              })[0],
            },
          };
        });
      });

      setHeaderData(arr);
      setTableData(allTestData);
      setSearchTableData(allTestData);
    }
  }, [testData]);

  useEffect(() => {
    let allTestData: IAllTestData = {};
    Object.keys(tableData).map((key) => {
      if (key.toLocaleLowerCase().includes(searchTxt.toLocaleLowerCase())) {
        allTestData = { ...allTestData, [key]: tableData[key] };
      }
    });
    setSearchTableData(allTestData);
  }, [searchTxt]);

  return testData != undefined ? (
    testData.length != 0 && Object.keys(searchTableData).length != 0 ? (
      <div className={styles.testDetail_table}>
        {
          <Table>
            <thead>
              <tr>
                <th>
                  Test name <TriangleIcon />
                </th>
                {headerData != undefined &&
                  headerData.map((items, i) => (
                    <th key={i}>
                      {items} <TriangleIcon />
                    </th>
                  ))}
                <th />
              </tr>
            </thead>
            {Object.keys(searchTableData).map((key) => (
              <>
                <tr>
                  <td
                    className={styles.accordion_stripe}
                    colSpan={100}
                    onClick={() => {
                      if (toggleRow?.includes(key)) {
                        setToggleRow(toggleRow.filter((data) => data != key));
                      } else {
                        setToggleRow([...toggleRow, key]);
                      }
                    }}
                  >
                    <span className={styles.accordion_stripe_btn}>
                      <span
                        className={`${styles.icon} ${
                          toggleRow?.includes(key) ? "open" : ""
                        }`}
                      />
                      {key}
                    </span>
                  </td>
                </tr>
                {toggleRow?.includes(key) ? (
                  <tbody>
                    {Object.keys(searchTableData[key]).map(
                      (keyInner, index) => (
                        <tr key={index}>
                          <td>{keyInner}</td>
                          {searchTableData[key][keyInner].map(
                            (item, indexInner) => (
                              <td key={indexInner}>
                                <span
                                // className={`${value.colored ? "coloredValue" : ""}`}
                                >
                                  {item.value != null ? item.value : `--`}
                                </span>
                              </td>
                            )
                          )}
                          <td>
                            <GraphIcon />
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                ) : null}
              </>
            ))}
          </Table>
        }
      </div>
    ) : (
      <h5 className={styles.ceterData}>No Data Found</h5>
    )
  ) : (
    <div className={styles.ceterData}>
      <Spinner animation="border" role="status">
        <span className="visually-hidden text-center">Loading...</span>
      </Spinner>
    </div>
  );
}

export default TestDetailTable;
