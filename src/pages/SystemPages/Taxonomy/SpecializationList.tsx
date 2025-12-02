import { useEffect, useState } from "react";
import { Card, Form, message } from "antd";
import type { TablePaginationConfig } from "antd/es/table";

import type { Specialization } from "../../../types/specialization.types";
import { specializationService } from "../../../services/specializationService";

import SpecializationToolbar from "./components/specialization/SpecializationToolbar";
import SpecializationTable from "./components/specialization/SpecializationTable";
import SpecializationModal from "./components/specialization/SpecializationModal";

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
    pageSize = pagination.pageSize || DEFAULT_PAGE_SIZE,
    currentKeyword = keyword
  ) => {
    try {
      setLoading(true);

      const response = await specializationService.getSpecializationsSystem({
        page,
        pageSize,
        keyword: currentKeyword || undefined,
      });

      const payload = response.data?.data;

      if (!payload) {
        setSpecializations([]);
        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize,
          total: 0,
        }));
        return;
      }

      const list = payload.specializations ?? [];
      const total =
        typeof payload.totalCount === "number"
          ? payload.totalCount
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
        error?.response?.data?.message || "Failed to fetch specializations.";
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
    fetchData(1, pagination.pageSize, keyword);
  };

  const handleReset = () => {
    setKeyword("");
    fetchData(1, DEFAULT_PAGE_SIZE, "");
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
        error?.response?.data?.message || "Failed to delete specialization.";
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
      if (error?.errorFields) return;

      // eslint-disable-next-line no-console
      console.error("Failed to save specialization", error);
      const msg =
        error?.response?.data?.message || "Failed to save specialization.";
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

  const filteredSpecializations = specializations.filter((item) =>
    `${item.name} ${item.categoryName || ""}`
      .toLowerCase()
      .includes(keyword.toLowerCase())
  );

  return (
    <Card>
      <SpecializationToolbar
        keyword={keyword}
        onKeywordChange={setKeyword}
        onSearch={handleSearch}
        onReset={handleReset}
        onCreate={openCreateModal}
      />

      <SpecializationTable
        loading={loading}
        data={filteredSpecializations}
        pagination={{
          ...pagination,
          total: filteredSpecializations.length, // tổng sau filter
        }}
        onChangePage={handleTableChange}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      <SpecializationModal
        open={isModalVisible}
        form={form}
        editingSpecialization={editingSpecialization}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      />
    </Card>
  );
}
