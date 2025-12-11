import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, Spin, Empty, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NotificationHeader from "../../../components/Notification/parials/NotificationHeader";
import NotificationItem from "../../../components/Notification/parials/NotificationItem";
import { notificationService } from "../../../services/notificationService";
import { invitationService } from "../../../services/invitationService";
import { useNotificationSignalR } from "../../../hooks/useNotificationSignalR";
import type { Notification } from "../../../types/notification.types";

const NotificationManager: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [respondingInvitation, setRespondingInvitation] = useState<number | null>(null);

  const loadNotifications = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const response = await notificationService.getMyNotifications();
      if (response.status === "Success" && response.data) {
        const sorted = [...response.data].sort(
          (a: Notification, b: Notification) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setNotifications(sorted);
        try {
          const unread = sorted.filter((n) => !n.isRead).length;
          window.dispatchEvent(new CustomEvent("notifications:count", { detail: { count: unread } }) as Event);
        } catch (e) {
          // ignore
        }
      } else {
        if (!isBackground) setError(response.message || "Không thể tải thông báo");
      }
    } catch (err) {
      console.error(err);
      if (!isBackground) setError("Không thể tải thông báo. Vui lòng thử lại.");
    }
    if (!isBackground) setLoading(false);
  }, []);

  useEffect(() => {
    loadNotifications(true);
  }, [loadNotifications]);

  const handleNewNotification = useCallback((newNotif: Notification) => {
    setNotifications((prev) => {
      if (prev.some((n) => n.notifId === newNotif.notifId)) return prev;
      const next = [newNotif, ...prev];
      try {
        const unread = next.filter((n) => !n.isRead).length;
        window.dispatchEvent(new CustomEvent("notifications:count", { detail: { count: unread } }) as Event);
      } catch (e) {
        // ignore
      }
      return next;
    });
  }, []);

  useNotificationSignalR({
    onNewNotification: handleNewNotification,
    enabled: true,
  });

  const handleMarkAsRead = async (notifId: number) => {
    try {
      const response = await notificationService.markAsRead(notifId);
      if (response.status === "Success") {
        setNotifications((prev) => {
          const next = prev.map((n) => (n.notifId === notifId ? { ...n, isRead: true } : n));
          try {
            const unread = next.filter((n) => !n.isRead).length;
            window.dispatchEvent(new CustomEvent("notifications:count", { detail: { count: unread } }) as Event);
          } catch (e) {
            // ignore
          }
          return next;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifs = notifications.filter((n) => !n.isRead);
      await Promise.all(unreadNotifs.map((n) => notificationService.markAsRead(n.notifId)));
      setNotifications((prev) => {
        const next = prev.map((n) => ({ ...n, isRead: true }));
        try {
          window.dispatchEvent(new CustomEvent("notifications:count", { detail: { count: 0 } }) as Event);
        } catch (e) {
          // ignore
        }
        return next;
      });
    } catch (err) {
      console.error(err);
    }
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
        setNotifications((prev) => {
          const next = prev.map((n) => n.notifId === notif.notifId ? { ...n, isRead: true, invitation: n.invitation ? { ...n.invitation, status: newStatus as any } : null } : n);
          try {
            const unread = next.filter((n) => !n.isRead).length;
            window.dispatchEvent(new CustomEvent("notifications:count", { detail: { count: unread } }) as Event);
          } catch (e) {
            // ignore
          }
          return next;
        });
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error(err);
    }
    setRespondingInvitation(null);
  };

  const filteredNotifications = useMemo(() => activeTab === 'unread' ? notifications.filter((n) => !n.isRead) : notifications, [activeTab, notifications]);

  return (
    <Card title={
      <div >
        {/* <div style={{ flex: '0 0 auto' }}>
          <span className="font-semibold">Notifications</span>
        </div> */}
        <NotificationHeader activeTab={activeTab} setActiveTab={setActiveTab} onMarkAllRead={handleMarkAllAsRead} isConnected={true} />
      </div>}
      style={{ maxWidth: 1200, margin: '12px auto', borderRadius: 12, height: 'calc(100% - 25px)', }}>
      

      <div style={{ minHeight: 240, maxHeight: '80vh', overflowY: 'auto', overflowX: 'hidden', padding: 8, boxSizing: 'border-box' }}>
        {loading && notifications.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 36 }}><Spin /></div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <div style={{ marginBottom: 12, color: '#666' }}>{error}</div>
            <Button type="primary" size="small" onClick={() => loadNotifications(false)}>Thử lại</Button>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Empty description={t('notification.empty', 'Không có thông báo')} />
        ) : (
          filteredNotifications.map((notif) => (
            <NotificationItem
              key={notif.notifId}
              notification={notif}
              onClick={async () => {
                if (!notif.isRead) {
                  await notificationService.markAsRead(notif.notifId);
                  setNotifications((prev) => prev.map((n) => (n.notifId === notif.notifId ? { ...n, isRead: true } : n)));
                }
                // attempt to navigate if the notification contains a URL-like field
                const targetUrl = (notif as any).url || (notif as any).link || (notif as any).redirectUrl;
                if (targetUrl) {
                  try { navigate(String(targetUrl)); } catch { /* ignore */ }
                }
              }}
              onMarkRead={(id) => handleMarkAsRead(id)}
              onAccept={(n, e) => { e.stopPropagation(); handleInvitationAction(n, 'accept'); }}
              onDecline={(n, e) => { e.stopPropagation(); handleInvitationAction(n, 'decline'); }}
              isResponding={respondingInvitation === notif.invitation?.invitationId}
            />
          ))
        )}
      </div>
    </Card>
  );
};

export default NotificationManager;
