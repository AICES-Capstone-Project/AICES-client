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
    showSizeChanger: true,
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSpecialization, setEditingSpecialization] =
    useState<Specialization | null>(null);
  const [form] = Form.useForm();

  const fetchData = async (page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
    setLoading(true);
    try {
      const response = await specializationService.getSpecializationsSystem({
      page: 1,
      pageSize: 1000,
      });

      const apiRes = response.data;

      if (apiRes.status !== "Success" || !apiRes.data) {
        message.error(
          apiRes.message || "Failed to load specializations. Please try again."
        );
        setSpecializations([]);
        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize,
        }));
        return;
      }

      // apiRes.data có thể là mảng hoặc object { specializations: [] }
      const payload = apiRes.data as any;
      const list: Specialization[] = Array.isArray(payload)
        ? payload
        : payload.specializations ?? [];

      setSpecializations(list);
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize,
      }));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      message.error("Failed to load specializations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(
      pagination.current || 1,
      pagination.pageSize || DEFAULT_PAGE_SIZE
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTableChange = (pag: TablePaginationConfig) => {
    fetchData(pag.current, pag.pageSize);
  };

  const handleSearch = () => {
    fetchData(1, pagination.pageSize || DEFAULT_PAGE_SIZE);
  };

  const handleReset = () => {
    setKeyword("");
    fetchData(1, pagination.pageSize || DEFAULT_PAGE_SIZE);
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
    <div>
      <Card className="aices-card">
        {/* 🔥 TOP BAR CHUẨN SYSTEM */}
        <div className="company-header-row">
          <div className="company-left">
            <SpecializationToolbar
              keyword={keyword}
              onKeywordChange={setKeyword}
              onSearch={handleSearch}
              onReset={handleReset}
              onCreate={openCreateModal}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="accounts-table-wrapper">
          <SpecializationTable
            loading={loading}
            data={filteredSpecializations}
            pagination={{
              ...pagination,
              total: filteredSpecializations.length,
            }}
            onChangePage={handleTableChange}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </div>
      </Card>

      <SpecializationModal
        open={isModalVisible}
        form={form}
        editingSpecialization={editingSpecialization}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      />
    </div>
  );
}
