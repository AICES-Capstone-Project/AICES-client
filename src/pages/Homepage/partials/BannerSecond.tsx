import React from "react";
import { Button } from "antd";
import { useTranslation } from 'react-i18next';
import { ClockCircleOutlined } from "@ant-design/icons";

const BannerSecond: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section
      className="relative text-center overflow-hidden min-h-screen flex flex-col justify-center items-center"
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full blur-[150px] opacity-100"
        style={{
          background: `
            radial-gradient(
              circle at 50% 50%,
              var(--color-primary-light) 0%,
              color-mix(in srgb, var(--color-primary-light) 40%, white 60%) 45%,
              white 90%
            )
          `,
          zIndex: 1,
        }}
      ></div>

      <div className="relative z-20 flex flex-col items-center gap-10">
        <div
          className="flex items-center justify-center mb-8 rounded-full bg-white"
          style={{
            color: "var(--color-primary)",
            boxShadow: "0 10px 50px rgba(6,95,70,0.3)",
          }}
        >
          <ClockCircleOutlined style={{ fontSize: "100px" }} />
        </div>

        <h2 className="text-4xl md:text-5xl !font-extrabold mb-4 leading-tight">
          <span style={{ color: "var(--color-primary-dark)" }}>{t('homepage.bannerSecond.titlePrefix')}</span>
          <span style={{ color: "var(--color-primary-light)" }}> {t('homepage.bannerSecond.titleSuffix')}</span>
        </h2>

        <p className="text-gray-700 max-w-2xl mx-auto mb-8 text-lg font-medium leading-relaxed">
          {t('homepage.bannerSecond.description')}
        </p>

        <Button
          type="primary"
          size="large"
          style={{
            backgroundColor: "var(--color-primary-dark)",
            borderColor: "var(--color-primary-dark)",
            borderRadius: "8px",
            padding: "0 32px",
            height: "48px",
            fontWeight: 600,
          }}
        >
          {t('homepage.bannerSecond.cta')}
        </Button>
      </div>
    </section>
  );
};

export default BannerSecond;
