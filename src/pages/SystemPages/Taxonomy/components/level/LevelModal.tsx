import { Form, Input, Modal } from "antd";
import type { FormInstance } from "antd/es/form";
import type { LevelEntity } from "../../../../../types/level.types";

interface LevelFormValues {
  name: string;
}

interface LevelModalProps {
  open: boolean;
  form: FormInstance<LevelFormValues>;
  editingLevel: LevelEntity | null;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (values: LevelFormValues) => void;
}

export default function LevelModal({
  open,
  form,
  editingLevel,
  submitting,
  onCancel,
  onSubmit,
}: LevelModalProps) {
  return (
    <Modal
      open={open}
      title={editingLevel ? "Edit Level" : "Create Level"}
      onCancel={onCancel}
      okText={editingLevel ? "Save Changes" : "Create"}
      onOk={() => form.submit()}
      confirmLoading={submitting}
      destroyOnClose
      centered
      className="system-modal"
    >
      <div className="system-modal-section-title">Basic Information</div>

      <Form form={form} layout="vertical" onFinish={onSubmit} preserve={false}>
        <Form.Item
          label="Level Name"
          name="name"
          rules={[
            { required: true, message: "Please enter level name" },
            { max: 200 },
          ]}
        >
          <Input placeholder="e.g. Intern, Fresher, Junior, Senior, Manager" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
