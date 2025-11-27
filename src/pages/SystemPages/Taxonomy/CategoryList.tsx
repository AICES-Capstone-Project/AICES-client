import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import { categoryService } from "../../../services/categoryService";
import type { Category } from "../../../types/category.types";

const { Search } = Input;

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form] = Form.useForm();

  const fetchData = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);

      const res = await categoryService.getAllSystem({
        page,
        pageSize,
        // keyword, // nếu sau này muốn search server-side thì bật
      });

      const payload = res.data;

      // res.data có thể null → check trước
      if (!payload) {
        setCategories([]);
        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize,
          total: 0,
        }));
        return;
      }

      setCategories(payload.categories);
      setPagination({
        current: payload.currentPage,
        pageSize: payload.pageSize,
        total: payload.totalPages * payload.pageSize,
      });
    } catch (err: any) {
      console.error(err);
      message.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, pagination.pageSize || 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTableChange = (pag: TablePaginationConfig) => {
    const current = pag.current || 1;
    const size = pag.pageSize || 10;
    setPagination((prev) => ({ ...prev, current, pageSize: size }));
    fetchData(current, size);
  };

  const openCreateModal = () => {
    setEditing(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (record: Category) => {
    setEditing(record);
    form.setFieldsValue({ name: record.name });
    setIsModalOpen(true);
  };

  const handleDelete = (record: Category) => {
    Modal.confirm({
      title: "Deactivate this category?",
      content: `Category: "${record.name}" sẽ bị deactivate.`,
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          await categoryService.remove(record.categoryId);

          message.success("Category deactivated successfully");
          fetchData(pagination.current || 1, pagination.pageSize || 10);
        } catch (err: any) {
          console.error(err);
          message.error("Failed to deactivate category");
        }
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editing) {
        await categoryService.update(editing.categoryId, {
          name: values.name,
        });
        message.success("Category updated successfully");
      } else {
        await categoryService.create({
          name: values.name,
        });
        message.success("Category created successfully");
      }

      setIsModalOpen(false);
      form.resetFields();
      fetchData(pagination.current || 1, pagination.pageSize || 10);
    } catch (err: any) {
      if (err?.response?.data?.message) {
        message.error(err.response.data.message);
      }
      // nếu là error validate của antd thì k làm gì thêm
    }
  };

  const filteredData = categories.filter((item) =>
    item.name.toLowerCase().includes(keyword.toLowerCase())
  );

  const columns: ColumnsType<Category> = [
    {
      title: "ID",
      dataIndex: "categoryId",
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      width: 120,
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
      width: 200,
      render: (value: string) =>
        value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "-",
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            Edit
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Deactivate
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Categories"
      extra={
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() =>
              fetchData(pagination.current || 1, pagination.pageSize || 10)
            }
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
          >
            Add Category
          </Button>
        </Space>
      }
    >
      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        <Search
          placeholder="Search by name..."
          allowClear
          onChange={(e) => setKeyword(e.target.value)}
          style={{ maxWidth: 320 }}
        />
      </div>

      <Table<Category>
        rowKey="categoryId"
        loading={loading}
        dataSource={filteredData}
        columns={columns}
        pagination={pagination}
        onChange={handleTableChange}
      />

      <Modal
        open={isModalOpen}
        title={editing ? "Edit Category" : "Create Category"}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please enter category name" },
              { max: 255, message: "Max length is 255 characters" },
            ]}
          >
            <Input placeholder="Ex: Software Development" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
