import { Drawer, Form, Input, Button, Space, InputNumber, Select, Typography } from "antd";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { systemService } from "../../../../services/systemService";
import { categoryService } from "../../../../services/categoryService";
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
        console.log("🔄 Starting to fetch categories...");
        const catsResp = await categoryService.getAll({ page: 1, pageSize: 100 });
        console.log("📦 Full Categories API response:", JSON.stringify(catsResp, null, 2));
        console.log("📊 Categories data field:", catsResp?.data);
        console.log("📋 Type of data:", typeof catsResp?.data, Array.isArray(catsResp?.data));

        const [skillsResp, empResp] = await Promise.all([
          systemService.getSkills(),
          systemService.getEmploymentTypes(),
        ]);

        if (!mounted) return;

        // Extract categories array from response
        let categoriesData: any[] = [];
        if (catsResp?.data) {
          if (Array.isArray(catsResp.data)) {
            categoriesData = catsResp.data;
          } else if (catsResp.data.categories && Array.isArray(catsResp.data.categories)) {
            categoriesData = catsResp.data.categories;
          }
        }
        console.log("✅ Final extracted categories:", categoriesData);
        console.log("📝 Categories count:", categoriesData.length);

        setCategories(categoriesData);
        setSkills(skillsResp?.data || []);
        setEmploymentTypes(empResp?.data || []);
      } catch (error) {
        console.error("❌ Error loading categories:", error);
        setCategories([]);
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
      const resp = await categoryService.getSpecializations(categoryId);
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
          // require at least 2 criteria
          const crit = values.criteria || [];
          if (crit.length < 2) {
            form.setFields([
              {
                name: ["criteria"],
                errors: ["Please add at least 2 criteria"],
              },
            ]);
            return;
          }
          // validate weights sum to 1
          const sum = crit.reduce((acc: number, c: any) => acc + Number(c?.weight || 0), 0);
          if (Math.abs(sum - 1) > 1e-6) {
            // set error on the criteria field and abort submit
            form.setFields([
              {
                name: ["criteria"],
                errors: ["Total weight must equal 1"],
              },
            ]);
            return;
          }

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
          rules={[
            { required: true, message: "Please input title" },
            { max: 70, message: "Title must not exceed 70 characters" }
          ]}
        >
          <Input maxLength={70} showCount />
        </Form.Item>

        <Form.Item name="description" label="Description" rules={[
          { required: true, message: "Please input description" },
          { max: 300, message: "Description must not exceed 300 characters" }
        ]}>
          <Input.TextArea rows={3} maxLength={300} showCount />
        </Form.Item>

        <Form.Item name="requirements" label="Requirements" rules={[
          { required: true, message: "Please input requirements" },
          { max: 300, message: "Requirements must not exceed 300 characters" }
        ]}>
          <Input.TextArea rows={3} maxLength={300} showCount />
        </Form.Item>

        <Form.Item name="targetQuantity" label="Target Quantity" rules={[
          { required: true, message: "Please input target quantity" },
          { type: "number", min: 1, message: "Target quantity must be at least 1" },
          { type: "number", max: 9999, message: "Target quantity must not exceed 9999" }
        ]}>
          <InputNumber min={1} max={9999} style={{ width: "100%" }} placeholder="Number of positions" />
        </Form.Item>

        <div style={{ display: "flex", gap: "16px" }}>
          <Form.Item
            name="categoryId"
            label="Category"
            style={{ width: "50%" }}
            rules={[{ required: true, message: "Please select a category" }]}
          >
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

          <Form.Item
            name="specializationId"
            label="Specialization"
            style={{ width: "50%" }}
            rules={[{ required: true, message: "Please select a specialization" }]}
          >
            <Select
              placeholder={loadingSpecs ? "Loading specializations..." : "Select specialization"}
              loading={loadingSpecs}
              allowClear
              options={specializations.map((s: any) => ({
                label: s.name,
                value: s.specializationId,
              }))}
            />
          </Form.Item>
        </div>


        <Form.Item name="criteria" label="Criteria">
          <Form.List
            name="criteria"
            initialValue={[{ name: "", weight: "" }]}
          >
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
                      {/* Criteria name */}
                      <Form.Item
                        {...restField}
                        name={[field.name, "name"]}
                        rules={[
                          { required: true, message: "Please input criteria name" },
                          { max: 70, message: "Criteria name must not exceed 70 characters" }
                        ]}
                        style={{ flex: 1, marginBottom: 0 }}
                      >
                        <Input placeholder="Criteria name" maxLength={70} showCount />
                      </Form.Item>

                      {/* Weight */}
                      <Form.Item
                        {...restField}
                        name={[field.name, "weight"]}
                        rules={[
                          { required: true, message: "Please input weight (0-1)" },
                          { type: "number", min: 0, max: 1, message: "Weight must be between 0 and 1" }
                        ]}
                        style={{ width: 150, marginBottom: 0 }}
                      >
                        <InputNumber
                          min={0}
                          max={1}
                          step={0.01}
                          precision={2}
                          placeholder="Criteria weight"
                          style={{ width: "100%" }}
                        />
                      </Form.Item>

                      {/* Nút thêm / xóa */}
                      {index === fields.length - 1 ? (
                        <PlusCircleOutlined
                          onClick={() => {
                            add();
                            form.setFields([{ name: ["criteria"], errors: [] }]);
                          }}
                          style={{
                            color: "var(--color-primary-light)",
                            cursor: "pointer",
                            fontSize: 18,
                          }}
                        />
                      ) : (
                        <MinusCircleOutlined
                          onClick={() => {
                            remove(field.name);
                            form.setFields([{ name: ["criteria"], errors: [] }]);
                          }}
                          style={{
                            color: "red",
                            cursor: "pointer",
                            fontSize: 18,
                          }}
                        />
                      )}
                    </div>
                  );
                })}
                <div style={{ marginTop: 6, color: "rgba(0,0,0,0.45)", fontSize: 12 }}>
                  At least 2 criteria required; weights must sum to 1.
                </div>
              </>
            )}
          </Form.List>
        </Form.Item>

        <Form.Item name="employmentTypes" label="Employment Types" rules={[{ required: true, message: "Please select employment types" }]}>
          <Select
            mode="multiple"
            placeholder={loadingEmployment ? "Loading employment types..." : "Select employment types"}
            loading={loadingEmployment}
            allowClear
            options={employmentTypes.map((e: any) => ({ label: e.name, value: e.employTypeId }))}
          />
        </Form.Item>

        <Form.Item name="skills" label="Skills" rules={[{ required: true, message: "Please select skills" }]}>
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
            <Button className="company-btn--filled" htmlType="submit" loading={saving}>
              Save
            </Button>
          </Space>
        </Form.Item>

        {savedAndPending && (
          <div style={{ marginTop: 12 }}>
            <Typography.Text strong>Pending approval</Typography.Text>
          </div>
        )}
      </Form>
    </Drawer>
  );
};

export default JobCreateDrawer;
