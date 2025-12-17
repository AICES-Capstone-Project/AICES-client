import { Drawer, Form, Input, Button, Select, Typography, Slider } from "antd";
import { PlusCircleOutlined, MinusCircleOutlined, } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { systemService } from "../../../../services/systemService";
import { categoryService } from "../../../../services/categoryService";
import { languageService } from "../../../../services/languageService";
import { levelService } from "../../../../services/levelService";
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

  // [Added] Watch criteria to calculate percentage in real-time
  const criteriaValues = Form.useWatch('criteria', form);

  const [categories, setCategories] = useState<Array<any>>([]);
  const [specializations, setSpecializations] = useState<Array<any>>([]);
  const [skills, setSkills] = useState<Array<any>>([]);
  const [employmentTypes, setEmploymentTypes] = useState<Array<any>>([]);
  const [languages, setLanguages] = useState<Array<any>>([]);
  const [levels, setLevels] = useState<Array<any>>([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [loadingSpecs, setLoadingSpecs] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [loadingEmployment, setLoadingEmployment] = useState(false);
  const [loadingLangs, setLoadingLangs] = useState(false);
  const [loadingLevels, setLoadingLevels] = useState(false);
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
      setLoadingLangs(true);
      setLoadingLevels(true);
      try {
        const catsResp = await categoryService.getAll({ page: 1, pageSize: 100 });

        const [skillsResp, empResp, langsResp, levelsResp] = await Promise.all([
          systemService.getSkills(),
          systemService.getEmploymentTypes(),
          languageService.getPublicLanguages(),
          levelService.getPublicLevels(),
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

        const normalizeList = (d: any) => {
          if (!d) return [];
          if (Array.isArray(d)) return d;
          if (Array.isArray(d.items)) return d.items;
          if (Array.isArray(d.data)) return d.data;
          if (Array.isArray(d.skills)) return d.skills;
          if (Array.isArray(d.employmentTypes)) return d.employmentTypes;
          if (Array.isArray(d.employments)) return d.employments;
          if (Array.isArray(d.levels)) return d.levels;
          if (Array.isArray(d.languages)) return d.languages;
          if (Array.isArray(d.categories)) return d.categories;
          if (Array.isArray(d.specializations)) return d.specializations;
          // fallback: find first array value in object
          for (const k in d) {
            if (Array.isArray(d[k])) return d[k];
          }
          return [];
        };

        setCategories(categoriesData);
        const normalizedSkills = normalizeList(skillsResp?.data);
        const normalizedEmployment = normalizeList(empResp?.data);
        setSkills(normalizedSkills);
        setEmploymentTypes(normalizedEmployment);
        setLanguages(normalizeList(langsResp?.data));
        setLevels(normalizeList(levelsResp?.data));
      } catch (error) {
        console.error("❌ Error loading categories:", error);
        setCategories([]);
      } finally {
        setLoadingCats(false);
        setLoadingSkills(false);
        setLoadingEmployment(false);
        setLoadingLangs(false);
        setLoadingLevels(false);
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

  // [Added] Helper function to calculate total score for UI display
  const calculateTotalScore = () => {
    return (criteriaValues || []).reduce((sum: number, item: any) => sum + (item?.importance || 0), 0);
  };
  const totalScore = calculateTotalScore();

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
          const totalImportance = crit.reduce((acc: number, c: any) => acc + (c?.importance || 0), 0);

          if (totalImportance === 0) {
            return;
          }

          let runningWeight = 0;
          const processedCriteria = crit.map((c: any, index: number) => {
            let weight = 0;
            if (index === crit.length - 1) {
              // Last item takes the remainder to ensure sum is exactly 1
              weight = Number((1 - runningWeight).toFixed(2));
            } else {
              weight = Number((c.importance / totalImportance).toFixed(2));
              runningWeight += weight;
            }

            return {
              name: c.name,
              weight: weight,
            };
          });

          // Build payload matching API expectation
          const payload: any = {
            title: values.title,
            description: values.description,
            requirements: values.requirements,
            specializationId: values.specializationId,
            employmentTypeIds: values.employmentTypeIds || [],
            skillIds: values.skillIds || [],
            levelId: values.levelId || undefined,
            languageIds: values.languageIds || [],
            criteria: processedCriteria,
          };

          const result = await onSubmit(payload);
          if (isRecruiter && result) {
            setSavedAndPending(true);
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
          <Input.TextArea rows={2} maxLength={300} showCount />
        </Form.Item>

        <Form.Item name="requirements" label="Requirements" rules={[
          { required: true, message: "Please input requirements" },
          { max: 2000, message: "Requirements must not exceed 2000 characters" }
        ]}>
          <Input.TextArea rows={3} maxLength={2000} showCount />
        </Form.Item>

        {/* <Form.Item name="targetQuantity" label="Target Quantity" rules={[
          { required: true, message: "Please input target quantity" },
          { type: "number", min: 1, message: "Target quantity must be at least 1" },
          { type: "number", max: 9999, message: "Target quantity must not exceed 9999" }
        ]}>
          <InputNumber className="number-input" min={1} max={9999} style={{ width: "100%" }} placeholder="Number of positions" />
        </Form.Item> */}

        <div style={{ display: "flex", gap: "16px" }}>
          <Form.Item
            name="levelId"
            label="Level"
            style={{ width: "50%" }}
            rules={[{ required: true, message: "Please select a level" }]}
          >
            <Select
              className="company-select"
              size="middle"
              placeholder={loadingLevels ? "Loading levels..." : "Select level"}
              loading={loadingLevels}
              allowClear
              options={levels.map((l: any) => ({
                label: l.name,
                value: l.id ?? l.levelId ?? l.name,
              }))}
              style={{ minHeight: 40 }}
            />
          </Form.Item>

          <Form.Item name="languageIds" label="Languages" style={{ width: "50%" }} rules={[{ required: true, message: "Please select languages" }]}>
            <Select
              className="company-select"
              mode="multiple"
              size="middle"
              maxTagCount={2}
              maxTagTextLength={12}
              placeholder={loadingLangs ? "Loading languages..." : "Select languages"}
              loading={loadingLangs}
              options={languages.map((l: any) => ({ label: l.name, value: l.id ?? l.languageId }))}
              allowClear
              style={{ minHeight: 40 }}
            />
          </Form.Item>
        </div>

        <div style={{ display: "flex", gap: "16px" }}>
          <Form.Item
            name="categoryId"
            label="Category"
            style={{ width: "50%" }}
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select
              className="company-select"
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
              className="company-select"
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


        <Form.Item name="criteria" label="Criteria Assessment">
          <div style={{ marginBottom: 8, color: '#666', fontSize: 13 }}>
            Define importance for each criteria. The system will auto-calculate weights (%).
          </div>
          <Form.List
            name="criteria"
            // [UPDATED] Initial value now uses 'importance' instead of 'weight'
            initialValue={[{ name: "", importance: 5 }, { name: "", importance: 5 }]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => {
                  const { key, ...restField } = field as any;
                  // Calculate estimated percentage for UI only
                  const currentImportance = form.getFieldValue(['criteria', field.name, 'importance']) || 0;
                  const estimatedPercent = totalScore > 0 ? Math.round((currentImportance / totalScore) * 100) : 0;

                  return (
                    <div
                      key={key}
                      style={{
                        display: "flex",
                        alignItems: "flex-start", // changed to flex-start for better alignment with slider label
                        gap: 8,
                        width: "100%",
                        marginBottom: 16,
                        background: '#f9f9f9', // Added light bg to separate items
                        padding: 10,
                        borderRadius: 6
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
                        label="Criteria Name"
                      >
                        <Input placeholder="e.g. ReactJS Skill" maxLength={70} showCount />
                      </Form.Item>

                      {/* [UPDATED] Importance Slider replacing Weight Input */}
                      <div style={{ flex: 1, paddingLeft: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 0 }}>
                          <span style={{ fontSize: 12 }}>Importance</span>
                          <span style={{ fontSize: 12, fontWeight: 'bold', color: 'var(--color-primary)' }}>
                            ~{estimatedPercent}%
                          </span>
                        </div>
                        <Form.Item
                          {...restField}
                          name={[field.name, "importance"]}
                          initialValue={5}
                          style={{ marginBottom: 0 }}
                        >
                          <Slider
                            min={0.1}
                            max={10}
                            step={0.1}
                            marks={{ 0.1: '0.1', 5: 'Med', 10: 'High' }}
                            tipFormatter={(v) => `${(v as number).toFixed(1)}`}
                          />
                        </Form.Item>

                        {/* Hidden Weight field if you still need to see it in form values for debugging */}
                        {/* <Form.Item name={[field.name, "weight"]} hidden><InputNumber /></Form.Item> */}
                      </div>

                      {/* Nút xóa tất cả các mục (mỗi mục có dấu trừ) */}
                      <div style={{ marginTop: 30 }}>
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
                      </div>
                    </div>
                  );
                })}
                {/* Add button placed below the list */}
                <div style={{ marginTop: 6 }}>
                  <Button
                    className="company-btn"
                    style={{ width: "100%" }}
                    icon={<PlusCircleOutlined />}
                    onClick={() => {
                      add();
                      form.setFields([{ name: ["criteria"], errors: [] }]);
                    }}
                  >
                    Add criteria
                  </Button>

                  <div style={{ marginTop: 8, color: "rgba(0,0,0,0.45)", fontSize: 12 }}>
                    At least 2 criteria required.
                    {/* [Updated text] weights must sum to 1. -> System will normalize weights automatically. */}
                  </div>
                </div>
              </>
            )}
          </Form.List>
        </Form.Item>

        <Form.Item name="employmentTypeIds" label="Employment Types" rules={[{ required: true, message: "Please select employment types" }]}>
          <Select
            className="company-select"
            mode="multiple"
            placeholder={loadingEmployment ? "Loading employment types..." : "Select employment types"}
            loading={loadingEmployment}
            allowClear
            options={employmentTypes.map((e: any) => ({
              label: e?.name ?? e?.title ?? String(e),
              value: e?.employTypeId ?? e?.id ?? e?.value ?? e?.name ?? String(e),
            }))}
          />
        </Form.Item>

        <Form.Item name="skillIds" label="Skills" rules={[{ required: true, message: "Please select skills" }]}>
          <Select
            className="company-select"
            mode="multiple"
            placeholder={loadingSkills ? "Loading skills..." : "Select skills"}
            loading={loadingSkills}
            options={skills.map((s: any) => ({
              label: s?.name ?? s?.title ?? String(s),
              value: s?.skillId ?? s?.id ?? s?.value ?? s?.name ?? String(s),
            }))}
            allowClear
          />
        </Form.Item>

        <Form.Item>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <Button
              className="company-btn"
              onClick={() => {
                onClose();
                setSavedAndPending(false);
                Promise.resolve().then(() => form.resetFields());
              }}
            >
              Cancel
            </Button>
            <Button className="company-btn--filled" htmlType="submit" loading={saving}>
              Create
            </Button>
          </div>
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