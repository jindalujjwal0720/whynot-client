import React from "react";
import styles from "./Alert.module.css";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { BsFillInfoCircleFill } from "react-icons/bs";

const MessagePopup = ({ message, type, badge }) => {
  const getBadge = () => {
    if (badge) return badge;
    if (type === "success") return <FaCheckCircle />;
    if (type === "error") return <FaExclamationCircle />;
    if (type === "info") return <BsFillInfoCircleFill />;
    if (type === "warning") return <FaExclamationCircle />;
  };

  return (
    <div className={`${styles.alertPopup} ${styles[type]}`}>
      {getBadge()}
      <p>{message}</p>
    </div>
  );
};

export default MessagePopup;
