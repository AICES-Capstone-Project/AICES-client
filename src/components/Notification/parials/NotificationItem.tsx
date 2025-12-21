import React from "react";
import { Avatar, Button, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { CheckOutlined, EllipsisOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { formatTimeAgo, getNotificationIcon } from "./notification.utils";
import type { Notification } from "../../../types/notification.types";

interface NotificationItemProps {
  notification: Notification;
  onClick: (notif: Notification) => void;
  onMarkRead: (id: number, e: React.MouseEvent) => void;
  onAccept: (notif: Notification, e: React.MouseEvent) => void;
  onDecline: (notif: Notification, e: React.MouseEvent) => void;
  isResponding: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification: notif,
  onClick,
  onMarkRead,
  onAccept,
  onDecline,
  isResponding,
}) => {
  const { t } = useTranslation();
  const { icon, color } = getNotificationIcon(notif.type);
  const isPending = notif.invitation?.status?.toLowerCase() === "pending";

  const menuItems: MenuProps["items"] = !notif.isRead && !isPending
    ? [
      {
        key: "markRead",
        icon: <CheckOutlined />,
        label: t("notification.markAsRead", "Mark as read"),
        onClick: (info) => {
          info.domEvent.stopPropagation();
          onMarkRead(notif.notifId, info.domEvent as unknown as React.MouseEvent);
        },
      },
    ]
    : [];

  return (
    <div
      className={`group relative flex items-center px-3 py-3 w-full rounded-lg cursor-pointer transition-colors hover:bg-green-100`}
      onClick={(e) => {
        if (!notif.isRead) {
          onMarkRead(notif.notifId, e);
        }
        onClick(notif);
      }}

      style={{ margin: '5px 5px 0 5px', backgroundColor: !notif.isRead ? 'color-mix(in srgb, var(--color-primary-light) 10%, transparent)' : undefined }}
    >
      <div className="flex-shrink-0 w-[60px] flex items-center justify-center mr-3">
        <Avatar
          size={48}
          style={{ backgroundColor: color, border: "none" }}
          icon={icon}
          className="flex items-center justify-center shadow-sm"
        />
      </div>

      <div className="flex-1 min-w-0 pr-6">

        <div className={`text-[14px] leading-5 mb-1 ${!notif.isRead ? "text-[#050505] font-bold" : "text-gray-600"}`}>
          <span className="line-clamp-3" dangerouslySetInnerHTML={{ __html: notif.message }} />
        </div>

        {notif.detail && (
          <div className={`text-[13px] line-clamp-2 mt-0.5 mb-1 ${!notif.isRead ? "text-gray-700 font-medium" : "text-gray-500"}`}>
            {notif.detail}
          </div>
        )}

        <div className={`text-[12px] ${!notif.isRead ? "text-[var(--color-primary)] font-semibold" : "text-gray-400"}`}>
          {formatTimeAgo(notif.createdAt)}
        </div>

        {notif.invitation && (
          <div className="mt-3">
            {isPending ? (
              <div className="flex gap-2 m-2" style={{ marginBottom: '5px' }}>
                <Button
                  type="primary"
                  loading={isResponding}
                  onClick={(e) => onAccept(notif, e)}
                  className="company-btn--filled"
                >
                  {t("notification.accept", "Accept")}
                </Button>
                <Button
                  loading={isResponding}
                  onClick={(e) => onDecline(notif, e)}
                  className="company-btn"
                >
                  {t("notification.decline", "Decline")}
                </Button>
              </div>
            ) : (
              <span className={`text-[13px] font-medium ${notif.invitation.status?.toLowerCase() === "accepted" ? "text-green-600" : "text-gray-500"}`}>
                {notif.invitation.status?.toLowerCase() === "accepted"
                  ? t("notification.accepted", "Accepted")
                  : t("notification.declined", "Declined")}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center z-10">
        {menuItems.length > 0 && (
          <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="bottomRight">
            <div
              className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-gray-50 hover:text-[var(--color-primary)]"
              onClick={(e) => e.stopPropagation()}
            >
              <EllipsisOutlined className="text-lg" />
            </div>
          </Dropdown>
        )}
      </div>
    </div>

  );
};

export default NotificationItem;