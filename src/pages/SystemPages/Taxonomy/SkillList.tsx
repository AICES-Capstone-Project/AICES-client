// src/pages/SystemPages/Taxonomy/SkillList.tsx

import { useEffect, useState } from "react";
import { Card, Form, Typography, message } from "antd";
import type { TablePaginationConfig } from "antd/es/table";

import dayjs from "dayjs";

import type { Skill } from "../../../types/skill.types";
import { skillService } from "../../../services/skillService";

import SkillToolbar from "./components/skill/SkillToolbar";
import SkillTable from "./components/skill/SkillTable";
import SkillModal from "./components/skill/SkillModal";

const { Title, Text } = Typography;
const DEFAULT_PAGE_SIZE = 10;

interface SkillFormValues {
  name: string;
}

export default function SkillList() {
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    showSizeChanger: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const [form] = Form.useForm<SkillFormValues>();

  const fetchSkills = async (
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    currentKeyword = keyword
  ) => {
    setLoading(true);
    try {
      const response = await skillService.getSkillsSystem({
        page,
        pageSize,
        keyword: currentKeyword || undefined,
      });

      const data = response.data;

      const list: Skill[] = Array.isArray(data) ? data : [];

      setSkills(list);
      setTotal(list.length);

      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize,
      }));
    } catch (error) {
      console.error(error);
      message.error("Failed to load skills. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills(
      pagination.current || 1,
      pagination.pageSize || DEFAULT_PAGE_SIZE
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTableChange = (pag: TablePaginationConfig) => {
    fetchSkills(pag.current || 1, pag.pageSize || DEFAULT_PAGE_SIZE);
  };

  const handleSearch = () => {
    fetchSkills(1, pagination.pageSize || DEFAULT_PAGE_SIZE, keyword);
  };

  const handleResetSearch = () => {
    setKeyword("");
    fetchSkills(1, pagination.pageSize || DEFAULT_PAGE_SIZE, "");
  };

  const openCreateModal = () => {
    setEditingSkill(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (record: Skill) => {
    setEditingSkill(record);
    form.setFieldsValue({
      name: record.name,
    });
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
    form.resetFields();
  };

  const handleSubmit = async (values: SkillFormValues) => {
    setSubmitting(true);
    try {
      if (editingSkill) {
        await skillService.updateSkillSystem(editingSkill.skillId, {
          name: values.name.trim(),
        });
        message.success("Skill updated successfully.");
      } else {
        await skillService.createSkillSystem({
          name: values.name.trim(),
        });
        message.success("Skill created successfully.");
      }

      setIsModalOpen(false);
      setEditingSkill(null);
      form.resetFields();

      fetchSkills(
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
      await skillService.deleteSkillSystem(id);
      message.success("Skill deleted successfully.");
      fetchSkills(
        pagination.current || 1,
        pagination.pageSize || DEFAULT_PAGE_SIZE
      );
    } catch (error) {
      console.error(error);
      message.error("Failed to delete skill. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Skill Management
          </Title>
          <Text type="secondary">Manage global skills taxonomy</Text>
        </div>
      }
      extra={
        <SkillToolbar
          keyword={keyword}
          onKeywordChange={setKeyword}
          onSearch={handleSearch}
          onReset={handleResetSearch}
          onCreate={openCreateModal}
        />
      }
    >
      <SkillTable
        loading={loading}
        data={skills}
        pagination={{ ...pagination, total }}
        onChangePage={handleTableChange}
        onEdit={openEditModal}
        onDelete={handleDelete}
        formatDate={(value: string) =>
          value ? dayjs(value).format("YYYY-MM-DD HH:mm") : "-"
        }
      />

      <SkillModal
        open={isModalOpen}
        form={form}
        editingSkill={editingSkill}
        submitting={submitting}
        onCancel={handleModalCancel}
        onSubmit={handleSubmit}
      />
    </Card>
  );
}
