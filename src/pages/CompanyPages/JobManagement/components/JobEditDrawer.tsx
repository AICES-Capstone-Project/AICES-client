import { Drawer, Form, Input, Button, Space, InputNumber, Select } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { systemService } from "../../../../services/systemService";
import type { CompanyJob } from "../../../../services/jobService";

type Props = {
  open: boolean;
  onClose: () => void;
  job: CompanyJob | null;
  form: any;
  onSubmit: (values: any) => void;
  saving?: boolean;
};

const JobEditDrawer = ({ open, onClose, job, form, onSubmit, saving }: Props) => {
  const [categories, setCategories] = useState<Array<any>>([]);
  const [specializations, setSpecializations] = useState<Array<any>>([]);
  const [skills, setSkills] = useState<Array<any>>([]);
  const [employmentTypes, setEmploymentTypes] = useState<Array<any>>([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [loadingSpecs, setLoadingSpecs] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [loadingEmployment, setLoadingEmployment] = useState(false);

  useEffect(() => {
    if (!open) return;
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
        // ignore errors
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
  }, [open]);

  const handleCategoryChange = async (categoryId: number) => {
    form.setFieldsValue({ specializationId: undefined });
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
    if (!form) return;
    if (!open) {
      form.resetFields();
      return;
    }

    if (job) {
      const base: any = {
        title: job.title,
        description: job.description,
        requirements: job.requirements,
        employmentTypes: Array.isArray(job.employmentTypes)
          ? job.employmentTypes.map((t: any) => {
            const found = employmentTypes.find(
              (et: any) => et.name.toLowerCase() === String(t).toLowerCase()
            );
            return found ? found.id : t;
          })
          : [],
        skills: Array.isArray(job.skills)
          ? job.skills.map((s: any) => {
            if (typeof s === "number") return s;
            const found = skills.find(
              (sk: any) => sk.name.toLowerCase() === String(s).toLowerCase()
            );
            return found ? found.id : s;
          })
          : [],
        criteria: Array.isArray((job as any).criteria)
          ? (job as any).criteria.map((c: any) => ({
            name: c.name,
            weight: c.weight,
          }))
          : [],
      };

      if (job.categoryName && categories.length > 0) {
        const cat = categories.find(
          (c: any) =>
            String(c.name).toLowerCase() ===
            String(job.categoryName).toLowerCase()
        );
        if (cat) {
          base.categoryId = cat.categoryId;
          (async () => {
            setLoadingSpecs(true);
            try {
              const resp = await systemService.getSpecializations(cat.categoryId);
              setSpecializations(resp?.data || []);
              if (job.specializationName && resp?.data) {
                const spec = resp.data.find(
                  (s: any) =>
                    String(s.name).toLowerCase() ===
                    String(job.specializationName).toLowerCase()
                );
                if (spec) base.specializationId = spec.specializationId;
              }
            } catch { }
            setLoadingSpecs(false);
            form.setFieldsValue(base);
          })();
        } else {
          form.setFieldsValue(base);
        }
      } else {
        form.setFieldsValue(base);
      }
    } else {
      form.resetFields();
    }
  }, [job, form, open, categories, skills, employmentTypes]);

  return (
    <Drawer title="Edit Job" width={640} open={open} onClose={onClose}>
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          if (!Array.isArray(values.criteria)) values.criteria = [];
          onSubmit(values);
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
            placeholder={
              loadingSpecs ? "Loading specializations..." : "Select specialization"
            }
            loading={loadingSpecs}
            allowClear
            options={specializations.map((s: any) => ({
              label: s.name,
              value: s.specializationId,
            }))}
          />
        </Form.Item>

        <Form.List name="criteria">
          {(fields, { add, remove }) => (
            <>
              <div style={{ marginBottom: 8, fontWeight: 600 }}>Criteria</div>
              {fields.map((field) => (
                <Space
                  key={field.key}
                  align="baseline"
                  style={{ display: "flex", marginBottom: 8 }}
                >
                  <Form.Item
                    {...field}
                    name={[field.name, "name"]}
                    rules={[{ required: true, message: "Please input criteria name" }]}
                  >
                    <Input placeholder="Criteria name" />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    name={[field.name, "weight"]}
                    rules={[{ required: true, message: "Please input weight (0-1)" }]}
                  >
                    <InputNumber min={0} max={1} step={0.1} placeholder="Weight" />
                  </Form.Item>

                  <MinusCircleOutlined onClick={() => remove(field.name)} />
                </Space>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add criteria
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item name="employmentTypes" label="Employment Types">
          <Select
            mode="multiple"
            placeholder={
              loadingEmployment ? "Loading employment types..." : "Select employment types"
            }
            loading={loadingEmployment}
            allowClear
            options={employmentTypes.map((e: any) => ({
              label: e.name,
              value: e.employTypeId,
            }))}
          />
        </Form.Item>

        <Form.Item name="skills" label="Skills">
          <Select
            mode="multiple"
            placeholder={loadingSkills ? "Loading skills..." : "Select skills"}
            loading={loadingSkills}
            options={skills.map((s: any) => ({
              label: s.name,
              value: s.skillId,
            }))}
            allowClear
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              onClick={() => {
                onClose();
                form.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={saving}>
              Save
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default JobEditDrawer;
