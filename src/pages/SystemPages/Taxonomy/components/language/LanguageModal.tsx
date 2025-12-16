import { Form, Input, Modal } from "antd";
import type { FormInstance } from "antd/es/form";
import type { LanguageEntity } from "../../../../../types/language.types";

export interface LanguageFormValues {
  name: string;
}

interface LanguageModalProps {
  open: boolean;
  form: FormInstance<LanguageFormValues>;
  editingLanguage: LanguageEntity | null;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (values: LanguageFormValues) => void;
}

export default function LanguageModal({
  open,
  form,
  editingLanguage,
  submitting,
  onCancel,
  onSubmit,
}: LanguageModalProps) {
  return (
    <Modal
      open={open}
      title={editingLanguage ? "Edit Language" : "Create Language"}
      onCancel={onCancel}
      okText={editingLanguage ? "Save Changes" : "Create"}
      onOk={() => form.submit()}
      confirmLoading={submitting}
      destroyOnClose
      centered
      className="system-modal"
    >
      <div className="system-modal-section-title">Basic Information</div>

      <Form form={form} layout="vertical" onFinish={onSubmit} preserve={false}>
        <Form.Item
          label="Language Name"
          name="name"
          rules={[
            { required: true, message: "Please enter language name" },
            { max: 200 },
          ]}
        >
          <Input placeholder="e.g. English, Vietnamese, Japanese" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
