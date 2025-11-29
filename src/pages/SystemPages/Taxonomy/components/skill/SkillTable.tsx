import { Button, Popconfirm, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import type { Skill } from "../../../../../types/skill.types";
import SkillStatusTag from "./SkillStatusTag";

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
      key: "skillId",
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 140,
      render: (isActive: boolean) => <SkillStatusTag isActive={isActive} />,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 220,
      render: (value: string) => formatDate(value),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this skill?"
            description="This action cannot be undone."
            okText="Delete"
            okType="danger"
            onConfirm={() => onDelete(record.skillId)}
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
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
    />
  );
}
