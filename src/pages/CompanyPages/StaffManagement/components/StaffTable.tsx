import React, { useEffect, useState, useMemo } from "react";
import { Table, Tag, Space, Button, Empty, Avatar, Modal, Tooltip } from "antd";
import { UserOutlined, UserDeleteOutlined } from "@ant-design/icons";
import { companyService } from "../../../../services/companyService";
import type { ColumnsType } from "antd/es/table";
import type { CompanyMember } from "../../../../types/company.types";
import {toastError } from "../../../../components/UI/Toast";
import { LockKeyhole } from "lucide-react";

type Props = {
  members: CompanyMember[];
  loading: boolean;
  onDelete: (m: CompanyMember) => void;
  onChangeStatus?: (m: CompanyMember, status: string) => void;
};

const StaffTable: React.FC<Props> = ({ members, loading, onDelete }) => {
  const [tableHeight, setTableHeight] = useState<number | undefined>(undefined);
  const iconStyle = { color: "var(--color-primary-medium)", fontWeight: "bold" };

  useEffect(() => {
    const calculate = () => {
      const reserved = 220; // space for header/paddings/actions
      const h = window.innerHeight - reserved;
      setTableHeight(h > 300 ? h : 300);
    };
    calculate();
    window.addEventListener('resize', calculate);
    return () => window.removeEventListener('resize', calculate);
  }, []);
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
      width: "5%",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Member",
      key: "member",
      align: "center",
      width: "30%",
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
      width: "17%",
      align: "center",
      render: (email: string) => <div style={{ textAlign: "center", fontSize: 13, color: "#333" }}>{email}</div>,
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: "12%",
      align: "center",
      render: (phoneNumber: string) => <div style={{ textAlign: "center", fontSize: 13, color: "#333" }}>{phoneNumber}</div>,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: "20%",
      align: "center",
      render: (address: string) => <div style={{ textAlign: "center", fontSize: 13, color: "#333" }}>{address}</div>,
    },
    {
      title: "Role",
      dataIndex: "roleName",
      key: "roleName",
      width: "9%",
      align: "center",
      render: (roleName) => (
        <Tag color={getRoleColor(roleName)}>{formatRoleName(roleName)}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: "7%",
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          {record.roleName?.toLowerCase() === "hr_manager" ? (
            <Tooltip title="This function is locked."><LockKeyhole size={18} style={iconStyle}/></Tooltip>
          ) : (
            <Tooltip title="Delete member.">
            <Button
              type="text"
              icon={<UserDeleteOutlined  style={{ color: '#ff4d4f', fontSize: 16 }} />}
              onClick={() => {
                Modal.confirm({
                  className: 'ant-confirm-spread',
                  wrapClassName: "custom-confirm-wrapper",
                  title: null,
                  icon: null,
                  content: (
                    <div style={{ textAlign: "center", fontSize: 16, marginBottom: 16 }}>
                      Are you sure you want to remove <strong>{record.fullName || record.email}</strong> from the company?
                    </div>
                  ),
                  okText: "Remove",
                  okButtonProps: { danger: true },
                  cancelText: "Cancel",
                  // Tùy chỉnh footer để căn button 2 đầu
                  footer: (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Button className="company-btn" onClick={() => Modal.destroyAll()}>Cancel</Button>
                      <Button
                        type="primary"
                        className="company-btn--danger"
                        danger
                        onClick={async () => {
                          try {
                            const res = await companyService.deleteMember(record.comUserId);
                            if (String(res?.status).toLowerCase() === "success") {
                              Modal.destroyAll();
                              if (typeof onDelete === "function") onDelete(record);
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
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ),
                });
              }}
            />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const bodyScroll = tableHeight ? Math.max(tableHeight - 140, 300) : undefined;

  // Ensure HR Manager(s) always appear first in the table
  const sortedMembers = useMemo(() => {
    if (!members || members.length === 0) return members;
    return [...members].sort((a, b) => {
      const aIsManager = String(a.roleName || "").toLowerCase() === "hr_manager";
      const bIsManager = String(b.roleName || "").toLowerCase() === "hr_manager";
      if (aIsManager === bIsManager) return 0;
      return aIsManager ? -1 : 1;
    });
  }, [members]);

  return (
    <div style={{ height: tableHeight, display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Table<CompanyMember>
        columns={columns}
        dataSource={sortedMembers}
        loading={loading}
        rowKey="userId"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          total: sortedMembers.length,
          showTotal: (total) => `Total ${total} members`,
        }}
        scroll={{ x: 1000, y: bodyScroll }}
        style={{ flex: 1 }}
        locale={{
          emptyText: (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No staff members found" />
          ),
        }}
        rowClassName={(_, index) => (index % 2 === 0 ? "table-row-light" : "table-row-dark")}
      />
    </div>
  );
};

export default StaffTable;
