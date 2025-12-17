// src/pages/SystemPages/Taxonomy/SkillList.tsx

import { useEffect, useState } from "react";
import { Card, Form, message } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";

import type { Skill } from "../../../types/skill.types";
import { skillService } from "../../../services/skillService";

import SkillToolbar from "./components/skill/SkillToolbar";
import SkillTable from "./components/skill/SkillTable";
import SkillModal from "./components/skill/SkillModal";

const DEFAULT_PAGE_SIZE = 10;

export interface SkillFormValues {
  name: string;
}

export default function SkillList() {
  const [skills, setSkills] = useState<Skill[]>([]);
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
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const [form] = Form.useForm<SkillFormValues>();

  const fetchData = async (page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
    try {
      setLoading(true);

      const response = await skillService.getSkillsSystem({ page, pageSize });
      const apiRes = response.data;

      if (apiRes.status !== "Success" || !apiRes.data) {
        message.error(apiRes.message || "Failed to load skills");
        setSkills([]);
        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize,
          total: 0,
        }));
        return;
      }

      const payload = apiRes.data; // { skills, totalPages, currentPage, pageSize, totalCount }

      setSkills(payload.skills || []);
      setPagination({
        current: payload.currentPage ?? page,
        pageSize: payload.pageSize ?? pageSize,
        total: payload.totalCount ?? 0, // ✅ quan trọng để hiện page 2
        showSizeChanger: true,
      });
    } catch (err: any) {
      console.error(err);
      message.error("Failed to load skills");
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
    setEditingSkill(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (record: Skill) => {
    setEditingSkill(record);
    form.setFieldsValue({ name: record.name });
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const values = await form.validateFields();
      const name = (values.name || "").trim();

      if (!name) {
        message.error("Skill name is required.");
        return;
      }

      if (editingSkill) {
        await skillService.updateSkillSystem(editingSkill.skillId, { name });
        message.success("Skill updated successfully.");
      } else {
        await skillService.createSkillSystem({ name });
        message.success("Skill created successfully.");
      }

      setIsModalOpen(false);
      setEditingSkill(null);
      form.resetFields();

      fetchData(pagination.current || 1, pagination.pageSize || DEFAULT_PAGE_SIZE);
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
      await skillService.deleteSkillSystem(id);
      message.success("Skill deleted successfully.");

      fetchData(pagination.current || 1, pagination.pageSize || DEFAULT_PAGE_SIZE);
    } catch (error) {
      console.error(error);
      message.error("Failed to delete skill. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = skills.filter((item) =>
    (item.name ?? "").toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div>
      <Card className="aices-card">
        <div className="company-header-row">
          <div className="company-left">
            <SkillToolbar
              keyword={keyword}
              onKeywordChange={setKeyword}
              onSearch={() => fetchData(1, pagination.pageSize || DEFAULT_PAGE_SIZE)}
              onReset={() => {
                setKeyword("");
                fetchData(1, pagination.pageSize || DEFAULT_PAGE_SIZE);
              }}
              onCreate={openCreateModal}
            />
          </div>
        </div>

        <div className="accounts-table-wrapper">
          <SkillTable
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

      <SkillModal
        open={isModalOpen}
        form={form}
        editingSkill={editingSkill}
        submitting={submitting}
        onCancel={handleModalCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
