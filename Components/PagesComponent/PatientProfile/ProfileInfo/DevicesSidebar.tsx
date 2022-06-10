/* eslint-disable jsx-a11y/alt-text */
// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Image, Offcanvas } from "react-bootstrap";
import styles from "./DevicesSidebar.module.scss";
import image1 from "@assets/device1.png";
import image2 from "@assets/device2.png";
import image3 from "@assets/device3.png";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "redux/store";
import { fetch_device } from "redux/Patient/action";
import { useToggle } from "rooks";
import { getImage } from "redux/Image/action";
import profile_placeholder from "@assets/icons/profile_placeholder.svg";
interface IProps {
  setDeviceSidebar: (action: any) => any;
  openSidebar: boolean;
}

interface deviceType {
  battery_percentage: string;
  created: string;
  device: {
    created: string;
    data_template: { steps: number; heart_rate: number; sleep_in_bed: number };
    id: number;
    image: string;
    is_active: Blob;
    modified: string;
    name: string;
    wp_content: null | string;
  };
  id: number;
  last_data_at: string;
  manufacturer_no: number;
  modified: string;
  paired_at: string;
  sensor_expires_at: null | string;
  unpaired_at: null | string;
}

interface ImageProp {
  device: any;
  errors: any;
  food: string;
  loading: boolean;
  success: boolean;
  user: any;
}
function DevicesSidebar({ setDeviceSidebar, openSidebar }: IProps) {
  const patientProfileData = useSelector((state: any) => state.patient.profile);
  const imageData = useSelector((state: { image: ImageProp }) => state.image);
  const dispatch = useDispatch<AppDispatch>();
  const [callApi, setCallApi] = useToggle(true);
  const [callImageApi, setCallImageApi] = useToggle(true);
  const [deviceData, setDeviceData] = useState<deviceType[]>();

  useEffect(() => {
    if (patientProfileData.user != undefined && callApi) {
      dispatch(fetch_device({ user: patientProfileData.user }));
      setCallApi(false);
    }
    if (
      patientProfileData.fetch_device != undefined &&
      patientProfileData.fetch_device.length != 0
    ) {
      setDeviceData(patientProfileData.fetch_device);
    }
  }, [patientProfileData]);

  useEffect(() => {
    if (callImageApi && deviceData != undefined && deviceData.length != 0) {
      deviceData.map((data: deviceType) => {
        if (data.device.image != null) {
          dispatch(
            getImage({
              url: data.device.image,
              id: data.id,
              type: "device",
            })
          );
        }
      });
      setCallImageApi(false);
    }
  }, [deviceData]);

  const renderDevices = (data: deviceType) => {
    return (
      <div className={styles.deviceWrap} key={data.id}>
        <div className={styles.deviceImg}>
          <Image
            src={
              data.device.image !== null
                ? imageData.device[data.id]
                : profile_placeholder.src
            }
          />
        </div>
        <div className={styles.deviceContent}>
          <h5>{data.device.name}</h5>
          <p></p>
          <span>
            <i></i> Last synced:{" "}
            {moment(data.last_data_at).startOf("hour").fromNow()}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Offcanvas
        className="sidebarCanvas"
        show={openSidebar}
        onHide={setDeviceSidebar}
        placement="end"
      >
        <Offcanvas.Header closeButton className="sidebarCanvasHeader">
          <Offcanvas.Title>
            <h5>Devices</h5>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="sidebarCanvasBody">
          <div className={styles.deviceList}>
            {deviceData?.length != 0 && deviceData != undefined ? (
              deviceData?.map(renderDevices)
            ) : (
              <h5 style={{ textAlign: "center" }}>No Devices Found</h5>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default DevicesSidebar;
