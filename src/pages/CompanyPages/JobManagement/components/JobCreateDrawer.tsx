import { Drawer, Form, Input, Button, Space, InputNumber, Select, Typography } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { systemService } from "../../../../services/systemService";
import { useAppSelector } from "../../../../hooks/redux";
import { ROLES } from "../../../../services/config";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => Promise<boolean> | boolean;
  saving?: boolean;
};

const JobCreateDrawer = ({ open, onClose, onSubmit, saving }: Props) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Array<any>>([]);
  const [specializations, setSpecializations] = useState<Array<any>>([]);
  const [skills, setSkills] = useState<Array<any>>([]);
  const [employmentTypes, setEmploymentTypes] = useState<Array<any>>([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [loadingSpecs, setLoadingSpecs] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [loadingEmployment, setLoadingEmployment] = useState(false);
  const [savedAndPending, setSavedAndPending] = useState(false);
  const { user } = useAppSelector((s) => s.auth);
  const isRecruiter = (user?.roleName || "").toLowerCase() === (ROLES.Hr_Recruiter || "").toLowerCase();

  useEffect(() => {
    if (open) setSavedAndPending(false);
  }, [open]);

  // If savedAndPending becomes true for a recruiter, show the message briefly
  // then close the drawer and reset the form.
  useEffect(() => {
    if (!isRecruiter || !savedAndPending) return;
    const t = setTimeout(() => {
      // close drawer and clear pending indicator
      onClose();
      setSavedAndPending(false);
      // schedule reset after close to avoid calling before unmount/mount timings
      Promise.resolve().then(() => form.resetFields());
    }, 1500);
    return () => clearTimeout(t);
  }, [savedAndPending, isRecruiter, onClose, form]);

  useEffect(() => {
    if (!open) {
      // schedule reset to let unmount finish
      Promise.resolve().then(() => form.resetFields());
    }
    let mounted = true;
    const load = async () => {
      setLoadingCats(true);
      setLoadingSkills(true);
      setLoadingEmployment(true);
      try {
        const [catsResp, skillsResp, empResp] = await Promise.all([
          systemService.getCategories(),
          systemService.getSkills(),
          systemService.getEmploymentTypes(),
        ]);
        if (!mounted) return;
        setCategories((catsResp?.data as any)?.categories ?? []);
        setSkills(skillsResp?.data || []);
        setEmploymentTypes(empResp?.data || []);
      } catch {
        // ignore
      } finally {
        setLoadingCats(false);
        setLoadingSkills(false);
        setLoadingEmployment(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [open, form]);

  const handleCategoryChange = async (categoryId: number) => {
    Promise.resolve().then(() => form.setFieldsValue({ specializationId: undefined }));
    if (!categoryId) {
      setSpecializations([]);
      return;
    }
    setLoadingSpecs(true);
    try {
      const resp = await systemService.getSpecializations(categoryId);
      setSpecializations(resp?.data || []);
    } catch {
      setSpecializations([]);
    } finally {
      setLoadingSpecs(false);
    }
  };

  useEffect(() => {
    // Only attach cleanup when drawer opens; schedule reset on close to avoid calling
    // form.resetFields() before the Form component has connected to the instance.
    if (!open) return;
    return () => {
      Promise.resolve().then(() => form.resetFields());
    };
  }, [open, form]);

  return (
    <Drawer title="Create Job" width={640} open={open} onClose={onClose}>
      <Form
        form={form}
        layout="vertical"
        onFinish={async (values) => {
          if (!Array.isArray(values.criteria)) values.criteria = [];
          // call parent submit and wait for success boolean
          const result = await onSubmit(values);
          // if current user is HR_RECRUITER and creation succeeded, show pending message
          if (isRecruiter && result) {
            setSavedAndPending(true);
            // keep drawer open so recruiter sees "Chờ duyệt"
            return;
          }
          // otherwise close and reset
          onClose();
        }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please input title" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item name="requirements" label="Requirements">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item name="categoryId" label="Category">
          <Select
            placeholder={loadingCats ? "Loading categories..." : "Select category"}
            loading={loadingCats}
            allowClear
            onChange={(v) => handleCategoryChange(Number(v))}
            options={categories.map((c: any) => ({
              label: c.name,
              value: c.categoryId,
            }))}
          />
        </Form.Item>

        <Form.Item name="specializationId" label="Specialization">
          <Select
            placeholder={loadingSpecs ? "Loading specializations..." : "Select specialization"}
            loading={loadingSpecs}
            allowClear
            options={specializations.map((s: any) => ({ label: s.name, value: s.specializationId }))}
          />
        </Form.Item>

        <Form.List name="criteria">
          {(fields, { add, remove }) => (
            <>
              <div style={{ marginBottom: 8, fontWeight: 600 }}>Criteria</div>
              {fields.map((field) => {
                const { key, ...restField } = field as any;
                return (
                  <Space key={key} align="baseline" style={{ display: "flex", marginBottom: 8 }}>
                    <Form.Item {...restField} name={[field.name, "name"]} rules={[{ required: true, message: "Please input criteria name" }]}>
                      <Input placeholder="Criteria name" />
                    </Form.Item>

                    <Form.Item {...restField} name={[field.name, "weight"]} rules={[{ required: true, message: "Please input weight (0-1)" }]}>
                      <InputNumber min={0} max={1} step={0.1} placeholder="Weight" />
                    </Form.Item>

                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                );
              })}

              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add criteria
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item name="employmentTypes" label="Employment Types">
          <Select
            mode="multiple"
            placeholder={loadingEmployment ? "Loading employment types..." : "Select employment types"}
            loading={loadingEmployment}
            allowClear
            options={employmentTypes.map((e: any) => ({ label: e.name, value: e.employTypeId }))}
          />
        </Form.Item>

        <Form.Item name="skills" label="Skills">
          <Select mode="multiple" placeholder={loadingSkills ? "Loading skills..." : "Select skills"} loading={loadingSkills} options={skills.map((s: any) => ({ label: s.name, value: s.skillId }))} allowClear />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              onClick={() => {
                onClose();
                setSavedAndPending(false);
                // schedule reset to avoid calling before unmount/mount timings
                Promise.resolve().then(() => form.resetFields());
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={saving}>
              Save
            </Button>
          </Space>
        </Form.Item>

        {savedAndPending && (
          <div style={{ marginTop: 12 }}>
            <Typography.Text strong>Chờ duyệt</Typography.Text>
          </div>
        )}
      </Form>
    </Drawer>
  );
};

export default JobCreateDrawer;
