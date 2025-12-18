import { useEffect, useMemo, useState } from "react";
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

  // ✅ raw list
  const [allTypes, setAllTypes] = useState<RecruitmentType[]>([]);
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

  // ✅ fetch full list (FE search)
  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await recruitmentTypeService.getAll({
        page: 1,
        pageSize: 1000,
        keyword: undefined, // ✅ không search BE nữa
      });

      const apiRes = response.data;

      if (apiRes.status !== "Success" || !apiRes.data) {
        message.error(apiRes.message || "Failed to load recruitment types");
        setAllTypes([]);
        setPagination((prev) => ({ ...prev, total: 0 }));
        return;
      }

      const payload = apiRes.data;
      setAllTypes(payload.employmentTypes || []);
    } catch (error: any) {
      message.error(
        error?.response?.data?.message ||
          "Failed to load recruitment types. Please try again."
      );
      setAllTypes([]);
      setPagination((prev) => ({ ...prev, total: 0 }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ realtime filter (case-insensitive)
  const filteredTypes = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return allTypes;
    return allTypes.filter((t) => (t.name ?? "").toLowerCase().includes(kw));
  }, [allTypes, keyword]);

  // ✅ update total + reset về page 1 khi keyword đổi
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      current: 1,
      total: filteredTypes.length,
    }));
  }, [filteredTypes.length]);

  // ✅ FE paging slice
  const pagedTypes = useMemo(() => {
    const current = pagination.current || 1;
    const pageSize = pagination.pageSize || DEFAULT_PAGE_SIZE;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    return filteredTypes.slice(start, end);
  }, [filteredTypes, pagination.current, pagination.pageSize]);

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
        await recruitmentTypeService.update(editingItem.employTypeId, { name });
        message.success("Recruitment type updated successfully.");
      } else {
        await recruitmentTypeService.create({ name });
        message.success("Recruitment type created successfully.");
      }

      setIsModalOpen(false);
      setEditingItem(null);
      form.resetFields();
      await fetchData();
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
      await fetchData();
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
    <div>
      <Card className="aices-card">
        <div className="company-header-row">
          <div className="company-left">
            <RecruitmentTypeToolbar
              keyword={keyword}
              onKeywordChange={setKeyword}
              onReset={handleReset}
              onCreate={openCreateModal}
            />
          </div>
        </div>

        <div className="accounts-table-wrapper">
          <RecruitmentTypeTable
            loading={loading}
            data={pagedTypes}
            pagination={{
              ...pagination,
              total: filteredTypes.length,
            }}
            onChangePage={handleTableChange}
            onEdit={openEditModal}
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
