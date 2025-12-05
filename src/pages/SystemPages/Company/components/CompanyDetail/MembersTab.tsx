import { Card, Table, Tag } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

import type { CompanyMember } from "../../../../../types/company.types";

interface MembersTabProps {
  members: CompanyMember[];
  pagination: TablePaginationConfig;
  total: number;
  onChangePagination: (p: TablePaginationConfig) => void;
}

export default function MembersTab({
  members,
  pagination,
  total,
  onChangePagination,
}: MembersTabProps) {
  const renderJoinStatus = (s?: string | null) => {
    const status = (s || "").trim();
    if (!status) return "—";

    let cls = "status-tag";
    if (status === "Approved") cls += " status-tag-verified";
    else if (status === "Pending") cls += " status-tag-unverified";
    else cls += " status-tag-locked";

    return <Tag className={cls}>{status}</Tag>;
  };

  const memberCols: ColumnsType<CompanyMember> = [
    {
      title: "Avatar",
      dataIndex: "avatarUrl",
      width: 80,
      render: (url?: string | null) =>
        url ? (
          <img
            src={url}
            alt="avatar"
            className="accounts-user-avatar"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            className="accounts-user-avatar"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#f3f4f6",
            }}
          />
        ),
    },
    {
      title: "User ID",
      dataIndex: "userId",
      width: 90,
    },
    {
      title: "Name",
      dataIndex: "fullName",
      render: (v: string | null) => v || "—",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      width: 140,
      render: (v?: string | null) => v || "—",
    },
    {
      title: "Role",
      dataIndex: "roleName",
      width: 160,
      render: (v?: string | null) => v || "—",
    },
    {
      title: "Status",
      dataIndex: "joinStatus",
      width: 130,
      render: (s?: string) => renderJoinStatus(s),
    },
    {
      title: "Joined At",
      dataIndex: "createdAt",
      width: 200,
      render: (v?: string) => (v ? new Date(v).toLocaleString() : "—"),
    },
  ];

  return (
    <Card className="aices-card">
      <Table<CompanyMember>
        rowKey="comUserId"
        className="accounts-table"
        dataSource={members}
        columns={memberCols}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total,
          showSizeChanger: true,
        }}
        onChange={onChangePagination}
      />
    </Card>
  );
}
