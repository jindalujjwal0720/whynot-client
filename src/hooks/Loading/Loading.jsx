import React from "react";
import styles from "./Loading.module.css";

const LoadingProgress = () => {
  return (
    <div className={styles.LoadingProgressWrapper}>
      <div className={styles.LoadingProgress}></div>
    </div>
  );
};

export default LoadingProgress;
