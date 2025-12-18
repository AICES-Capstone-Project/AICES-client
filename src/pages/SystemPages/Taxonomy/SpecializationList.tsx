import { useEffect, useMemo, useState } from "react";
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

  // ✅ raw list
  const [allSpecializations, setAllSpecializations] = useState<Specialization[]>(
    []
  );

  const [keyword, setKeyword] = useState("");
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    showSizeChanger: true,
    total: 0,
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSpecialization, setEditingSpecialization] =
    useState<Specialization | null>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
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
        setAllSpecializations([]);
        setPagination((prev) => ({ ...prev, total: 0 }));
        return;
      }

      const payload = apiRes.data as any;
      const list: Specialization[] = Array.isArray(payload)
        ? payload
        : payload.specializations ?? [];

      setAllSpecializations(list);
    } catch (error) {
      console.error(error);
      message.error("Failed to load specializations. Please try again.");
      setAllSpecializations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Realtime filter (FE)
  const filteredSpecializations = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return allSpecializations;

    return allSpecializations.filter((item) =>
      `${item.name ?? ""} ${item.categoryName ?? ""}`
        .toLowerCase()
        .includes(kw)
    );
  }, [allSpecializations, keyword]);

  // ✅ update total + reset về page 1 khi keyword đổi
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      current: 1,
      total: filteredSpecializations.length,
    }));
  }, [filteredSpecializations.length]);

  // ✅ FE paging (slice)
  const pagedSpecializations = useMemo(() => {
    const current = pagination.current || 1;
    const pageSize = pagination.pageSize || DEFAULT_PAGE_SIZE;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    return filteredSpecializations.slice(start, end);
  }, [filteredSpecializations, pagination.current, pagination.pageSize]);

  const handleTableChange = (pag: TablePaginationConfig) => {
    setPagination((prev) => ({
      ...prev,
      current: pag.current || 1,
      pageSize: pag.pageSize || DEFAULT_PAGE_SIZE,
    }));
  };

  const handleReset = () => {
    setKeyword("");
    setPagination((prev) => ({ ...prev, current: 1 }));
    // ✅ không cần fetch lại vì đã FE filter, trừ khi bạn muốn reload data mới
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
      await fetchData();
    } catch (error: any) {
      console.error("Failed to delete specialization", error);
      message.error(
        error?.response?.data?.message || "Failed to delete specialization."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        name: (values.name as string).trim(),
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
      await fetchData();
    } catch (error: any) {
      if (error?.errorFields) return;
      console.error("Failed to save specialization", error);
      message.error(
        error?.response?.data?.message || "Failed to save specialization."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingSpecialization(null);
    form.resetFields();
  };

  return (
    <div>
      <Card className="aices-card">
        <SpecializationToolbar
          keyword={keyword}
          onKeywordChange={setKeyword}
          onReset={handleReset}
          onCreate={openCreateModal}
        />

        <div className="accounts-table-wrapper">
          <SpecializationTable
            loading={loading}
            data={pagedSpecializations}
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
