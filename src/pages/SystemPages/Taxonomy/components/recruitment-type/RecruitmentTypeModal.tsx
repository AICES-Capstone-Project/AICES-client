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
      open={open}
      title={editingItem ? "Edit Recruitment Type" : "Create Recruitment Type"}
      onCancel={onCancel}
      onOk={onOk}
      okText={editingItem ? "Save" : "Create"}
      destroyOnClose
      centered
      className="system-modal"
    >
      <div className="system-modal-section-title">Basic Information</div>

      <Form form={form} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please enter recruitment type name" },
            { max: 100 },
          ]}
        >
          <Input placeholder="Ex: Full-time, Part-time, Contract..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}
