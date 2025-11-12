import React from "react";
import { Table, Tag, Space, Button, Empty, Avatar, Select, Modal } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { CompanyMember } from "../../../../types/company.types";

type Props = {
  members: CompanyMember[];
  loading: boolean;
  onView: (m: CompanyMember) => void;
  onEdit: (m: CompanyMember) => void;
  onDelete: (m: CompanyMember) => void;
  onChangeStatus?: (m: CompanyMember, status: string) => void;
};

const StaffTable: React.FC<Props> = ({ members, loading, onChangeStatus }) => {
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
      title: "Status",
      key: "status",
      width: 180,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          {record.roleName?.toLowerCase() === "hr_manager" ? (
            <Tag color={record.joinStatus === "Approved" ? "green" : record.joinStatus === "Rejected" ? "red" : "gold"}>
              {record.joinStatus || "Approved"}
            </Tag>
          ) : (
            <Select
              value={record.joinStatus || "Pending"}
              onChange={(val) => {
                if (typeof val === "string" && typeof onChangeStatus === "function") {
                  Modal.confirm({
                    title: `Change status to ${val}?`,
                    content: `Are you sure you want to set this member to ${val}?`,
                    onOk: () => onChangeStatus(record, val),
                  });
                }
              }}
              options={[
                { value: "Approved", label: "Approved" },
                { value: "Rejected", label: "Rejected" },
              ]}
              size="small"
              style={{ width: 120 }}
            />
          )}
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
