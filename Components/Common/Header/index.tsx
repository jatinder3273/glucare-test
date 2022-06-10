/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  NotificationBell,
  SettingIcon,
  LogoutIcon,
} from "@components/Common/Icons/Icons";
import styles from "./Header.module.scss";
import useTranslation from "next-translate/useTranslation";
import avatar from "@assets/avatars.png";
import { Dropdown, Image } from "react-bootstrap";
import { ArrowRight } from "@components/Common/Icons/common";
import Link from "next/link";
import Avatar from "@assets/avatars.png";
import ModalLayout from "@components/Layouts/ModalLayout";
import ShowProfile from "@components/PagesComponent/Profile/ShowProfile/ShowProfile";
import ShowSettings from "@components/PagesComponent/Profile/ShowSettings/ShowSettings";
import { CHAT_API_KEY, removeCurrentUser } from "utils";
import { useRouter } from "next/router";
import Notifications from "../Notifications";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, logout } from "redux/Auth/action";
import { AppDispatch } from "redux/store";
import { getImage } from "redux/Image/action";
import profile_placeholder from "@assets/icons/profile_placeholder.svg";
import { useToggle } from "rooks";
import { AnyAction } from "redux";
import { internal_notification_list } from "redux/Settings/action";
import { StreamChat } from "stream-chat";

interface IProps {
  hideBorder?: boolean;
  HeaderSubTitle: string;
  profilePage?: boolean;
  isTeamPage?: boolean;
}

interface ProfileType {
  first_name: string;
  last_name: string;
  job_title: {
    name: string;
  };
  user: number;
  avatar: string;
  unread_notifications: string;
}

const chatClient = StreamChat.getInstance(CHAT_API_KEY);
const Header = ({
  hideBorder,
  HeaderSubTitle,
  profilePage,
  isTeamPage,
}: IProps) => {
  const { t } = useTranslation("header");
  const [showModal, setShowModal] = useToggle(false);
  const [showDropdown, setShowDropdown] = useToggle(false);
  const [checkClick, setCheckClick] = useState(1);
  const router = useRouter();
  const patientProfileData = useSelector((state: any) => state.auth);
  const imageData = useSelector((state: any) => state.image);
  const dispatch = useDispatch<AppDispatch>();
  const [imageUrl, setImageUrl] = useState("");
  const [callImage, setCallImage] = useState(true);
  const [profileData, setProfileData] = useState<ProfileType>(
    {} as ProfileType
  );
  const [getProfileData, setGetProfileData] = useState(true);

  const toggleProfile = () => {
    setGetProfileData(!getProfileData);
    setCallImage(true);
  };

  useEffect(() => {
    dispatch(getProfile());
  }, [getProfileData]);

  useEffect(() => {
    if (callImage && patientProfileData.data.avatar != undefined) {
      setCallImage(false);
      dispatch(
        getImage({
          url: patientProfileData.data.avatar,
          id: patientProfileData.data.user,
          type: "user",
        })
      );
    }
    setProfileData(patientProfileData.data);
  }, [patientProfileData]);

  useEffect(() => {
    if (imageData.success) {
      setImageUrl(imageData.user[profileData.user]);
    }
  }, [imageData]);

  return (
    <div className={`${styles.header} ${hideBorder ? styles.noBorder : null}`}>
      <div className={styles.headerWrapper}>
        <div className={styles.header_title}>
          <Link href="/patient" passHref={true}>
            <h3>{isTeamPage ? "Team" : t("title")}</h3>
          </Link>
          {profilePage ? (
            <span className={styles.patientName}>
              <ArrowRight />
              {HeaderSubTitle}
            </span>
          ) : (
            <span className={styles.patientCounts}>{HeaderSubTitle}</span>
          )}
        </div>
        <div className={styles.headerRight}>
          <Dropdown
            onToggle={setShowDropdown}
            show={showDropdown}
            className={`${styles.headerProfile_dropdown}`}
          >
            <Dropdown.Toggle variant="" id="dropdown-basic">
              <div
                className={styles.header_notification}
                onClick={() =>
                  dispatch(
                    internal_notification_list({ page_size: 10, page: 1 })
                  )
                }
              >
                <NotificationBell />
                {profileData.unread_notifications != undefined &&
                  profileData.unread_notifications != "0" && (
                    <span>{profileData.unread_notifications}</span>
                  )}
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu
              className={`${styles.dropDown} themeDropdown_menu ${styles.notificationDropDown}`}
              align="end"
            >
              <Notifications setShowDropdown={setShowDropdown} />
            </Dropdown.Menu>
          </Dropdown>
          <div className={styles.headerProfile}>
            <Dropdown className={styles.headerProfile_dropdown}>
              <Dropdown.Toggle variant="" id="dropdown-basic">
                <span className={styles.image}>
                  <Image
                    alt=""
                    src={
                      profileData.avatar != null && imageUrl != ""
                        ? imageUrl
                        : profile_placeholder.src
                    }
                  />
                </span>
                {profileData !== undefined &&
                  Object.keys(profileData).length > 0 && (
                    <>
                      {" "}
                      <span className={styles.headerProfile_dropBtn}>
                        <h6>
                          {profileData.first_name} {profileData.last_name}
                        </h6>
                        <span>
                          {profileData.job_title !== null
                            ? profileData?.job_title?.name
                            : ""}
                        </span>
                      </span>
                    </>
                  )}
              </Dropdown.Toggle>

              <Dropdown.Menu
                className={`${styles.dropDown} themeDropdown_menu`}
                align="end"
              >
                <Dropdown.Item
                  as="li"
                  onClick={() => {
                    setCheckClick(1);
                    setShowModal(true);
                  }}
                >
                  <span className={styles.dropDownImage}>
                    <Image
                      alt=""
                      src={imageUrl}
                      placeholder={profile_placeholder.src}
                    />
                  </span>
                  {t("my_profile")}
                </Dropdown.Item>
                <Dropdown.Item
                  as="li"
                  onClick={() => {
                    setCheckClick(2);
                    setShowModal(true);
                  }}
                >
                  <span className="themeDropdown_menuIcon">
                    <SettingIcon />
                  </span>
                  {t("settings")}
                </Dropdown.Item>
                <div className="theme_divider" />
                <Dropdown.Item
                  as="li"
                  onClick={() => {
                    chatClient.disconnectUser();
                    dispatch(logout());
                    router.push("/");
                  }}
                >
                  <span className="themeDropdown_menuIcon">
                    <LogoutIcon />
                  </span>
                  {t("log_out")}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <ModalLayout
              title={checkClick == 1 ? "Profile" : "Settings"}
              openModal={showModal}
              toggleModal={setShowModal}
              isProfilePopup
            >
              {checkClick == 1 ? (
                <ShowProfile
                  profileData={profileData}
                  imageUrl={imageUrl}
                  setShowModal={setShowModal}
                  toggleProfile={toggleProfile}
                />
              ) : (
                <ShowSettings setShowModal={setShowModal} />
              )}
            </ModalLayout>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
