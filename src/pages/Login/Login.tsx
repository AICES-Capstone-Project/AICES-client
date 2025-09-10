// LogIn.tsx
import React from "react";
import classNames from "classnames/bind";
import { useLocation } from "react-router-dom";

import styles from "./Login.module.scss";
import Form from "./partials/Form/Form";
import RightBanner from "./partials/RightBanner/RightBanner";

const cx = classNames.bind(styles);

const LogIn: React.FC = () => {
  const { pathname: currentPath } = useLocation();

  return (
    <div className={cx("container")}>
      <div className={cx("login_container")}>
        <div className={cx("left")}>
          <div className={cx("form_container")}>
            <Form />
          </div>

          <div className={cx("banner_container")}>
            {currentPath === "/login" && <RightBanner />}
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <p className={styles.footer_text}>
          @ 2025 AICES - AI Powered Candidate Evaluation System for Recruiters. All rights Reserved
        </p>
      </div>
    </div>
  );
};

export default LogIn;
