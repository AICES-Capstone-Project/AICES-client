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
      title={editingSkill ? "Edit Skill" : "Create Skill"}
      open={open}
      onCancel={onCancel}
      okText={editingSkill ? "Save changes" : "Create"}
      onOk={() => form.submit()}
      confirmLoading={submitting}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        preserve={false}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please enter skill name" },
            { max: 200, message: "Name is too long" },
          ]}
        >
          <Input placeholder="e.g. Communication, Leadership" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
