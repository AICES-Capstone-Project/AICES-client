import { Avatar, Button, Space, Table, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { EyeOutlined } from "@ant-design/icons";

import type { FeedbackEntity } from "../../../../types/feedback.types";

const { Text } = Typography;

interface FeedbackTableProps {
  loading: boolean;
  data: FeedbackEntity[];
  pagination: TablePaginationConfig;
  onChangePage: (pagination: TablePaginationConfig) => void;
  onView: (record: FeedbackEntity) => void;
  formatDate: (value: string) => string;
}

export default function FeedbackTable({
  loading,
  data,
  pagination,
  onChangePage,
  onView,
}: FeedbackTableProps) {
  const columns: ColumnsType<FeedbackEntity> = [
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

    // ===== USER =====
    {
      title: "User",
      key: "user",
      render: (_, r) => (
        <Space>
          <Avatar src={r.userAvatarUrl ?? undefined}>
            {(r.userFullName || r.userName || "?").charAt(0).toUpperCase()}
          </Avatar>

          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontWeight: 600 }}>
              {r.userFullName || r.userName}
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {r.userEmail}
            </Text>
          </div>
        </Space>
      ),
    },

    // ===== COMPANY =====
    {
      title: "Company",
      key: "company",
      render: (_, r) => (
        <Space>
          <Avatar shape="square" src={r.companyLogoUrl ?? undefined}>
            {(r.companyName || "?").charAt(0).toUpperCase()}
          </Avatar>

          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontWeight: 600 }}>{r.companyName}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              ID: {r.companyId}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      width: 110,
      align: "center",
      render: (v: number) => <span style={{ fontWeight: 600 }}>{v}/5</span>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 90,
      align: "center",
      render: (_, record) => (
        <Button
          shape="circle"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => onView(record)}
        />
      ),
    },
  ];

  return (
    <Table<FeedbackEntity>
      rowKey="feedbackId"
      loading={loading}
      columns={columns}
      dataSource={data}
      pagination={pagination}
      onChange={(pag) => onChangePage(pag)}
      className="accounts-table"
    />
  );
}
