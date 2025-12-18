import { Button, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { EyeOutlined } from "@ant-design/icons";

import type { FeedbackEntity } from "../../../../types/feedback.types";

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
  formatDate,
}: FeedbackTableProps) {
  const columns: ColumnsType<FeedbackEntity> = [
    {
      title: "No.",
      key: "no",
      width: 90,
      align: "center",
      render: (_: any, __: any, index: number) => {
        const current = pagination.current ?? 1;
        const pageSize = pagination.pageSize ?? 10;
        return (current - 1) * pageSize + index + 1;
      },
    },

    {
      title: "User Name",
      dataIndex: "userName",
      render: (v) => <span style={{ fontWeight: 500 }}>{v}</span>,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      width: 120,
      align: "center",
      render: (v: number) => <span style={{ fontWeight: 600 }}>{v}/5</span>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      width: 220,
      render: (v: string) => formatDate(v),
    },
    {
      title: "Actions",
      key: "actions",
      width: 110,
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
