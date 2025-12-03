import React, { useEffect, useState, useCallback } from "react";
import { Popover, Spin, Empty, Button, Avatar, notification as antNotification } from "antd";
import { BellOutlined, ReloadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { notificationService } from "../../services/notificationService";
import { invitationService } from "../../services/invitationService";
import { useNotificationSignalR } from "../../hooks/useNotificationSignalR";
import type { Notification } from "../../types/notification.types";

import { getNotificationIcon } from "./parials/notification.utils";
import NotificationHeader from "./parials/NotificationHeader";
import NotificationItem from "./parials/NotificationItem";

interface NotificationDropdownProps {
  className?: string;
  style?: React.CSSProperties;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ className, style }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [respondingInvitation, setRespondingInvitation] = useState<number | null>(null);

  // Tính toán số lượng chưa đọc
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // --- HANDLERS ---

  const handleNewNotification = useCallback((newNotif: Notification) => {
    console.log("📨 New notification received:", newNotif);
    setNotifications((prev) => {
      // Tránh trùng lặp
      if (prev.some((n) => n.notifId === newNotif.notifId)) return prev;
      return [newNotif, ...prev];
    });

    const { icon, color } = getNotificationIcon(newNotif.type);
    antNotification.open({
      message: <span className="font-semibold text-gray-900">Thông báo mới</span>,
      description: (
        <div>
          <p className="text-gray-700 mb-1" dangerouslySetInnerHTML={{ __html: newNotif.message }} />
          {newNotif.detail && <p className="text-gray-500 text-sm">{newNotif.detail}</p>}
        </div>
      ),
      icon: <Avatar size={32} style={{ backgroundColor: color }} icon={icon} />,
      placement: "topRight",
      duration: 5,
      className: "notification-toast",
      onClick: () => setOpen(true),
    });
  }, []);

  // Kết nối SignalR để nhận thông báo realtime
  const { isConnected } = useNotificationSignalR({
    onNewNotification: handleNewNotification,
    enabled: true,
  });

  // Hàm gọi API lấy danh sách
  const loadNotifications = useCallback(async (isBackground = false) => {
    // Nếu gọi ngầm (background) thì không hiện loading spinner
    if (!isBackground) setLoading(true);
    setError(null);
    try {
      const response = await notificationService.getMyNotifications();
      if (response.status === "Success" && response.data) {
        const sorted = [...response.data].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setNotifications(sorted);
      } else {
        // Chỉ set error nếu không phải loading ngầm, tránh trải nghiệm xấu
        if (!isBackground) setError(response.message || "Không thể tải thông báo");
      }
    } catch (err) {
      console.error(err);
      if (!isBackground) setError("Không thể tải thông báo. Vui lòng thử lại.");
    }
    if (!isBackground) setLoading(false);
  }, []);

  // ✨ FIX 1: Gọi API ngay lần đầu tiên component mount để lấy số lượng badge
  useEffect(() => {
    loadNotifications(true); // true để không hiện loading quay quay lần đầu load trang
  }, [loadNotifications]);

  // ✨ FIX 2: Khi mở dropdown ra thì load lại để đảm bảo dữ liệu mới nhất (Optional)
  useEffect(() => {
    if (open) {
        // Load lại nhưng không cần hiện spinner loading nếu đã có dữ liệu rồi
        const hasData = notifications.length > 0;
        loadNotifications(!hasData); 
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleMarkAsRead = async (notifId: number) => {
    try {
      const response = await notificationService.markAsRead(notifId);
      if (response.status === "Success") {
        setNotifications((prev) =>
          prev.map((n) => (n.notifId === notifId ? { ...n, isRead: true } : n))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifs = notifications.filter((n) => !n.isRead);
      await Promise.all(unreadNotifs.map((n) => notificationService.markAsRead(n.notifId)));
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error(error);
    }
  };

  const handleNotificationClick = async (notif: Notification) => {
    if (notif.invitation?.status?.toLowerCase() === "pending") return;
    if (!notif.isRead) {
      // Đánh dấu đọc phía Server
      await notificationService.markAsRead(notif.notifId);
      // Cập nhật UI ngay lập tức
      setNotifications((prev) =>
        prev.map((n) => (n.notifId === notif.notifId ? { ...n, isRead: true } : n))
      );
    }
    setOpen(false);
  };

  const handleInvitationAction = async (notif: Notification, action: 'accept' | 'decline') => {
    if (!notif.invitation) return;
    const invId = notif.invitation.invitationId;
    setRespondingInvitation(invId);

    try {
      const serviceCall = action === 'accept' ? invitationService.acceptInvitation : invitationService.declineInvitation;
      const response = await serviceCall(invId);

      if (response.status === "Success") {
        const newStatus = action === 'accept' ? "Accepted" : "Declined";
        setNotifications((prev) =>
          prev.map((n) =>
            n.notifId === notif.notifId
              ? { ...n, isRead: true, invitation: n.invitation ? { ...n.invitation, status: newStatus as any } : null }
              : n
          )
        );
        antNotification[action === 'accept' ? 'success' : 'info']({
          message: action === 'accept' ? t("notification.invitationAccepted") : t("notification.invitationDeclined"),
          description: action === 'accept' ? `Bạn đã tham gia ${notif.invitation.companyName}` : undefined,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      antNotification.error({
        message: t("notification.error"),
        description: t("notification.invitationError"),
      });
    }
    setRespondingInvitation(null);
  };

  // --- RENDER ---

  const filteredNotifications = activeTab === "unread"
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  const content = (
    <div className="w-[360px] flex flex-col bg-white rounded-lg shadow-sm font-sans h-full max-h-[80vh]">
      <NotificationHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onMarkAllRead={handleMarkAllAsRead}
        isConnected={isConnected}
      />

      <div className="flex-1 overflow-y-auto max-h-[60vh] custom-scrollbar flex flex-col p-2">
        {loading && notifications.length === 0 ? ( // Chỉ hiện loading khi chưa có dữ liệu
          <div className="flex items-center justify-center py-10"><Spin /></div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <ExclamationCircleOutlined className="text-2xl text-gray-400 mb-2" />
            <p className="text-[#65676B] mb-2">{error}</p>
            <Button type="primary" size="small" icon={<ReloadOutlined />} onClick={() => loadNotifications()}>
              {t("notification.retry", "Thử lại")}
            </Button>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span className="text-[#65676B]">{t("notification.empty", "Không có thông báo")}</span>}
            className="py-10"
          />
        ) : (
          filteredNotifications.map((notif) => (
            <NotificationItem
              key={notif.notifId}
              notification={notif}
              onClick={handleNotificationClick}
              onMarkRead={(id) => handleMarkAsRead(id)}
              onAccept={(n, e) => { e.stopPropagation(); handleInvitationAction(n, 'accept'); }}
              onDecline={(n, e) => { e.stopPropagation(); handleInvitationAction(n, 'decline'); }}
              isResponding={respondingInvitation === notif.invitation?.invitationId}
            />
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className={className} style={style}>
      <Popover
        content={content}
        trigger="click"
        open={open}
        onOpenChange={setOpen}
        placement="bottomRight"
        overlayInnerStyle={{ padding: 0, borderRadius: "8px", overflow: "hidden" }}
        arrow={false}
        overlayClassName="facebook-notification-popover"
      >
        <div
          className={`relative w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 select-none ${open ? "bg-[#E7F3FF] text-[#0866FF]" : "bg-[#E4E6EB] hover:bg-[#D8DADF] text-[#050505]"
            }`}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: "var(--color-primary-light)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <BellOutlined style={{ fontSize: 20, color: "#fff" }} />
          </div>

          {/* Logic hiển thị Count: Nếu > 0 là hiện, bất kể open hay close */}
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 flex items-center justify-center min-w-[19px] h-[19px] px-1 bg-[#E41E3F] text-white text-[11px] font-bold rounded-full border-[2px] border-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </div>
          )}
        </div>
      </Popover>
    </div>
  );
};

export default NotificationDropdown;