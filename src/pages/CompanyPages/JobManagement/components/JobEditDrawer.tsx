import { Drawer, Form, Input, Button, Space, Select, Slider } from "antd";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { systemService } from "../../../../services/systemService";
import { languageService } from "../../../../services/languageService";
import { levelService } from "../../../../services/levelService";
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
  const [languages, setLanguages] = useState<Array<any>>([]);
  const [levels, setLevels] = useState<Array<any>>([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [loadingSpecs, setLoadingSpecs] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [loadingEmployment, setLoadingEmployment] = useState(false);
  const [loadingLangs, setLoadingLangs] = useState(false);
  const [loadingLevels, setLoadingLevels] = useState(false);

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    const load = async () => {
      setLoadingCats(true);
      setLoadingSkills(true);
      setLoadingEmployment(true);
      setLoadingLangs(true);
      setLoadingLevels(true);
      try {
        const [catsResp, skillsResp, empResp, langsResp, levelsResp] = await Promise.all([
          systemService.getCategories(),
          systemService.getSkills(),
          systemService.getEmploymentTypes(),
          languageService.getPublicLanguages(),
          levelService.getPublicLevels(),
        ]);
        if (!mounted) return;
        const normalizeList = (d: any) => {
          if (!d) return [];
          if (Array.isArray(d)) return d;
          if (Array.isArray(d.items)) return d.items;
          if (Array.isArray(d.data)) return d.data;
          if (Array.isArray(d.skills)) return d.skills;
          if (Array.isArray(d.employmentTypes)) return d.employmentTypes;
          if (Array.isArray(d.employments)) return d.employments;
          if (Array.isArray(d.languages)) return d.languages;
          if (Array.isArray(d.levels)) return d.levels;
          if (Array.isArray(d.categories)) return d.categories;
          if (Array.isArray(d.specializations)) return d.specializations;
          // fallback: return first array found on the object
          for (const k in d) {
            if (Array.isArray(d[k])) return d[k];
          }
          return [];
        };

        // Extract categories similar to create flow: support array or wrapped { categories: [...] }
        let categoriesData: any[] = [];
        if (catsResp?.data) {
          if (Array.isArray(catsResp.data)) categoriesData = catsResp.data;
          else if ((catsResp.data as any).categories && Array.isArray((catsResp.data as any).categories)) categoriesData = (catsResp.data as any).categories;
        }
        setCategories(categoriesData);
        setSkills(normalizeList(skillsResp?.data));
        setEmploymentTypes(normalizeList(empResp?.data));
        setLanguages(normalizeList(langsResp?.data));
        setLevels(normalizeList(levelsResp?.data));
      } catch {
        // ignore errors
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

    const normalizeLanguageValue = (val: any) => {
      if (val === null || val === undefined) return val;
      if (typeof val === 'number') return val;
      const s = String(val).trim();
      if (s === '') return val;
      const found = languages.find((l: any) => String((l as any).id) === s || String((l as any).languageId) === s || String((l as any).name).toLowerCase() === s.toLowerCase());
      if (found) return (found as any).id ?? (found as any).languageId;
      // fuzzy match
      const fuzzy = languages.find((l: any) => {
        const name = String((l as any).name).toLowerCase();
        const q = s.toLowerCase();
        return name.includes(q) || q.includes(name);
      });
      if (fuzzy) return (fuzzy as any).id ?? (fuzzy as any).languageId;
      return val;
    };

    if (job) {
        const base: any = {
        title: job.title,
        description: job.description,
        requirements: job.requirements,
        
        // Keep original values so user sees current textual values; we'll convert on submit
        employmentTypeIds: Array.isArray(job.employmentTypes)
          ? job.employmentTypes.map((t: any) => (typeof t === "object" ? (t.employTypeId ?? t.name) : t))
          : [],
        skillIds: Array.isArray(job.skills)
          ? job.skills.map((s: any) => (typeof s === "object" ? (s.skillId ?? s.name) : s))
          : [],
        languageIds: Array.isArray((job as any).languageIds)
          ? (job as any).languageIds.map((v: any) => normalizeLanguageValue(v))
          : Array.isArray((job as any).languages)
          ? (job as any).languages.map((l: any) => normalizeLanguageValue(typeof l === 'object' ? (l.id ?? l.languageId ?? l.name) : l))
          : [],
        // Ensure we extract an actual id if `job.level` is an object
        levelId:
          (job as any).levelId ??
          ((job as any).level && (job as any).level.id !== undefined ? (job as any).level.id : undefined) ??
          ((job as any).level && (job as any).level.levelId !== undefined ? (job as any).level.levelId : undefined) ??
          (job as any).level ??
          undefined,
        criteria: Array.isArray((job as any).criteria)
          ? (job as any).criteria.map((c: any) => {
              const name = c.name;
              // parse weight robustly (handle number, numeric string, or percentage)
              let importance = 5;
              try {
                let w = parseFloat(c.weight as any);
                if (!isNaN(w)) {
                  if (w > 1) w = w / 100; // treat >1 as percent
                  // preserve one decimal place for importance (e.g. 1.2)
                  importance = Math.max(0.1, Number((w * 10).toFixed(1)));
                }
              } catch {
                importance = 5;
              }
              return { name, importance };
            })
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
            // Ensure select option lists include current job values so they render
            const ensureOptions = () => {
              if (Array.isArray(base.employmentTypeIds)) {
                base.employmentTypeIds.forEach((val: any) => {
                  if (!employmentTypes.find((e: any) => e.employTypeId === val || String(e.name) === String(val))) {
                    setEmploymentTypes((prev) => [...prev, { name: String(val), employTypeId: val }]);
                  }
                });
              }
              if (Array.isArray(base.skillIds)) {
                base.skillIds.forEach((val: any) => {
                  if (!skills.find((s: any) => s.skillId === val || String(s.name) === String(val))) {
                    setSkills((prev) => [...prev, { name: String(val), skillId: val }]);
                  }
                });
              }
              if (Array.isArray(base.languageIds)) {
                base.languageIds.forEach((val: any) => {
                  if (!languages.find((l: any) => l.id === val || l.languageId === val || String(l.name) === String(val))) {
                    setLanguages((prev) => [...prev, { name: String(val), id: val }]);
                  }
                });
              }
              if (base.levelId) {
                setLevels((prev) => {
                  if (!prev.find((lv: any) => lv.id === base.levelId || lv.levelId === base.levelId || String(lv.name) === String(base.levelId))) {
                    return [...prev, { name: String(base.levelId), id: base.levelId }];
                  }
                  return prev;
                });
              }
            };

            ensureOptions();
            Promise.resolve().then(() => form.setFieldsValue(base));
          })();
        } else {
          // Ensure selects contain existing values even when no category match
          const ensureOptions = () => {
            if (Array.isArray(base.employmentTypeIds)) {
              base.employmentTypeIds.forEach((val: any) => {
                if (!employmentTypes.find((e: any) => e.employTypeId === val || String(e.name) === String(val))) {
                  setEmploymentTypes((prev) => [...prev, { name: String(val), employTypeId: val }]);
                }
              });
            }
            if (Array.isArray(base.skillIds)) {
              base.skillIds.forEach((val: any) => {
                if (!skills.find((s: any) => s.skillId === val || String(s.name) === String(val))) {
                  setSkills((prev) => [...prev, { name: String(val), skillId: val }]);
                }
              });
            }
            if (Array.isArray(base.languageIds)) {
              base.languageIds.forEach((val: any) => {
                if (!languages.find((l: any) => l.id === val || l.languageId === val || String(l.name) === String(val))) {
                  setLanguages((prev) => [...prev, { name: String(val), id: val }]);
                }
              });
            }
            if (base.levelId) {
              setLevels((prev) => {
                if (!prev.find((lv: any) => lv.id === base.levelId || lv.levelId === base.levelId || String(lv.name) === String(base.levelId))) {
                  return [...prev, { name: String(base.levelId), id: base.levelId }];
                }
                return prev;
              });
            }
          };

          ensureOptions();
          Promise.resolve().then(() => form.setFieldsValue(base));
        }
      } else {
        form.setFieldsValue(base);
      }
    } else {
      Promise.resolve().then(() => form.resetFields());
    }
  }, [job, form, open, categories, skills, employmentTypes, languages, levels]);

  return (
    <Drawer title="Edit Job" width={640} open={open} onClose={onClose}>
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          console.log("✅ onFinish called", values);
          if (!Array.isArray(values.criteria)) values.criteria = [];
          const crit = values.criteria || [];
          // require at least 2 criteria
          if (crit.length < 2) {
            form.setFields([
              {
                name: ["criteria"],
                errors: ["Please add at least 2 criteria"],
              },
            ]);
            return;
          }

          // Convert importance (1-10) to normalized decimal weights summing to 1
          const totalImportance = crit.reduce((acc: number, c: any) => acc + Number(c?.importance || 0), 0);
          if (totalImportance === 0) {
            form.setFields([
              {
                name: ["criteria"],
                errors: ["Invalid importance values"],
              },
            ]);
            return;
          }

          // Compute precise normalized weights and ensure they sum to exactly 1 after rounding
          const unrounded = crit.map((c: any) => Number(c.importance || 0) / totalImportance);
          const rounded: number[] = [];
          let sumRounded = 0;
          for (let i = 0; i < unrounded.length; i++) {
            if (i === unrounded.length - 1) {
              // last = 1 - sum(previous rounded) to guarantee sum equals 1
              const last = Number((1 - sumRounded).toFixed(4));
              rounded.push(last);
              sumRounded = Number((sumRounded + last).toFixed(4));
            } else {
              const r = Number(unrounded[i].toFixed(4));
              rounded.push(r);
              sumRounded = Number((sumRounded + r).toFixed(4));
            }
          }

          const processedCriteria = crit.map((c: any, index: number) => ({ name: c.name, weight: rounded[index] }));

          // normalize other fields similarly to create flow
          const payload = {
            ...values,
            employmentTypeIds: values.employmentTypeIds || [],
            skillIds: values.skillIds || [],
            languageIds: values.languageIds || [],
            levelId: values.levelId,
            criteria: processedCriteria,
          };

          // Ensure employmentTypeIds and skillIds are numeric IDs expected by API.
          const normalizeToId = (val: any, list: any[], idKey: string) => {
            if (val === null || val === undefined) return val;
            const n = Number(val);
            if (!isNaN(n)) return n;
            const found = list.find((it: any) => String(it[idKey]) === String(val) || String(it.name).toLowerCase() === String(val).toLowerCase());
            return found ? found[idKey] : val;
          };

          if (Array.isArray(payload.employmentTypeIds)) {
            payload.employmentTypeIds = payload.employmentTypeIds.map((v: any) => normalizeToId(v, employmentTypes, 'employTypeId'));
          }

          if (Array.isArray(payload.skillIds)) {
            payload.skillIds = payload.skillIds.map((v: any) => normalizeToId(v, skills, 'skillId'));
          }

          // If any ids remain non-numeric, abort and show error to user
          const nonNumericEmp = Array.isArray(payload.employmentTypeIds) && payload.employmentTypeIds.some((v: any) => v !== null && v !== undefined && isNaN(Number(v)));
          const nonNumericSkill = Array.isArray(payload.skillIds) && payload.skillIds.some((v: any) => v !== null && v !== undefined && isNaN(Number(v)));
          if (nonNumericEmp || nonNumericSkill) {
            form.setFields([
              {
                name: ['employmentTypeIds'],
                errors: nonNumericEmp ? ['Some employment types could not be resolved to IDs'] : [],
              },
              {
                name: ['skillIds'],
                errors: nonNumericSkill ? ['Some skills could not be resolved to IDs'] : [],
              },
            ]);
            return;
          }

          // Debug: log processed criteria and payload to inspect what's sent to API
          try {
            console.log("Processed criteria:", processedCriteria);
          } catch (e) {
            console.log("Processed criteria (unserializable)");
          }

          // Validate criteria: unique names and valid weights
          const names = processedCriteria.map((c: any) => String(c.name).trim().toLowerCase());
          const dup = names.filter((v: any, i: number) => names.indexOf(v) !== i);
          if (dup.length > 0) {
            form.setFields([
              {
                name: ["criteria"],
                errors: ["Criteria names must be unique"],
              },
            ]);
            return;
          }

          const totalWeight = processedCriteria.reduce((s: number, c: any) => s + Number(c.weight || 0), 0);
          try {
            console.log("Total criteria weight:", totalWeight);
            console.log("Submitting payload:", { ...payload });
          } catch (e) {
            console.log("Payload (unserializable)");
          }
          if (!Number.isFinite(totalWeight) || Math.abs(totalWeight - 1) > 0.0001) {
            form.setFields([
              {
                name: ["criteria"],
                errors: ["Invalid criteria weights (must sum to 1)"],
              },
            ]);
            return;
          }

          onSubmit(payload);
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
          { max: 2000, message: "Requirements must not exceed 2000 characters" }
        ]}>
          <Input.TextArea rows={3} maxLength={2000} showCount />
        </Form.Item>

        {/* targetQuantity removed - users edit language and level instead */}

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
        </div>

        <Form.Item name="criteria" label="Criteria Assessment">
          <Form.List name="criteria" initialValue={[{ name: "", importance: 5 }, { name: "", importance: 5 }]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => {
                  const { key, ...restField } = field as any;
                  // importance slider (1-10) for editing, we'll normalize to weights on submit
                  // compute live totals so we can show current importance and percent next to the name
                  const critList = form.getFieldValue('criteria') || [];
                  const totalImportance = Array.isArray(critList) ? critList.reduce((s: number, it: any) => s + Number(it?.importance || 0), 0) : 0;
                  const currentImportance = parseFloat(form.getFieldValue(['criteria', field.name, 'importance']) || 0);
                  const estimatedPercent = totalImportance > 0 ? ((currentImportance / totalImportance) * 100) : 0;

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
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                        <Form.Item
                          {...restField}
                          name={[field.name, "name"]}
                          rules={[
                            { required: true, message: "Please input criteria name" },
                            { max: 70, message: "Criteria name must not exceed 70 characters" }
                          ]}
                          style={{ flex: 1, marginBottom: 0 }}
                        >
                          <Input placeholder="Criteria name" maxLength={70} />
                        </Form.Item>
                        <div style={{ width: 92, textAlign: 'right', fontSize: 12, color: 'rgba(0,0,0,0.65)' }}>
                          {/* <div>{Number.isFinite(currentImportance) ? currentImportance.toFixed(1) : '0.0'}</div> */}
                          <div style={{ fontWeight: 600 }}>~{Number.isFinite(estimatedPercent) ? estimatedPercent.toFixed(1) : '0.0'}%</div>
                        </div>
                      </div>

                      <Form.Item
                        {...restField}
                        name={[field.name, "importance"]}
                        initialValue={5}
                        rules={[
                          { required: true, message: "Please input importance" },
                        ]}
                        style={{ width: 220, margin:" 0 10px" }}
                      >
                        <Slider
                          min={0.1}
                          max={10}
                          step={0.1}
                          marks={{ 0.1: '0.1', 5: '5', 10: '10' }}
                          tooltip={{ formatter: (v) => `${(v as number).toFixed(1)}` }}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>

                      {index === fields.length - 1 ? (
                        <PlusCircleOutlined
                          onClick={() => {
                            add();
                            form.setFields([{ name: ["criteria"], errors: [] }]);
                          }}
                          style={{ color: "var(--color-primary-light)", cursor: "pointer", fontSize: 18 }}
                        />
                      ) : (
                        <MinusCircleOutlined
                          onClick={() => {
                            remove(field.name);
                            form.setFields([{ name: ["criteria"], errors: [] }]);
                          }}
                          style={{ color: "red", cursor: "pointer", fontSize: 18 }}
                        />
                      )}
                    </div>
                  );
                })}
                <div style={{ marginTop: 6, color: "rgba(0,0,0,0.45)", fontSize: 12 }}>
                  At least 2 criteria required. Importance values will be normalized to weights on save.
                </div>
              </>
            )}
          </Form.List>
        </Form.Item>

        <Form.Item name="employmentTypeIds" label="Employment Types" rules={[{ required: true, message: "Please select employment types" }]}>
          <Select
            className="company-select"
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

        <Form.Item name="skillIds" label="Skills" rules={[{ required: true, message: "Please select skills" }]}>
          <Select
            className="company-select"
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

        <div style={{ display: "flex", gap: "16px" }}>
          <Form.Item name="languageIds" label="Languages" style={{ width: "50%" }} rules={[{ required: false, message: "Please select languages" }]}>
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

          <Form.Item name="levelId" label="Level" style={{ width: "50%" }} rules={[{ required: false, message: "Please select a level" }]}>
            <Select
              className="company-select"
              size="middle"
              placeholder={loadingLevels ? "Loading levels..." : "Select level"}
              loading={loadingLevels}
              allowClear
              options={levels.map((l: any) => ({ label: l.name, value: l.id ?? l.levelId }))}
              style={{ minHeight: 40 }}
            />
          </Form.Item>
        </div>

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
            <Button className="company-btn--filled" htmlType="submit" loading={saving}>
              Save
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default JobEditDrawer;
