import React from "react";
import DataTable from "react-data-table-component";
import styles from "./DataTable.module.scss";

interface IProps {
  columns: any[];
  data: any[];
  expandView?: React.ReactNode | undefined;
  customStyles: any;
  expandableRows?: boolean;
}

const DataTableComponent = ({
  columns,
  data,
  customStyles,
  expandableRows = false,
}: IProps) => {
  return (
    <div className={styles.DataTableListWrap}>
      <DataTable
        columns={columns}
        data={data}
        expandableRows={expandableRows}
        selectableRows
        defaultSortFieldId={1}
        customStyles={customStyles}
      />
    </div>
  );
};

export default DataTableComponent;
