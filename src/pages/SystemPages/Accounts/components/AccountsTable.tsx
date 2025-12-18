import { Button, Space, Table, Tag, Tooltip, Popconfirm, Avatar } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import type { User } from "../../../../types/user.types";
import { CrownOutlined } from "@ant-design/icons";

interface AccountsTableProps {
  loading: boolean;
  data: User[];
  pagination: TablePaginationConfig;
  onChangePage: (pagination: TablePaginationConfig) => void;
  onViewDetail: (user: User) => void;
  onEdit: (user: User) => void;
  onChangeStatus: (
    user: User,
    status: "Verified" | "Unverified" | "Locked"
  ) => void;
  onDelete: (user: User) => void;
}

export default function AccountsTable({
  loading,
  data,
  pagination,
  onChangePage,
  onViewDetail,
  onEdit,
  onChangeStatus,
  onDelete,
}: AccountsTableProps) {
  const columns: ColumnsType<User> = [
    {
      title: "No.",
      key: "no",
      width: 80,
      align: "center",
      render: (_: any, __: any, index: number) => {
        const current = pagination.current ?? 1;
        const pageSize = pagination.pageSize ?? 10;
        return (current - 1) * pageSize + index + 1;
      },
    },

    {
      title: "User",
      dataIndex: "email",
      render: (_: any, record) => {
        const hasAvatar = !!record.avatarUrl && record.avatarUrl.trim() !== "";

        return (
          <div className="accounts-user-cell">
            <Avatar
              src={hasAvatar ? record.avatarUrl : undefined}
              alt={record.fullName || record.email}
              size="large"
              className={`accounts-user-avatar ${
                hasAvatar ? "" : "accounts-avatar-default"
              }`}
            >
              {(record.fullName || record.email)?.charAt(0).toUpperCase()}
            </Avatar>

            <div className="accounts-user-text">
              <div className="name">{record.fullName || "—"}</div>
              <div className="email">{record.email}</div>
            </div>
          </div>
        );
      },
    },

    {
      title: "Role",
      dataIndex: "roleName",
      width: 160,
      render: (role: string) => {
        const isSystem = role.startsWith("System");
        const isSuperAdmin = role === "System_Admin" || role === "System Admin";

        const type = isSystem ? "system" : "hr";

        // Hiển thị đẹp hơn: đổi "_" thành " "
        const label = role.replace(/_/g, " ");

        return (
          <Tag
            className={`role-tag role-tag-${type} ${
              isSuperAdmin ? "role-tag-super-admin" : ""
            }`}
          >
            {isSuperAdmin && <CrownOutlined className="role-tag-icon" />}
            {label}
          </Tag>
        );
      },
    },

    {
      title: "Status",
      dataIndex: "userStatus",
      width: 120,
      render: (status: User["userStatus"]) => (
        <Tag className={`status-tag status-tag-${status.toLowerCase()}`}>
          {status}
        </Tag>
      ),
    },

    {
      title: "Actions",
      key: "actions",
      width: 220,
      render: (_, record) => (
        <Space size="small">
          {/* View */}
          <Tooltip title="View details">
            <Button
              size="small"
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => onViewDetail(record)}
            />
          </Tooltip>

          {/* Edit */}
          <Tooltip title="Edit user">
            <Button
              size="small"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>

          {/* Lock / Unlock */}
          {record.userStatus !== "Locked" ? (
            <Tooltip title="Lock user">
              <Button
                size="small"
                shape="circle"
                icon={<LockOutlined />}
                onClick={() => onChangeStatus(record, "Locked")}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Unlock user">
              <Button
                size="small"
                shape="circle"
                icon={<UnlockOutlined />}
                onClick={() => onChangeStatus(record, "Verified")}
              />
            </Tooltip>
          )}

          {/* Delete */}
          <Popconfirm
            title="Delete user"
            description={`Are you sure you want to delete ${record.email}?`}
            okText="Delete"
            okButtonProps={{ danger: true }}
            cancelText="Cancel"
            onConfirm={() => onDelete(record)}
          >
            <Tooltip title="Delete user">
              <Button
                size="small"
                shape="circle"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table<User>
      className="accounts-table"
      rowKey="userId"
      loading={loading}
      dataSource={data}
      columns={columns}
      pagination={pagination}
      onChange={(p) => onChangePage(p)}
    />
  );
}
