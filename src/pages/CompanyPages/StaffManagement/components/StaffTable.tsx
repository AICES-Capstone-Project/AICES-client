import React from "react";
import { Table, Tag, Space, Tooltip, Button, Empty, Avatar } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { CompanyMember } from "../../../../types/company.types";

type Props = {
  members: CompanyMember[];
  loading: boolean;
  onView: (m: CompanyMember) => void;
  onEdit: (m: CompanyMember) => void;
  onDelete: (m: CompanyMember) => void;
};

const StaffTable: React.FC<Props> = ({ members, loading, onView, onEdit, onDelete }) => {
  const getRoleColor = (roleName: string) => {
    switch (roleName?.toLowerCase()) {
      case "hr_manager":
        return "red";
      case "hr_recruiter":
        return "blue";
      default:
        return "default";
    }
  };

  const formatRoleName = (roleName: string) => {
    return roleName?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || roleName;
  };

  const columns: ColumnsType<CompanyMember> = [
    {
      title: "No",
      key: "no",
      align: "center",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Member",
      key: "member",
      align: "center",
      width: 200,
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <div style={{ width: 56, display: "flex", justifyContent: "center" }}>
            <Avatar src={record.avatarUrl} icon={<UserOutlined />} size={40} />
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontWeight: 500 }}>{record.fullName || "No Name"}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 260,
      align: "center",
      render: (email: string) => <div style={{ textAlign: "center", fontSize: 13, color: "#333" }}>{email}</div>,
    },
    {
      title: "Role",
      dataIndex: "roleName",
      key: "roleName",
      width: 275,
      align: "center",
      render: (roleName) => (
        <Tag color={getRoleColor(roleName)}>{formatRoleName(roleName)}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button type="text" icon={<EyeOutlined />} size="small" onClick={() => onView(record)} />
          </Tooltip>
          <Tooltip title="Edit Member">
            <Button type="text" icon={<EditOutlined />} size="small" onClick={() => onEdit(record)} />
          </Tooltip>
          <Tooltip title="Remove Member">
            <Button type="text" icon={<DeleteOutlined />} size="small" danger onClick={() => onDelete(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table<CompanyMember>
      columns={columns}
      dataSource={members}
      loading={loading}
      rowKey="userId"
      pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true }}
      scroll={{ x: 1000 }}
      locale={{
        emptyText: (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No staff members found">
            <Button type="primary">Invite Your First Staff Member</Button>
          </Empty>
        ),
      }}
      rowClassName={(_, index) => (index % 2 === 0 ? "table-row-light" : "table-row-dark")}
    />
  );
};

export default StaffTable;
