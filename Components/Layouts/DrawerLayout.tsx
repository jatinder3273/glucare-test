import React, { useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { useToggle } from "rooks";
import styles from "./DrawerLayout.module.scss";
interface IProps {
  toggleSidebar: (action: any) => any;
  children: React.ReactNode;
  openSidebar: boolean;
  title: string;
}
function DrawerLayout({ children, toggleSidebar, openSidebar, title }: IProps) {
  return (
    <div>
      <Offcanvas
        className={styles.sidebarCanvas}
        show={openSidebar}
        onHide={toggleSidebar}
        placement="end"
      >
        <Offcanvas.Header closeButton className={styles.sidebarCanvasHeader}>
          <Offcanvas.Title>
            <h5>{title}</h5>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className={styles.sidebarCanvasBody}>
          {children}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default DrawerLayout;
