import { Button, Popconfirm, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import type { LanguageEntity } from "../../../../../types/language.types";

interface LanguageTableProps {
  loading: boolean;
  data: LanguageEntity[];
  pagination: TablePaginationConfig;
  onChangePage: (pagination: TablePaginationConfig) => void;
  onEdit: (record: LanguageEntity) => void;
  onDelete: (id: number) => void;
  formatDate: (value: string) => string;
}

export default function LanguageTable({
  loading,
  data,
  pagination,
  onChangePage,
  onEdit,
  onDelete,
  formatDate,
}: LanguageTableProps) {
  const columns: ColumnsType<LanguageEntity> = [
    {
      title: "ID",
      dataIndex: "languageId",
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
            title="Delete this language?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onDelete(record.languageId)}
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
    <Table<LanguageEntity>
      rowKey="languageId"
      loading={loading}
      columns={columns}
      dataSource={data}
      pagination={pagination}
      onChange={(pag) => onChangePage(pag)}
      className="accounts-table"
    />
  );
}
