import { Form, Input, Modal } from "antd";
import type { FormInstance } from "antd/es/form";
import type { Skill } from "../../../../../types/skill.types";

interface SkillFormValues {
  name: string;
}

interface SkillModalProps {
  open: boolean;
  form: FormInstance<SkillFormValues>;
  editingSkill: Skill | null;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (values: SkillFormValues) => void;
}

export default function SkillModal({
  open,
  form,
  editingSkill,
  submitting,
  onCancel,
  onSubmit,
}: SkillModalProps) {
  return (
    <Modal
      open={open}
      title={editingSkill ? "Edit Skill" : "Create Skill"}
      onCancel={onCancel}
      okText={editingSkill ? "Save Changes" : "Create"}
      onOk={() => form.submit()}
      confirmLoading={submitting}
      destroyOnClose
      centered
      className="system-modal"
    >
      <div className="system-modal-section-title">Basic Information</div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        preserve={false}
      >
        <Form.Item
          label="Skill Name"
          name="name"
          rules={[
            { required: true, message: "Please enter skill name" },
            { max: 200 },
          ]}
        >
          <Input placeholder="e.g. Communication, Leadership, NodeJS" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
