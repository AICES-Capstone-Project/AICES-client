import { Modal, Button, Space, Tag, Avatar } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  IdcardOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import type { User } from "../../../../types/user.types";

interface UserDetailModalProps {
  open: boolean;
  loading: boolean;
  user: User | null;
  onClose: () => void;
}

export default function UserDetailModal({
  open,
  loading,
  user,
  onClose,
}: UserDetailModalProps) {
  const renderRoleTag = (roleName?: string) => {
    if (!roleName) return null;
    const isSystem = roleName.startsWith("System");
    const type = isSystem ? "system" : "hr";
    const label = roleName.replace(/_/g, " ");

    return (
      <Tag className={`role-tag role-tag-${type}`}>
        {label}
      </Tag>
    );
  };

  const renderStatusTag = (status?: any) => {
    if (!status) return null;
    const key = String(status).toLowerCase();
    return (
      <Tag className={`status-tag status-tag-${key}`}>
        {status}
      </Tag>
    );
  };

  return (
    <Modal
      open={open}
      title="User Details"
      onCancel={onClose}
      footer={
        <Button
          onClick={onClose}
          className="system-modal-btn system-modal-btn-cancel"
        >
          Close
        </Button>
      }
      width={780}
      className="system-modal user-detail-modal"
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: 24 }}>Loading...</div>
      ) : !user ? (
        <div style={{ padding: 12 }}>No user data available</div>
      ) : (
        <div className="user-detail-wrapper">
          {/* ===== HEADER ===== */}
          <div className="user-detail-header">
            <div className="user-detail-avatar-wrap">
              <Avatar
                src={user.avatarUrl}
                alt={user.fullName || user.email}
                size={82}
                className="user-detail-avatar"
              >
                {(user.fullName || user.email)?.charAt(0).toUpperCase()}
              </Avatar>
              <div className="user-detail-id-chip">
                <IdcardOutlined style={{ marginRight: 4 }} />
                ID #{user.userId}
              </div>
            </div>

            <div className="user-detail-header-text">
              <div className="user-detail-name">
                {user.fullName || "—"}
              </div>
              <div className="user-detail-email">
                <MailOutlined style={{ marginRight: 4 }} />
                {user.email}
              </div>

              <Space size={8} className="user-detail-header-tags">
                {renderRoleTag(user.roleName)}
                {renderStatusTag((user as any).userStatus)}
              </Space>
            </div>
          </div>

          {/* ===== ACCOUNT INFO CARD ===== */}
          <div className="user-detail-section">
            <div className="system-modal-section-title">Account information</div>
            <div className="user-detail-card">
              <div className="user-detail-grid">
                <div className="user-detail-field">
                  <span className="label">
                    <PhoneOutlined /> Phone
                  </span>
                  <span className="value">
                    {user.phoneNumber || "—"}
                  </span>
                </div>

                <div className="user-detail-field">
                  <span className="label">
                    <CalendarOutlined /> Date of birth
                  </span>
                  <span className="value">
                    {user.dateOfBirth
                      ? new Date(user.dateOfBirth).toLocaleDateString()
                      : "—"}
                  </span>
                </div>

                <div className="user-detail-field full-row">
                  <span className="label">
                    <EnvironmentOutlined /> Address
                  </span>
                  <span className="value">
                    {user.address || "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ===== META CARD ===== */}
          <div className="user-detail-section">
            <div className="system-modal-section-title">Meta</div>
            <div className="user-detail-card">
              <div className="user-detail-grid">
                <div className="user-detail-field">
                  <span className="label">
                    <ClockCircleOutlined /> Created at
                  </span>
                  <span className="value">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleString()
                      : "—"}
                  </span>
                </div>

                <div className="user-detail-field full-row">
                  <span className="label">
                    <LoginOutlined /> Login providers
                  </span>
                  <span className="value">
                    {user.loginProviders && user.loginProviders.length > 0 ? (
                      <Space size={6} wrap>
                        {user.loginProviders.map((p, idx) => (
                          <Tag
                            key={idx}
                            className="user-detail-provider-tag"
                          >
                            {p.authProvider}
                          </Tag>
                        ))}
                      </Space>
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
