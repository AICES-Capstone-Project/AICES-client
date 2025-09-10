import React from "react";
import { CarryOutOutlined, BankOutlined } from "@ant-design/icons";
import classNames from "classnames/bind";
import styles from "./RightBanner.module.scss";

const cx = classNames.bind(styles);

const RightBanner: React.FC = () => {
  return (
    <aside className={cx("rightBanner")}>
      <div className={cx("wrap")}>
        {/* Logo */}
        <div className={cx("brand")}>
          <span className={cx("brandMark")}>AICES</span>
        </div>

        <p className={cx("headline")}>
          Over 12,345 job seeker <br /> waiting for good employees.
        </p>

        <div className={cx("stats")}>
          <div className={cx("stat")}>
            <div className={cx("iconBox")}>
              <CarryOutOutlined />
            </div>
            <div className={cx("meta")}>
              <div className={cx("value")}>1,000</div>
              <div className={cx("label")}>Live Job</div>
            </div>
          </div>

          <div className={cx("stat")}>
            <div className={cx("iconBox")}>
              <BankOutlined />
            </div>
            <div className={cx("meta")}>
              <div className={cx("value")}>500</div>
              <div className={cx("label")}>Companies</div>
            </div>
          </div>

          <div className={cx("stat")}>
            <div className={cx("iconBox")}>
              <CarryOutOutlined />
            </div>
            <div className={cx("meta")}>
              <div className={cx("value")}>6,789</div>
              <div className={cx("label")}>New Jobs</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightBanner;
