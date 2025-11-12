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
    // Only proceed when the drawer is open. Parent will reset the form when closing.
    if (!open) return;

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
            return found ? found.employTypeId : t;
          })
          : [],
        skills: Array.isArray(job.skills)
          ? job.skills.map((s: any) => {
            if (typeof s === "number") return s;
            const found = skills.find(
              (sk: any) => sk.name.toLowerCase() === String(s).toLowerCase()
            );
            return found ? found.skillId : s;
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
            // schedule setting fields to next microtask so Form has time to mount and connect
            Promise.resolve().then(() => form.setFieldsValue(base));
          })();
        } else {
          Promise.resolve().then(() => form.setFieldsValue(base));
        }
      } else {
        form.setFieldsValue(base);
      }
    } else {
      Promise.resolve().then(() => form.resetFields());
    }
  }, [job, form, open, categories, skills, employmentTypes]);

  return (
    <Drawer title="Edit Job" width={640} open={open} onClose={onClose}>
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          console.log("✅ onFinish called", values);
          if (!Array.isArray(values.criteria)) values.criteria = [];
          const crit = values.criteria || [];
          const sum = crit.reduce((acc: number, c: any) => acc + Number(c?.weight || 0), 0);
          if (Math.abs(sum - 1) > 1e-6) {
            // set error and abort
            form.setFields([
              {
                name: ["criteria"],
                errors: ["Total weight must equal 1"],
              },
            ]);
            return;
          }
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

        <Form.Item name="criteria" label="Criteria" rules={[{ required: true, message: "Please select a criteria" }]}>
          <Form.List name="criteria" initialValue={[{ name: "", weight: 0 }]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => {
                  const { key, ...restField } = field as any;
                  return (
                    <div
                      key={key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        width: "100%",
                        marginBottom: 8,
                      }}
                    >
                      <Form.Item
                        {...restField}
                        name={[field.name, "name"]}
                        rules={[{ required: true, message: "Please input criteria name" }]}
                        style={{ flex: 1, marginBottom: 0 }}
                      >
                        <Input placeholder="Criteria name" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[field.name, "weight"]}
                        rules={[{ required: true, message: "Please input weight (0-1)" }]}
                        style={{ width: 150, marginBottom: 0 }}
                      >
                        <InputNumber min={0} max={1} step={0.1} placeholder="Weight" style={{ width: "100%" }} />
                      </Form.Item>

                      {index === fields.length - 1 ? (
                        <PlusOutlined
                          onClick={() => add()}
                          style={{ color: "#1890ff", cursor: "pointer", fontSize: 18 }}
                        />
                      ) : (
                        <MinusCircleOutlined
                          onClick={() => remove(field.name)}
                          style={{ color: "red", cursor: "pointer", fontSize: 18 }}
                        />
                      )}
                    </div>
                  );
                })}

                <Form.Item noStyle dependencies={["criteria"]}>
                  {() => {
                    const criteria = form.getFieldValue("criteria") || [];
                    const total = (criteria || []).reduce((acc: number, c: any) => acc + Number(c?.weight || 0), 0);
                    if ((criteria?.length || 0) > 0 && Math.abs(total - 1) > 1e-6) {
                      return <div style={{ color: "red", marginTop: 4 }}>Total weight must equal 1</div>;
                    }
                    return null;
                  }}
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>

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
