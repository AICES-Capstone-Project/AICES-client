// src/pages/SystemPages/Taxonomy/RecruitmentTypeList.tsx

import { useEffect, useState } from "react";
import { Card, Form, message } from "antd";
import type { TablePaginationConfig } from "antd/es/table";

import type { RecruitmentType } from "../../../types/recruitmentType.types";
import { recruitmentTypeService } from "../../../services/recruitmentTypeService";

import RecruitmentTypeToolbar from "./components/recruitment-type/RecruitmentTypeToolbar";
import RecruitmentTypeTable from "./components/recruitment-type/RecruitmentTypeTable";
import RecruitmentTypeModal from "./components/recruitment-type/RecruitmentTypeModal";

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
    showSizeChanger: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RecruitmentType | null>(null);
  const [form] = Form.useForm();

  // ✅ giống pattern các file trước: page/pageSize + keyword
  const fetchData = async (
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    searchKeyword: string = keyword
  ) => {
    try {
      setLoading(true);

      const response = await recruitmentTypeService.getAll({
        page,
        pageSize,
        keyword: searchKeyword?.trim() ? searchKeyword.trim() : undefined,
      });

      const apiRes = response.data;

      if (apiRes.status !== "Success" || !apiRes.data) {
        message.error(apiRes.message || "Failed to load recruitment types");
        setRecruitmentTypes([]);
        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize,
          total: 0,
        }));
        return;
      }

      const payload = apiRes.data;

      // ✅ BE trả data.employmentTypes
      setRecruitmentTypes(payload.employmentTypes || []);

      setPagination((prev) => ({
        ...prev,
        current: payload.currentPage ?? page,
        pageSize: payload.pageSize ?? pageSize,
        total: payload.totalCount ?? 0,
        showSizeChanger: true,
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
    fetchData(1, DEFAULT_PAGE_SIZE, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTableChange = (pag: TablePaginationConfig) => {
    const current = pag.current || 1;
    const size = pag.pageSize || DEFAULT_PAGE_SIZE;

    setPagination((prev) => ({ ...prev, current, pageSize: size }));
    fetchData(current, size, keyword);
  };

  const handleSearch = (value: string) => {
    const trimmed = value.trim();
    setKeyword(trimmed);
    fetchData(1, pagination.pageSize || DEFAULT_PAGE_SIZE, trimmed);
  };

  const handleReset = () => {
    setKeyword("");
    fetchData(1, pagination.pageSize || DEFAULT_PAGE_SIZE, "");
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
      const name = (values.name || "").trim();

      if (!name) {
        message.error("Name is required.");
        return;
      }

      if (editingItem) {
        // ✅ type mới: employTypeId
        await recruitmentTypeService.update(editingItem.employTypeId, { name });
        message.success("Recruitment type updated successfully.");
      } else {
        await recruitmentTypeService.create({ name });
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
      if (error?.errorFields) return;
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

  // ✅ UI giữ nguyên: filter FE trong page hiện tại
  const filteredData = recruitmentTypes.filter((item) =>
    (item.name ?? "").toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div>
      <Card className="aices-card">
        <div className="company-header-row">
          <div className="company-left">
            <RecruitmentTypeToolbar
              keyword={keyword}
              onKeywordChange={setKeyword}
              onSearch={handleSearch}
              onReset={handleReset}
              onCreate={openCreateModal}
            />
          </div>
        </div>

        <div className="accounts-table-wrapper">
          <RecruitmentTypeTable
            loading={loading}
            data={filteredData}
            pagination={pagination}
            onChangePage={handleTableChange}
            onEdit={openEditModal}
            // ⚠️ nhớ truyền đúng id khi bấm delete ở Table: record.employTypeId
            onDelete={handleDelete}
          />
        </div>
      </Card>

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
    </div>
  );
}
