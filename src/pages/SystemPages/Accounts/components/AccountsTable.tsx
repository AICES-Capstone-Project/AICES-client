import { Button, Space, Table, Tag, Tooltip, Popconfirm, Avatar } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { User } from "../../../../types/user.types";

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
    { title: "ID", dataIndex: "userId", width: 80 },
    {
      title: "",
      dataIndex: "avatarUrl",
      width: 56,
      render: (url: string, record) => (
        <Avatar src={url} alt={record.fullName || record.email} size="small">
          {(record.fullName || record.email)?.charAt(0).toUpperCase()}
        </Avatar>
      ),
    },

    { title: "Email", dataIndex: "email" },
    {
      title: "Full name",
      dataIndex: "fullName",
      render: (v: string | null) => v || "—",
    },
    {
      title: "Role",
      dataIndex: "roleName",
      width: 160,
      render: (r: string) => <Tag>{r}</Tag>,
    },
    
    {
      title: "Status",
      dataIndex: "userStatus",
      width: 120,
      render: (status: User["userStatus"]) => {
        let color: string = "default";
        if (status === "Verified") color = "green";
        else if (status === "Unverified") color = "orange";
        else if (status === "Locked") color = "red";

        return <Tag color={color}>{status}</Tag>;
      },
    },

    {
      title: "Actions",
      key: "actions",
      width: 320,
      render: (_, record) => (
        <Space>
          {/* View */}
          <Tooltip title="View details">
            <Button icon={<EyeOutlined />} onClick={() => onViewDetail(record)}>
              View
            </Button>
          </Tooltip>

          {/* Edit */}
          <Tooltip title="Edit user">
            <Button icon={<EditOutlined />} onClick={() => onEdit(record)}>
              Edit
            </Button>
          </Tooltip>

          {/* Lock / Unlock */}
          {record.userStatus !== "Locked" ? (
            <Tooltip title="Lock user">
              <Button danger onClick={() => onChangeStatus(record, "Locked")}>
                Lock
              </Button>
            </Tooltip>
          ) : (
            <Tooltip title="Unlock user">
              <Button onClick={() => onChangeStatus(record, "Verified")}>
                Unlock
              </Button>
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
              <Button icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table<User>
      rowKey="userId"
      loading={loading}
      dataSource={data}
      columns={columns}
      pagination={pagination}
      onChange={(p) => onChangePage(p)}
    />
  );
}
