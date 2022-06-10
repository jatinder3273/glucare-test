import React, { useEffect, useState } from "react";
import styles from "./ModalLayout.module.scss";
import { Modal } from "react-bootstrap";
interface IProps {
  toggleModal: (action?: boolean) => void;
  children: React.ReactNode;
  openModal: boolean;
  title: string;
  isCalendarPopup?: boolean;
  isProfilePopup?: boolean;
  isFilterPopup?: boolean;
}
const ModalLayout = ({
  children,
  toggleModal,
  openModal,
  title,
  isCalendarPopup,
  isProfilePopup,
  isFilterPopup,
}: IProps) => {
  return (
    <div>
      <Modal
        show={openModal}
        onHide={toggleModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className={`${styles.modalMain} ${
          isCalendarPopup
            ? styles.calendarPopup
            : isProfilePopup
            ? styles.profilePopup
            : isFilterPopup
            ? styles.filterPopup
            : ""
        }`}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h5>{title}</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
      </Modal>
    </div>
  );
};

export default ModalLayout;
