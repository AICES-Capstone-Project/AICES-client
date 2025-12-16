import { Button, Popconfirm, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import type { LevelEntity } from "../../../../../types/level.types";

interface LevelTableProps {
  loading: boolean;
  data: LevelEntity[];
  pagination: TablePaginationConfig;
  onChangePage: (pagination: TablePaginationConfig) => void;
  onEdit: (record: LevelEntity) => void;
  onDelete: (id: number) => void;
  formatDate: (value: string) => string;
}

export default function LevelTable({
  loading,
  data,
  pagination,
  onChangePage,
  onEdit,
  onDelete,
  formatDate,
}: LevelTableProps) {
  const columns: ColumnsType<LevelEntity> = [
    {
      title: "ID",
      dataIndex: "levelId",
      width: 80,
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (value) => <span style={{ fontWeight: 500 }}>{value}</span>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      width: 220,
      render: (value: string) => formatDate(value),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button
            shape="circle"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />

          <Popconfirm
            title="Delete this level?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onDelete(record.levelId)}
          >
            <Button
              shape="circle"
              size="small"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table<LevelEntity>
      rowKey="levelId"
      loading={loading}
      columns={columns}
      dataSource={data}
      pagination={pagination}
      onChange={(pag) => onChangePage(pag)}
      className="accounts-table"
    />
  );
}
