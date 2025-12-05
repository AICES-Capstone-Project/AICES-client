import { Button, Popconfirm, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import type { Skill } from "../../../../../types/skill.types";

interface SkillTableProps {
  loading: boolean;
  data: Skill[];
  pagination: TablePaginationConfig;
  onChangePage: (pagination: TablePaginationConfig) => void;
  onEdit: (record: Skill) => void;
  onDelete: (id: number) => void;
  formatDate: (value: string) => string;
}

export default function SkillTable({
  loading,
  data,
  pagination,
  onChangePage,
  onEdit,
  onDelete,
  formatDate,
}: SkillTableProps) {
  const columns: ColumnsType<Skill> = [
    {
      title: "ID",
      dataIndex: "skillId",
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
            title="Delete this skill?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onDelete(record.skillId)}
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
    <Table<Skill>
      rowKey="skillId"
      loading={loading}
      columns={columns}
      dataSource={data}
      pagination={pagination}
      onChange={(pag) => onChangePage(pag)}
      className="accounts-table"
    />
  );
}
