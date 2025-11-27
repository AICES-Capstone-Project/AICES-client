// src/pages/SystemPages/Taxonomy/SkillList.tsx

import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import type { Skill } from "../../../types/skill.types";
import { skillService } from "../../../services/skillService";

const { Title, Text } = Typography;
const DEFAULT_PAGE_SIZE = 10;

interface SkillFormValues {
  name: string;
}

export default function SkillList() {
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    showSizeChanger: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const [form] = Form.useForm<SkillFormValues>();

  const fetchSkills = async (
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    currentKeyword = keyword
  ) => {
    setLoading(true);
    try {
      const response = await skillService.getSkillsSystem({
        page,
        pageSize,
        keyword: currentKeyword || undefined,
      });

      const data = response.data;

      // Ép về đúng Skill[] một cách an toàn
      const list: Skill[] = Array.isArray(data) ? data : [];

      setSkills(list);
      setTotal(list.length);

      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize,
      }));
    } catch (error) {
      console.error(error);
      message.error("Failed to load skills. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills(
      pagination.current || 1,
      pagination.pageSize || DEFAULT_PAGE_SIZE
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTableChange = (pag: TablePaginationConfig) => {
    fetchSkills(pag.current || 1, pag.pageSize || DEFAULT_PAGE_SIZE);
  };

  const handleSearch = () => {
    fetchSkills(1, pagination.pageSize || DEFAULT_PAGE_SIZE, keyword);
  };

  const handleResetSearch = () => {
    setKeyword("");
    fetchSkills(1, pagination.pageSize || DEFAULT_PAGE_SIZE, "");
  };

  const openCreateModal = () => {
    setEditingSkill(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (record: Skill) => {
    setEditingSkill(record);
    form.setFieldsValue({
      name: record.name,
    });
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
    form.resetFields();
  };

  const handleSubmit = async (values: SkillFormValues) => {
    setSubmitting(true);
    try {
      if (editingSkill) {
        await skillService.updateSkillSystem(editingSkill.skillId, {
          name: values.name.trim(),
        });
        message.success("Skill updated successfully.");
      } else {
        await skillService.createSkillSystem({
          name: values.name.trim(),
        });
        message.success("Skill created successfully.");
      }

      setIsModalOpen(false);
      setEditingSkill(null);
      form.resetFields();

      fetchSkills(
        pagination.current || 1,
        pagination.pageSize || DEFAULT_PAGE_SIZE
      );
    } catch (error) {
      console.error(error);
      message.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await skillService.deleteSkillSystem(id);
      message.success("Skill deleted successfully.");
      fetchSkills(
        pagination.current || 1,
        pagination.pageSize || DEFAULT_PAGE_SIZE
      );
    } catch (error) {
      console.error(error);
      message.error("Failed to delete skill. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
      render: (isActive: boolean) =>
        isActive ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 220,
      render: (value: string) =>
        value ? dayjs(value).format("YYYY-MM-DD HH:mm") : "-",
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEditModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this skill?"
            description="This action cannot be undone."
            okText="Delete"
            okType="danger"
            onConfirm={() => handleDelete(record.skillId)}
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
    <Card
      title={
        <Space
          style={{
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Skill Management
          </Title>
          <Space>
            <Input
              allowClear
              placeholder="Search by name..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onPressEnter={handleSearch}
              prefix={<SearchOutlined />}
              style={{ width: 260 }}
            />
            <Button onClick={handleResetSearch} icon={<ReloadOutlined />}>
              Reset
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateModal}
            >
              New Skill
            </Button>
          </Space>
        </Space>
      }
      extra={<Text type="secondary">Manage global skills taxonomy</Text>}
    >
      <Table<Skill>
        rowKey="skillId"
        loading={loading}
        columns={columns}
        dataSource={skills}
        pagination={{
          ...pagination,
          total,
        }}
        onChange={handleTableChange}
      />

      <Modal
        title={editingSkill ? "Edit Skill" : "Create Skill"}
        open={isModalOpen}
        onCancel={handleModalCancel}
        okText={editingSkill ? "Save changes" : "Create"}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          preserve={false}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please enter skill name" },
              { max: 200, message: "Name is too long" },
            ]}
          >
            <Input placeholder="e.g. Communication, Leadership" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
