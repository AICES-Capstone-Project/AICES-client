// src/pages/SystemPages/Taxonomy/LanguageList.tsx

import { useEffect, useState } from "react";
import { Card, Form, message } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";

import type { LanguageEntity } from "../../../types/language.types";
import { languageSystemService } from "../../../services/languageService.system";

import LanguageToolbar from "./components/language/LanguageToolbar";
import LanguageTable from "./components/language/LanguageTable";
import LanguageModal from "./components/language/LanguageModal";
import type { LanguageFormValues } from "./components/language/LanguageModal";

const DEFAULT_PAGE_SIZE = 10;

export default function LanguageList() {
  const [languages, setLanguages] = useState<LanguageEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    showSizeChanger: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<LanguageEntity | null>(
    null
  );

  const [form] = Form.useForm<LanguageFormValues>();

  const fetchData = async (page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
    try {
      setLoading(true);

      const response = await languageSystemService.getLanguages({
        page,
        pageSize,
      });

      const apiRes = response.data;

      if (apiRes.status !== "Success" || !apiRes.data) {
        message.error(
          apiRes.message || "Failed to load languages. Please try again."
        );
        setLanguages([]);
        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize,
          total: 0,
        }));
        return;
      }

      const payload = apiRes.data; // { languages, currentPage, pageSize, totalCount }

      setLanguages(payload.languages || []);
      setPagination({
        current: payload.currentPage ?? page,
        pageSize: payload.pageSize ?? pageSize,
        total: payload.totalCount ?? 0, // ✅ QUAN TRỌNG
        showSizeChanger: true,
      });
    } catch (error) {
      console.error(error);
      message.error("Failed to load languages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, pagination.pageSize || DEFAULT_PAGE_SIZE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTableChange = (pag: TablePaginationConfig) => {
    const current = pag.current || 1;
    const size = pag.pageSize || DEFAULT_PAGE_SIZE;

    setPagination((prev) => ({ ...prev, current, pageSize: size }));
    fetchData(current, size);
  };

  const openCreateModal = () => {
    setEditingLanguage(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (record: LanguageEntity) => {
    setEditingLanguage(record);
    form.setFieldsValue({ name: record.name });
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setEditingLanguage(null);
    form.resetFields();
  };

  const handleSubmit = async (values: LanguageFormValues) => {
    setSubmitting(true);
    try {
      const name = values.name.trim();

      if (!name) {
        message.error("Language name is required.");
        return;
      }

      if (editingLanguage) {
        await languageSystemService.updateLanguage(editingLanguage.languageId, {
          name,
        });
        message.success("Language updated successfully.");
      } else {
        await languageSystemService.createLanguage({ name });
        message.success("Language created successfully.");
      }

      setIsModalOpen(false);
      setEditingLanguage(null);
      form.resetFields();

      fetchData(
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
      await languageSystemService.deleteLanguage(id);
      message.success("Language deleted successfully.");
      fetchData(
        pagination.current || 1,
        pagination.pageSize || DEFAULT_PAGE_SIZE
      );
    } catch (error) {
      console.error(error);
      message.error("Failed to delete language. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = languages.filter((item) =>
    (item.name ?? "").toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div>
      <Card className="aices-card">
        <LanguageToolbar
          keyword={keyword}
          onKeywordChange={setKeyword}
          onReset={() => setKeyword("")}
          onCreate={openCreateModal}
        />

        <div className="accounts-table-wrapper">
          <LanguageTable
            loading={loading}
            data={filteredData}
            pagination={pagination}
            onChangePage={handleTableChange}
            onEdit={openEditModal}
            onDelete={handleDelete}
            formatDate={(value: string) =>
              value ? dayjs(value).format("YYYY-MM-DD HH:mm") : "-"
            }
          />
        </div>
      </Card>

      <LanguageModal
        open={isModalOpen}
        form={form}
        editingLanguage={editingLanguage}
        submitting={submitting}
        onCancel={handleModalCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
