import React, { useEffect, useState } from "react";
import { MessageIcon, NotificationBell, SuccessIcon } from "../Icons/Icons";
import styles from "./Notifications.module.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CloseIcon } from "../Icons/common";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "redux/store";
import {
  internal_notification_list,
  internal_notification_read,
  internal_notification_read_all,
} from "redux/Settings/action";
import moment from "moment";
import { Spinner } from "react-bootstrap";

interface IProps {
  setShowDropdown: (action: any) => any;
}

interface ListType {
  id: number;
  checkRead: boolean;
  iconType: number;
  heading: string;
  content: string;
  name: string;
  date: string;
}

interface notificationType {
  created: string;
  id: number;
  modified: string;
  read_at: string;
  text: string;
  title: string;
  user: number;
}

const Notifications = ({ setShowDropdown }: IProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const notificationData = useSelector(
    (state: any) => state.setting.internal_notification_list
  );
  const [pageSize, setPageSize] = useState(10);
  const [list, setList] = useState<ListType[]>([
    {
      id: 1,
      checkRead: false,
      iconType: 1,
      heading: "New patient assigned",
      content: "You got new patient. You will be primary doctor for",
      name: " Tobbie Pattons.",
      date: "Today, 10:24 am",
    },
    {
      id: 2,
      checkRead: false,
      iconType: 2,
      heading: "New patient assigned",
      content: "You got new patient. You will be primary doctor for",
      name: " Tobbie Pattons.",
      date: "Today, 10:24 am",
    },
    {
      id: 3,
      checkRead: false,
      iconType: 1,
      heading: "New patient assigned",
      content: "You got new patient. You will be primary doctor for",
      name: " Tobbie Pattons.",
      date: "Today, 10:24 am",
    },
    {
      id: 4,
      checkRead: true,
      iconType: 1,
      heading: "New patient assigned",
      content: "You got new patient. You will be primary doctor for",
      name: " Tobbie Pattons.",
      date: "Today, 10:24 am",
    },
    {
      id: 5,
      checkRead: true,
      iconType: 1,
      heading: "New patient assigned",
      content: "You got new patient. You will be primary doctor for",
      name: " Tobbie Pattons.",
      date: "Today, 10:24 am",
    },
    {
      id: 6,
      checkRead: true,
      iconType: 1,
      heading: "New patient assigned",
      content: "You got new patient. You will be primary doctor for",
      name: " Tobbie Pattons.",
      date: "Today, 10:24 am",
    },
  ]);

  const showToast = () =>
    toast.success("Sucssess message", {
      icon: SuccessIcon,
      autoClose: 2000,
      hideProgressBar: true,
      position: toast.POSITION.TOP_CENTER,
    });

  const renderNotifications = (data: notificationType) => {
    return (
      <div
        key={data.id}
        className={`${styles.notification} ${
          data.read_at ? styles.changeTheme : ""
        }`}
        onClick={() => {
          if (data.read_at == null) {
            dispatch(
              internal_notification_read({
                id: data.id,
                notificationData: notificationData.data,
                pagination: notificationData.pagination,
              })
            );
          }
        }}
      >
        <span className={styles.icon}>
          <NotificationBell />
        </span>
        <span className={styles.notificationContent}>
          <div className={styles.contentHeading}>{data.title}</div>
          <div className={styles.contentContent}>
            {data.text}
            {/* {data.text.substring(0, data.text.lastIndexOf(": "))}
            <span className={styles.contentName}>{` ${data.text.substring(
              data.text.lastIndexOf(": ") + 1,
              data.text.length
            )}`}</span> */}
          </div>
          <div className={styles.contentDate}>
            {moment(data.created).calendar()}
          </div>
        </span>
      </div>
    );
  };

  return (
    <div className={styles.mainWrap}>
      <ToastContainer closeButton={CloseIcon} />
      <div className={styles.headWrap}>
        <span>Notifications</span>
        <button
          type="button"
          className={`btn-close ${styles.closeButton}`}
          aria-label="Close"
          onClick={setShowDropdown}
        ></button>
      </div>
      {notificationData.data != undefined &&
        notificationData.data.filter(
          (item: notificationType) => item.read_at == null
        ).length != 0 && (
          <span
            className={styles.markAllTxt}
            onClick={() =>
              dispatch(internal_notification_read_all({ pageSize: pageSize }))
            }
          >
            Mark all as read
          </span>
        )}

      <div className={styles.listWrap}>
        {notificationData.data != undefined ? (
          notificationData.data.filter(
            (item: notificationType) => item.read_at == null
          ).length != 0 && (
            <div className={styles.newWrap}>
              <span className={styles.subHeading}>New</span>
              <div className={styles.notificationWrap}>
                {notificationData.data
                  .filter((item: notificationType) => item.read_at == null)
                  .map(renderNotifications)}
              </div>
            </div>
          )
        ) : (
          <div className={styles.ceterData2}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden text-center">Loading...</span>
            </Spinner>
          </div>
        )}

        {notificationData.data != undefined &&
          notificationData.data.filter(
            (item: notificationType) => item.read_at != null
          ).length != 0 && (
            <div className={styles.earlierWrap}>
              {notificationData.data.filter(
                (item: notificationType) => item.read_at == null
              ).length != 0 && (
                <span className={styles.subHeading}>Earlier</span>
              )}
              <div className={styles.notificationWrap}>
                {notificationData.data
                  .filter((item: notificationType) => item.read_at != null)
                  .map(renderNotifications)}
              </div>
            </div>
          )}
        {notificationData.data != undefined &&
          notificationData.data.length != 0 &&
          notificationData.pagination.next && (
            <div className="text-center">
              <span
                className={styles.loadMore}
                onClick={() => {
                  dispatch(
                    internal_notification_list({
                      page_size: pageSize + 10,
                      page: 1,
                    })
                  );
                  setPageSize((pre) => pre + 10);
                }}
              >
                Load More
              </span>
            </div>
          )}
        {notificationData.data != undefined &&
          notificationData.data.length == 0 && (
            <h5 className={styles.ceterData2}>No Data Found</h5>
          )}
      </div>
    </div>
  );
};

export default Notifications;
