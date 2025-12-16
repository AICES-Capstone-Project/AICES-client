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
  const [loading, setLoading] = useState(false);
  const [levels, setLevels] = useState<LevelEntity[]>([]);
  const [keyword, setKeyword] = useState("");

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    showSizeChanger: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingLevel, setEditingLevel] = useState<LevelEntity | null>(null);

  const [form] = Form.useForm<LevelFormValues>();

  const filteredLevels = levels.filter((item) =>
    item.name.toLowerCase().includes(keyword.toLowerCase())
  );

  const fetchLevels = async (page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
    setLoading(true);
    try {
      const response = await levelSystemService.getLevels({
        page,
        pageSize,
      });

      const apiRes = response.data;

      if (apiRes.status !== "Success" || !apiRes.data) {
        message.error(apiRes.message || "Failed to load levels. Please try again.");
        setLevels([]);
        setPagination((prev) => ({ ...prev, current: page, pageSize }));
        return;
      }

      // Backend trả: data.levels
      const list: LevelEntity[] = apiRes.data.levels;

      setLevels(list);
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize,
      }));
    } catch (error) {
      console.error(error);
      message.error("Failed to load levels. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLevels(
      pagination.current || 1,
      pagination.pageSize || DEFAULT_PAGE_SIZE
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTableChange = (pag: TablePaginationConfig) => {
    fetchLevels(pag.current || 1, pag.pageSize || DEFAULT_PAGE_SIZE);
  };

  const handleSearch = () => {
    fetchLevels(1, pagination.pageSize || DEFAULT_PAGE_SIZE);
  };

  const handleResetSearch = () => {
    setKeyword("");
    fetchLevels(1, pagination.pageSize || DEFAULT_PAGE_SIZE);
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

  const handleSubmit = async (values: LevelFormValues) => {
    setSubmitting(true);
    try {
      const name = values.name.trim();

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

      fetchLevels(
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
      fetchLevels(
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

  return (
    <div>
      <Card className="aices-card">
        <div className="company-header-row">
          <div className="company-left">
            <LevelToolbar
              keyword={keyword}
              onKeywordChange={setKeyword}
              onSearch={handleSearch}
              onReset={handleResetSearch}
              onCreate={openCreateModal}
            />
          </div>
        </div>

        <div className="accounts-table-wrapper">
          <LevelTable
            loading={loading}
            data={filteredLevels}
            pagination={{
              ...pagination,
              total: filteredLevels.length,
            }}
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
