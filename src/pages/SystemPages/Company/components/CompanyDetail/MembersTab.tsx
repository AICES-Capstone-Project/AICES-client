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
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#f0f0f0",
            }}
          />
        ),
    },
    { title: "User ID", dataIndex: "userId", width: 90 },
    {
      title: "Name",
      dataIndex: "fullName",
      render: (v: string | null) => v || "—",
    },
    { title: "Email", dataIndex: "email" },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      width: 140,
      render: (v?: string | null) => v || "—",
    },
    { title: "Role", dataIndex: "roleName", width: 160 },
    {
      title: "Status",
      dataIndex: "joinStatus",
      width: 120,
      render: (s: string) => {
        const color =
          s === "Approved" ? "green" : s === "Pending" ? "gold" : "red";
        return <Tag color={color}>{s}</Tag>;
      },
    },
    {
      title: "Joined At",
      dataIndex: "createdAt",
      width: 200,
      render: (v?: string) => (v ? new Date(v).toLocaleString() : "—"),
    },
  ];

  return (
    <Card>
      <Table<CompanyMember>
        rowKey="comUserId"
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
