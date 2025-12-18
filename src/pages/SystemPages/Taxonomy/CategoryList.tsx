import { useEffect, useState } from "react";
import { Card, Form, message } from "antd";
import type { TablePaginationConfig } from "antd/es/table";

import { categoryService } from "../../../services/categoryService";
import type { Category } from "../../../types/category.types";

import CategoryToolbar from "./components/category/CategoryToolbar";
import CategoryTable from "./components/category/CategoryTable";
import CategoryModal from "./components/category/CategoryModal";

const DEFAULT_PAGE_SIZE = 10;

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    showSizeChanger: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form] = Form.useForm();

  const fetchData = async (page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
    try {
      setLoading(true);

      const res = await categoryService.getAllSystem({ page, pageSize });

      if (res.status !== "Success" || !res.data) {
        message.error(res.message || "Failed to load categories");
        setCategories([]);
        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize,
          total: 0,
        }));
        return;
      }

      const payload = res.data;

      setCategories(payload.categories);
      setPagination({
        current: payload.currentPage,
        pageSize: payload.pageSize,
        total: payload.totalPages * payload.pageSize,
        showSizeChanger: true,
      });
    } catch (err: any) {
      console.error(err);
      message.error("Failed to load categories");
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
    setEditing(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (record: Category) => {
    setEditing(record);
    form.setFieldsValue({ name: record.name });
    setIsModalOpen(true);
  };

  const handleDelete = (record: Category) => {
    import("antd").then(({ Modal }) =>
      Modal.confirm({
        title: "Deactivate this category?",
        content: `Category "${record.name}" will be deactivated.`,
        okText: "Yes",
        cancelText: "No",
        onOk: async () => {
          try {
            const res = await categoryService.remove(record.categoryId);

            if (res.status !== "Success") {
              message.error(res.message || "Failed to deactivate category");
              return;
            }

            message.success("Category deactivated successfully");
            fetchData(
              pagination.current || 1,
              pagination.pageSize || DEFAULT_PAGE_SIZE
            );
          } catch (err: any) {
            console.error(err);
            message.error("Failed to deactivate category");
          }
        },
      })
    );
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      let res;
      if (editing) {
        res = await categoryService.update(editing.categoryId, {
          name: values.name,
        });
      } else {
        res = await categoryService.create({ name: values.name });
      }

      if (res.status !== "Success") {
        message.error(
          res.message ||
            (editing
              ? "Failed to update category"
              : "Failed to create category")
        );
        return;
      }

      message.success(
        editing
          ? "Category updated successfully"
          : "Category created successfully"
      );

      setIsModalOpen(false);
      form.resetFields();
      fetchData(
        pagination.current || 1,
        pagination.pageSize || DEFAULT_PAGE_SIZE
      );
    } catch (err: any) {
      console.error(err);
    }
  };

  const filteredData = categories.filter((item) =>
    item.name.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div>
      <Card className="aices-card">
        <CategoryToolbar
          keyword={keyword}
          onKeywordChange={setKeyword}
          onReset={() => setKeyword("")}
          onCreate={openCreateModal}
        />

        <div className="accounts-table-wrapper">
          <CategoryTable
            loading={loading}
            data={filteredData}
            pagination={pagination}
            onChangePage={handleTableChange}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </div>
      </Card>

      {/* MODAL (giữ nguyên) */}
      <CategoryModal
        open={isModalOpen}
        form={form}
        editing={editing}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
