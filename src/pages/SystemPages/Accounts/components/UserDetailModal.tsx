import { Modal, Button, Space, Tag } from "antd";
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
  return (
    <Modal
      open={open}
      title="User Details"
      onCancel={onClose}
      footer={<Button onClick={onClose}>Close</Button>}
      width={600}
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: 20 }}>Loading...</div>
      ) : user ? (
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          <div>
            <strong>User ID:</strong> {user.userId}
          </div>
          <div>
            <strong>Email:</strong> {user.email}
          </div>
          <div>
            <strong>Full Name:</strong> {user.fullName || "—"}
          </div>
          <div>
            <strong>Role:</strong> {user.roleName}
          </div>
          <div>
            <strong>Phone:</strong> {user.phoneNumber || "—"}
          </div>
          <div>
            <strong>Address:</strong> {user.address || "—"}
          </div>
          <div>
            <strong>Date of Birth:</strong>{" "}
            {user.dateOfBirth
              ? new Date(user.dateOfBirth).toLocaleDateString()
              : "—"}
          </div>

          <div>
            <strong>Created At:</strong>{" "}
            {new Date(user.createdAt).toLocaleString()}
          </div>
          <div>
            <strong>Login Providers:</strong>
            <div style={{ marginTop: 8 }}>
              {user.loginProviders.map((p, i) => (
                <Tag key={i} color={p.isActive ? "blue" : "default"}>
                  {p.authProvider}
                </Tag>
              ))}
            </div>
          </div>
          {user.avatarUrl && (
            <div>
              <strong>Avatar:</strong>
              <div style={{ marginTop: 8 }}>
                <img
                  src={user.avatarUrl}
                  alt="Avatar"
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          )}
        </Space>
      ) : (
        <div>No user data available</div>
      )}
    </Modal>
  );
}
