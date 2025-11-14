// src/pages/SystemPages/Taxonomy/SpecializationList.tsx

import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
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
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import type { Specialization } from "../../../types/specialization.types";
import { specializationService } from "../../../services/specializationService";

const { Title, Text } = Typography;

const DEFAULT_PAGE_SIZE = 10;

export default function SpecializationList() {
  const [loading, setLoading] = useState(false);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [keyword, setKeyword] = useState("");
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20", "50"],
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSpecialization, setEditingSpecialization] =
    useState<Specialization | null>(null);
  const [form] = Form.useForm();

  const fetchData = async (
    page = pagination.current || 1,
    pageSize = pagination.pageSize || DEFAULT_PAGE_SIZE
  ) => {
    try {
      setLoading(true);

      const response = await specializationService.getSpecializations({
        page,
        pageSize,
        keyword: keyword || undefined,
      });

      const { data } = response.data;
      const list = data?.specializations ?? [];
      const total =
        typeof data?.totalCount === "number"
          ? data.totalCount
          : list.length;

      setSpecializations(list);
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize,
        total,
      }));
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error("Failed to fetch specializations", error);
      const msg =
        error?.response?.data?.message ||
        "Failed to fetch specializations.";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTableChange = (pag: TablePaginationConfig) => {
    fetchData(pag.current, pag.pageSize);
  };

  const handleSearch = () => {
    fetchData(1, pagination.pageSize);
  };

  const handleReset = () => {
    setKeyword("");
    fetchData(1, DEFAULT_PAGE_SIZE);
  };

  const openCreateModal = () => {
    setEditingSpecialization(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const openEditModal = (record: Specialization) => {
    setEditingSpecialization(record);
    form.setFieldsValue({
      name: record.name,
      categoryId: record.categoryId,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (record: Specialization) => {
    try {
      setLoading(true);
      await specializationService.delete(record.specializationId);
      message.success("Specialization deleted successfully.");
      fetchData(
        pagination.current || 1,
        pagination.pageSize || DEFAULT_PAGE_SIZE
      );
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error("Failed to delete specialization", error);
      const msg =
        error?.response?.data?.message ||
        "Failed to delete specialization.";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        name: values.name as string,
        categoryId: Number(values.categoryId),
      };

      setLoading(true);

      if (editingSpecialization) {
        await specializationService.update(
          editingSpecialization.specializationId,
          payload
        );
        message.success("Specialization updated successfully.");
      } else {
        await specializationService.create(payload);
        message.success("Specialization created successfully.");
      }

      setIsModalVisible(false);
      setEditingSpecialization(null);
      form.resetFields();
      fetchData(
        pagination.current || 1,
        pagination.pageSize || DEFAULT_PAGE_SIZE
      );
    } catch (error: any) {
      if (error?.errorFields) return; // validate fail

      // eslint-disable-next-line no-console
      console.error("Failed to save specialization", error);
      const msg =
        error?.response?.data?.message ||
        "Failed to save specialization.";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingSpecialization(null);
    form.resetFields();
  };

  const columns: ColumnsType<Specialization> = [
    {
      title: "ID",
      dataIndex: "specializationId",
      key: "specializationId",
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
      ellipsis: true,
    },
    {
      title: "Category ID",
      dataIndex: "categoryId",
      key: "categoryId",
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 120,
      render: (value: boolean) =>
        value ? (
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
        value ? new Date(value).toLocaleString() : "-",
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Are you sure to delete this specialization?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Space
        style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}
      >
        <div>
          <Title level={4} style={{ marginBottom: 0 }}>
            Specializations
          </Title>
          <Text type="secondary">
            Manage specialization taxonomy used by skills and jobs.
          </Text>
        </div>

        <Space>
          <Input
            placeholder="Search by name or category..."
            allowClear
            prefix={<SearchOutlined />}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 260 }}
          />
          <Button icon={<SearchOutlined />} onClick={handleSearch}>
            Search
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Reset
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
          >
            New Specialization
          </Button>
        </Space>
      </Space>

      <Table<Specialization>
        rowKey="specializationId"
        loading={loading}
        columns={columns}
        dataSource={specializations}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: 900 }}
      />

      <Modal
        title={
          editingSpecialization
            ? "Edit Specialization"
            : "Create Specialization"
        }
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Save"
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ name: "", categoryId: undefined }}
        >
          <Form.Item
            name="name"
            label="Specialization Name"
            rules={[
              { required: true, message: "Name is required" },
              { max: 255, message: "Max 255 characters" },
            ]}
          >
            <Input placeholder="e.g. Backend Development" />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Category ID"
            rules={[
              { required: true, message: "Category ID is required" },
              { type: "number", min: 1, message: "Category ID must be > 0" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} placeholder="Enter category ID" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
