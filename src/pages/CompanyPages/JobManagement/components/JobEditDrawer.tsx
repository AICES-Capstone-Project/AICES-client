import { useEffect } from "react";
import { Drawer, Form, Input, Button, Space } from "antd";
import type { CompanyJob } from "../../../../services/jobService";

type Props = {
  open: boolean;
  onClose: () => void;
  job: CompanyJob | null;
  form: any;
  onSubmit: (values: any) => void;
  categories?: string[];
  getAvailableSpecializations?: () => string[];
};

const JobEditDrawer = ({ open, onClose, job, form, onSubmit }: Props) => {
  useEffect(() => {
    if (job && form) {
      form.setFieldsValue({
        title: job.title,
        description: job.description,
        requirements: job.requirements,
        specializationName: job.specializationName,
        employmentTypes: Array.isArray(job.employmentTypes) ? job.employmentTypes.join(",") : (job.employmentTypes || ""),
        skills: Array.isArray(job.skills) ? job.skills.join(",") : (job.skills || ""),
      });
    } else if (form) {
      form.resetFields();
    }
  }, [job, form]);

  return (
    <Drawer title="Edit Job" width={640} onClose={onClose} open={open}>
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item name="title" label="Title" rules={[{ required: true, message: "Please input title" }]}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item name="requirements" label="Requirements">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item name="specializationName" label="Specialization">
          <Input />
        </Form.Item>

        <Form.Item name="employmentTypes" label="Employment Types">
          <Input placeholder="Comma separated (e.g. Full-time,Part-time)" />
        </Form.Item>

        <Form.Item name="skills" label="Skills">
          <Input placeholder="Comma separated (e.g. Excel,React)" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit">Save</Button>
          </Space>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default JobEditDrawer;
