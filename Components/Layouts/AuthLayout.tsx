import React from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./AuthLayout.module.scss";
import logoWhite from "@assets/logoWhite.svg";
import Image from "next/image";
interface IProps {
  children: React.ReactNode;
}
const AuthLayout = ({ children }: IProps) => {
  return (
    <div className={styles.authLayoutWrap}>
      <Row className="gx-0 h-100">
        <Col md={6}>
          <div className={styles.authLayoutBg}>
            <div className={styles.authLayoutLogo}>
              <Image src={logoWhite} alt="logo" />
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className={styles.authLayoutFormWrap}>{children}</div>
        </Col>
      </Row>
    </div>
  );
};

export default AuthLayout;
