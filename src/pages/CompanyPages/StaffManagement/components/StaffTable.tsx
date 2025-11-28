import React from "react";
import { Table, Tag, Space, Button, Empty, Avatar, Modal } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { companyService } from "../../../../services/companyService";
import type { ColumnsType } from "antd/es/table";
import type { CompanyMember } from "../../../../types/company.types";
import { toastSuccess, toastError } from "../../../../components/UI/Toast";

type Props = {
  members: CompanyMember[];
  loading: boolean;
  onView: (m: CompanyMember) => void;
  onEdit: (m: CompanyMember) => void;
  onDelete: (m: CompanyMember) => void;
  onChangeStatus?: (m: CompanyMember, status: string) => void;
};

const StaffTable: React.FC<Props> = ({ members, loading, onDelete }) => {
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
            <Button
              size="small"
              className="company-btn--filled"
              onClick={() => {
                Modal.confirm({
                  title: "Remove Member",
                  content: `Are you sure you want to remove ${record.fullName || record.email} from the company?`,
                  okText: "Remove",
                  okButtonProps: { danger: true },
                  onOk: async () => {
                    try {
                      const res = await companyService.deleteMember(record.comUserId);
                      if (String(res?.status).toLowerCase() === "success") {
                        Modal.destroyAll();
                        toastSuccess("Member removed successfully");
                        if (typeof onDelete === "function") onDelete(record);
                        setTimeout(() => {
                          try {
                            window.location.reload();
                          } catch (e) {
                            // ignore
                          }
                        }, 900);
                      } else {
                        Modal.destroyAll();
                        Modal.error({ title: "Failed", content: res?.message || "Failed to remove member" });
                      }
                    } catch (err) {
                      console.error(err);
                      Modal.destroyAll();
                      toastError("Failed to remove member");
                      Modal.error({ title: "Error", content: "An error occurred while removing member" });
                    }
                  },
                });
              }}
            >
              Remove
            </Button>
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
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No staff members found" />
        ),
      }}
      rowClassName={(_, index) => (index % 2 === 0 ? "table-row-light" : "table-row-dark")}
    />
  );
};

export default StaffTable;
