// src/pages/SystemPages/Taxonomy/LevelList.tsx

import { useEffect, useState } from "react";
import { Card, Form, message } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";

import type { LevelEntity } from "../../../types/level.types";
import { levelSystemService } from "../../../services/levelService.system";

import LevelToolbar from "./components/level/LevelToolbar";
import LevelTable from "./components/level/LevelTable";
import LevelModal from "./components/level/LevelModal";

const DEFAULT_PAGE_SIZE = 10;

export interface LevelFormValues {
  name: string;
}

export default function LevelList() {
  const [levels, setLevels] = useState<LevelEntity[]>([]);
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
  const [editingLevel, setEditingLevel] = useState<LevelEntity | null>(null);

  const [form] = Form.useForm<LevelFormValues>();

  const fetchData = async (page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
    try {
      setLoading(true);

      const response = await levelSystemService.getLevels({ page, pageSize });
      const apiRes = response.data;

      if (apiRes.status !== "Success" || !apiRes.data) {
        message.error(apiRes.message || "Failed to load levels");
        setLevels([]);
        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize,
          total: 0,
        }));
        return;
      }

      const payload = apiRes.data; // { levels, totalPages, currentPage, pageSize, totalCount }

      setLevels(payload.levels || []);
      setPagination({
        current: payload.currentPage ?? page,
        pageSize: payload.pageSize ?? pageSize,
        total: payload.totalCount ?? 0, // ✅ quan trọng để có page 2/3
        showSizeChanger: true,
      });
    } catch (err: any) {
      console.error(err);
      message.error("Failed to load levels");
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
    setEditingLevel(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (record: LevelEntity) => {
    setEditingLevel(record);
    form.setFieldsValue({ name: record.name });
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setEditingLevel(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const values = await form.validateFields();
      const name = (values.name || "").trim();

      if (!name) {
        message.error("Level name is required.");
        return;
      }

      if (editingLevel) {
        await levelSystemService.updateLevel(editingLevel.levelId, { name });
        message.success("Level updated successfully.");
      } else {
        await levelSystemService.createLevel({ name });
        message.success("Level created successfully.");
      }

      setIsModalOpen(false);
      setEditingLevel(null);
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
      await levelSystemService.deleteLevel(id);
      message.success("Level deleted successfully.");

      fetchData(
        pagination.current || 1,
        pagination.pageSize || DEFAULT_PAGE_SIZE
      );
    } catch (error) {
      console.error(error);
      message.error("Failed to delete level. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = levels.filter((item) =>
    (item.name ?? "").toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div>
      <Card className="aices-card">
        <LevelToolbar
          keyword={keyword}
          onKeywordChange={setKeyword}
          onReset={() => setKeyword("")}
          onCreate={openCreateModal}
        />

        <div className="accounts-table-wrapper">
          <LevelTable
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

      <LevelModal
        open={isModalOpen}
        form={form}
        editingLevel={editingLevel}
        submitting={submitting}
        onCancel={handleModalCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
