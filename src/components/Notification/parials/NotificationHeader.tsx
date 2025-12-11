import React from "react";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { EllipsisOutlined, CheckOutlined, SettingOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

interface NotificationHeaderProps {
  activeTab: "all" | "unread";
  setActiveTab: (tab: "all" | "unread") => void;
  onMarkAllRead: () => void;
  isConnected: boolean;
  className?: string;
}

const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  activeTab,
  setActiveTab,
  onMarkAllRead,
  className,
}) => {
  const { t } = useTranslation();

  const moreMenuItems: MenuProps["items"] = [
    {
      key: "markAllRead",
      icon: <CheckOutlined />,
      label: t("notification.markAllAsRead", "Đánh dấu tất cả đã đọc"),
      onClick: onMarkAllRead,
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: t("notification.settings", "Cài đặt thông báo"),
    },
  ];

  return (
    <div className={`flex flex-col  bg-white sticky top-0 z-10 rounded-t-lg ${className || ''}`}>
      <div className="flex items-center justify-between px-4 pt-4 pb-2 mb-1" style={{ margin: '10px 0 0 10px' }}>
        <h3 className="text-2xl font-bold text-[#050505] m-0">{t("notification.title", "Notification")}</h3>
        <div className="flex items-center gap-2">
          <TabButton
            active={activeTab === "all"}
            onClick={() => setActiveTab("all")}
            label={t("notification.all", "Tất cả")}
          />
          <TabButton
            active={activeTab === "unread"}
            onClick={() => setActiveTab("unread")}
            label={t("notification.unread", "Chưa đọc")}
          />
          <Dropdown menu={{ items: moreMenuItems }} trigger={["click"]} placement="bottomRight">
          <div className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F0F2F5] cursor-pointer transition-colors">
            <EllipsisOutlined className="text-[#65676B] text-lg" />
          </div>
        </Dropdown>
        </div>
        
      </div>

      {/* Tabs */}
      {/* ✨ Thêm mb-2 để tách thoáng hơn với dòng Status bên dưới */}
      <div className="flex gap-2 px-4 pb-2 mb-2" style={{ margin: ' 0 0 10px 10px' }}>
      </div>

      {/* Connection Status Section */}
      {/* <div className="flex items-center justify-between px-4 py-1">
        <span className="text-[17px] font-semibold text-[#050505]" style={{ margin: '0 10px' }}>
          {t("notification.earlier", "Trước đó")}
        </span>
        <Tooltip title={isConnected ? t("notification.connected", "Realtime connected") : t("notification.disconnected", "Realtime disconnected")}>
          <div className={`w-2 h-2 rounded-full mr-auto ml-2 ${isConnected ? "bg-green-500" : "bg-gray-300"}`} />
        </Tooltip>
      </div> */}
    </div>
  );
};

const TabButton = ({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) => (
  <button
    className={`
      px-3 py-1.5 rounded-full text-[14px] font-semibold transition-all duration-200 ease-in-out border cursor-pointer select-none
      active:scale-95
      ${active
        ? "bg-[color-mix(in_srgb,var(--color-primary-light)_15%,white)] text-[var(--color-primary-dark)] border-[color-mix(in_srgb,var(--color-primary-light)_15%,white)]"
        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-[var(--color-primary-light)] hover:text-[var(--color-primary)]"
      }
    `}
    onClick={onClick}
    style={{ padding: '0 10px' }}
  >
    {label}
  </button>
);

export default NotificationHeader;