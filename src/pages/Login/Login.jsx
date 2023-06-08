import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import styles from "./Login.module.css";

const Login = () => {
  const { currentUser, loginWithGoogle } = useAuth();

  return currentUser ? (
    <Navigate to="/" replace={true} />
  ) : (
    <div className={styles.loginPage}>
      <div className={styles.left}>
        <div className={styles.illustration}>
          <img
            src={process.env.REACT_APP_LOGIN_PAGE_IMAGE_URL}
            alt="login"
            draggable={false}
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
      <div className={styles.right}>
        <div>
          <div className={styles.title}>Login to WhyNot</div>
          <div className={styles.subtitle}>
            WhyNot is a platform where you can share your thoughts, issues and
            suggestions about the institute.
          </div>
        </div>
        <div className={styles.login}>
          <div className={styles.google} onClick={loginWithGoogle}>
            Continue with <img
              src={process.env.REACT_APP_GOOGLE_LOGO_URL}
              alt="google"
              draggable={false}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
