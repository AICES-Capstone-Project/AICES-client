import { useEffect, useState } from "react";
import { Card, Form, Typography, message } from "antd";
import type { TablePaginationConfig } from "antd/es/table";

import type { RecruitmentType } from "../../../types/recruitmentType.types";
import { recruitmentTypeService } from "../../../services/recruitmentTypeService";

import RecruitmentTypeToolbar from "./components/recruitment-type/RecruitmentTypeToolbar";
import RecruitmentTypeTable from "./components/recruitment-type/RecruitmentTypeTable";
import RecruitmentTypeModal from "./components/recruitment-type/RecruitmentTypeModal";

const { Title, Text } = Typography;

const DEFAULT_PAGE_SIZE = 10;

export default function RecruitmentTypeList() {
  const [loading, setLoading] = useState(false);
  const [recruitmentTypes, setRecruitmentTypes] = useState<RecruitmentType[]>(
    []
  );
  const [keyword, setKeyword] = useState("");
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RecruitmentType | null>(null);
  const [form] = Form.useForm();

  const fetchData = async (
    page: number = 1,
    pageSize: number = DEFAULT_PAGE_SIZE,
    searchKeyword: string = keyword
  ) => {
    try {
      setLoading(true);
      const { items, total } = await recruitmentTypeService.getAll({
        page,
        pageSize,
        keyword: searchKeyword || undefined,
      });

      setRecruitmentTypes(items);
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize,
        total,
      }));
    } catch (error: any) {
      message.error(
        error?.response?.data?.message ||
          "Failed to load recruitment types. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, DEFAULT_PAGE_SIZE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTableChange = (pag: TablePaginationConfig) => {
    fetchData(pag.current || 1, pag.pageSize || DEFAULT_PAGE_SIZE);
  };

  const handleSearch = (value: string) => {
    const trimmed = value.trim();
    setKeyword(trimmed);
    fetchData(1, pagination.pageSize || DEFAULT_PAGE_SIZE, trimmed);
  };

  const handleReset = () => {
    setKeyword("");
    fetchData(1, DEFAULT_PAGE_SIZE, "");
  };

  const openCreateModal = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (record: RecruitmentType) => {
    setEditingItem(record);
    form.setFieldsValue({ name: record.name });
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingItem) {
        await recruitmentTypeService.update(editingItem.recruitmentTypeId, {
          name: values.name.trim(),
        });
        message.success("Recruitment type updated successfully.");
      } else {
        await recruitmentTypeService.create({
          name: values.name.trim(),
        });
        message.success("Recruitment type created successfully.");
      }

      setIsModalOpen(false);
      setEditingItem(null);
      form.resetFields();
      fetchData(
        pagination.current || 1,
        pagination.pageSize || DEFAULT_PAGE_SIZE
      );
    } catch (error: any) {
      if (error?.errorFields) return; // lỗi form, không show toast API

      message.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await recruitmentTypeService.remove(id);
      message.success("Recruitment type deleted successfully.");
      fetchData(
        pagination.current || 1,
        pagination.pageSize || DEFAULT_PAGE_SIZE
      );
    } catch (error: any) {
      message.error(
        error?.response?.data?.message ||
          "Failed to delete recruitment type. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Recruitment Types
          </Title>
          <Text type="secondary">
            Manage employment types used in job postings (Full-time, Part-time,
            Contract, Temporary, etc.).
          </Text>
        </div>
      }
      extra={
        <RecruitmentTypeToolbar
          keyword={keyword}
          onKeywordChange={setKeyword}
          onSearch={handleSearch}
          onReset={handleReset}
          onCreate={openCreateModal}
        />
      }
    >
      <RecruitmentTypeTable
        loading={loading}
        data={recruitmentTypes}
        pagination={pagination}
        onChangePage={handleTableChange}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      <RecruitmentTypeModal
        open={isModalOpen}
        form={form}
        editingItem={editingItem}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingItem(null);
          form.resetFields();
        }}
        onOk={handleModalOk}
      />
    </Card>
  );
}
