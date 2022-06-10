import React from "react";
import classnames from "classnames";
import { usePagination, DOTS } from "./usePagination";
import styles from "./Pagination.module.scss";
import { NextIcon, PreIcon } from "@components/Common/Icons/Icons";

interface IProps {
  setCurrentPage: (param: number) => void;
  totalCount: number;
  siblingCount: 1;
  currentPage: number;
  pageSize: number;
  setPageSize: (param: number) => void;
}

const Pagination = ({
  setCurrentPage,
  totalCount,
  siblingCount,
  currentPage,
  pageSize,
  setPageSize,
}: IProps) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  // if (currentPage === 0 || paginationRange.length < 2) {
  //   return null;
  // }

  const onNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const onPrevious = () => {
    setCurrentPage(currentPage - 1);
  };

  let lastPage = paginationRange![paginationRange!.length - 1];
  return (
    <div className={styles.paginationWrap}>
      <ul className={styles.pagination_container}>
        <li
          className={`${styles.pagination_item} ${
            currentPage == 1 ? "disabled" : ""
          } ${styles.arrow}`}
          onClick={onPrevious}
        >
          <PreIcon />
        </li>
        {paginationRange!.map((pageNumber) => {
          if (pageNumber === DOTS) {
            return (
              <li className={`${styles.pagination_item} ${styles.dots}`}>
                &#8230;
              </li>
            );
          }

          return (
            <li
              className={classnames(styles.pagination_item, {
                selected: pageNumber === currentPage,
              })}
              onClick={() => setCurrentPage(Number(pageNumber))}
            >
              {pageNumber}
            </li>
          );
        })}
        <li
          className={`${styles.pagination_item} ${
            currentPage == lastPage ? "disabled" : ""
          } ${styles.arrow}`}
          onClick={onNext}
        >
          <NextIcon />
        </li>
      </ul>
      <span className={styles.rowPerPage}>
        <span className={styles.rowPerPageTxt}>Rows per page</span>
        <span className={styles.rowPerPageDropdown}>
          <select
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>
        </span>
      </span>
    </div>
  );
};

export default Pagination;
