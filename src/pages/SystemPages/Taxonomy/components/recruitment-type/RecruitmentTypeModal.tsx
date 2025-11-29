import { Form, Input, Modal } from "antd";
import type { FormInstance } from "antd/es/form";
import type { RecruitmentType } from "../../../../../types/recruitmentType.types";

interface RecruitmentTypeModalProps {
  open: boolean;
  form: FormInstance;
  editingItem: RecruitmentType | null;
  onCancel: () => void;
  onOk: () => void;
}

export default function RecruitmentTypeModal({
  open,
  form,
  editingItem,
  onCancel,
  onOk,
}: RecruitmentTypeModalProps) {
  return (
    <Modal
      title={editingItem ? "Edit Recruitment Type" : "New Recruitment Type"}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText={editingItem ? "Save changes" : "Create"}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please enter recruitment type name" },
            {
              max: 100,
              message: "Name must be at most 100 characters",
            },
          ]}
        >
          <Input placeholder="e.g. Full-time, Part-time, Contract, Temporary" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
