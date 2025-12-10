import { Form, Input, Select, Modal } from "antd";
import type { FormInstance } from "antd/es/form";
import type { Specialization } from "../../../../../types/specialization.types";
import type { Category } from "../../../../../types/category.types";
import { useEffect, useState } from "react";
import { categoryService } from "../../../../../services/categoryService";

interface SpecializationModalProps {
  open: boolean;
  form: FormInstance;
  editingSpecialization: Specialization | null;
  onOk: () => void;
  onCancel: () => void;
}

export default function SpecializationModal({
  open,
  form,
  editingSpecialization,
  onOk,
  onCancel,
}: SpecializationModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  // 👉 Mở modal thì load Category list
  useEffect(() => {
    if (!open) return;

    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAllSystem({
          page: 1,
          pageSize: 1000,
        });

        if (res.status !== "Success" || !res.data) {
          setCategories([]);
          return;
        }

        const payload = res.data;
        setCategories(payload.categories || []);
      } catch (error) {
        console.error("Failed to load categories", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, [open]);

  return (
    <Modal
      open={open}
      title={
        editingSpecialization ? "Edit Specialization" : "Create Specialization"
      }
      onOk={onOk}
      onCancel={onCancel}
      okText={editingSpecialization ? "Save changes" : "Create"}
      destroyOnClose
      centered
      className="system-modal"
    >
      <div className="system-modal-section-title">
        Specialization Information
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={{ name: "", categoryId: undefined }}
      >
        <Form.Item
          name="name"
          label="Specialization Name"
          rules={[
            { required: true, message: "Name is required" },
            { max: 255, message: "Max 255 characters" },
          ]}
        >
          <Input placeholder="e.g. Backend Development" />
        </Form.Item>

        {/* 🔽 ĐÃ ĐỔI: Category ID -> Select Category Name */}
        <Form.Item
          name="categoryId"
          label="Category"
          rules={[{ required: true, message: "Please select category" }]}
        >
          <Select
            placeholder="Select category"
            showSearch
            optionFilterProp="label"
            options={categories.map((cate) => ({
              label: cate.name,
              value: cate.categoryId,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
