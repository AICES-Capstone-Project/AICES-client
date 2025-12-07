import { useState, useEffect } from "react";
import { Card, Button, Badge, Form, Input, Select } from "antd";
import { BellOutlined, PlusOutlined, HistoryOutlined, SearchOutlined } from "@ant-design/icons";

// --- SERVICES ---
import { jobService } from "../../../services/jobService";
import { categoryService } from "../../../services/categoryService";
import type { CompanyJob } from "../../../services/jobService";

// --- HOOKS & CONFIG ---
import { useAppSelector } from "../../../hooks/redux";
import { ROLES } from "../../../services/config";
import { toastError, toastSuccess } from "../../../components/UI/Toast";

// --- COMPONENTS ---
import JobTable from "./components/JobTable";
import JobViewDrawer from "./components/JobViewDrawer";
import PendingDrawer from "./components/PendingDrawer";
import JobEditDrawer from "./components/JobEditDrawer";
import JobCreateDrawer from "./components/JobCreateDrawer";
import PostedJobsDrawer from "./components/JobPostedDrawer";

const JobManagement = () => {
  // --- STATE DỮ LIỆU ---
  const [jobs, setJobs] = useState<CompanyJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<CompanyJob[]>([]);
  const [loading, setLoading] = useState(false);

  // --- STATE FILTER & METADATA ---
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [specializations, setSpecializations] = useState<any[]>([]);

  // Lưu NAME để filter
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [selectedSpecName, setSelectedSpecName] = useState<string | null>(null);

  // --- STATE DRAWER ---
  const [pendingDrawerOpen, setPendingDrawerOpen] = useState(false);
  const [pendingJobs, setPendingJobs] = useState<CompanyJob[]>([]);
  const [pendingCount, setPendingCount] = useState(0);

  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<CompanyJob | null>(null);
  const [viewingPending, setViewingPending] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<CompanyJob | null>(null);
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [postedDrawerOpen, setPostedDrawerOpen] = useState(false);
  const [postedJobs, setPostedJobs] = useState<CompanyJob[]>([]);
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const { user } = useAppSelector((s) => s.auth);
  const isHrManager = (user?.roleName || "").toLowerCase() === (ROLES.Hr_Manager || "").toLowerCase();

  // --- API CALLS ---
  const sortByTitle = (arr: CompanyJob[] = []) =>
    arr.slice().sort((a, b) => (a.title || "").localeCompare(b.title || ""));

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const resp = await jobService.getCompanyJobs(1, 100);
      if (resp?.status?.toLowerCase() === "success") {
        const serverJobs = resp.data?.jobs || [];
        setJobs(sortByTitle(serverJobs));
      }
    } catch (err) {
      toastError("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingJobs = async () => {
    try {
      const resp = await jobService.getPendingJobs(1, 20);
      if (resp?.status?.toLowerCase() === "success") {
        setPendingJobs(resp.data?.jobs || []);
        setPendingCount(resp.data?.jobs?.length || 0);
      }
    } catch {
      setPendingJobs([]);
    }
  };

  const fetchPostedJobs = async () => {
    try {
      const resp = await jobService.getPostedJobs(1, 20);
      if (resp?.status?.toLowerCase() === "success") {
        setPostedJobs(resp.data?.jobs || []);
      }
    } catch {
      setPostedJobs([]);
    }
  };

  // Logic Fetch Categories
  const fetchCategories = async () => {
    try {
      const catsResp = await categoryService.getAll({ page: 1, pageSize: 100 });
      let categoriesData: any[] = [];
      if (catsResp?.data) {
        if (Array.isArray(catsResp.data)) {
          categoriesData = catsResp.data;
        } else if ((catsResp.data as any).categories && Array.isArray((catsResp.data as any).categories)) {
          categoriesData = (catsResp.data as any).categories;
        }
      }
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  // Logic Handle Category Change
  const handleCategoryChange = async (catName: string) => {
    setSelectedCategoryName(catName);
    
    // Reset Spec
    setSelectedSpecName(null);
    setSpecializations([]);

    if (!catName) return;

    const foundCat = categories.find((c) => c.name === catName);
    const catId = foundCat?.categoryId || foundCat?.id;

    if (catId) {
      try {
        const resp = await categoryService.getSpecializations(catId);
        setSpecializations(resp?.data || []);
      } catch (error) {
        console.error("Failed to load specializations", error);
        toastError("Could not load specializations");
      }
    }
  };

  // --- CRUD HANDLERS ---
  const handleEdit = (job: CompanyJob) => { setEditingJob(job); setEditDrawerOpen(true); };
  
  const handleCreate = async (values: any) => {
    setSaving(true);
    try {
      const payload: any = { ...values };
      if (Array.isArray(values.employmentTypes)) {
        payload.employmentTypeIds = values.employmentTypes.map((v: any) => Number(v));
        delete payload.employmentTypes;
      }
      if (Array.isArray(values.skills)) {
        payload.skillIds = values.skills.map((v: any) => Number(v));
        delete payload.skills;
      }
      if (Array.isArray(values.criteria)) {
        payload.criteria = values.criteria.map((c: any) => ({ name: c.name, weight: Number(c.weight) }));
      }
      if (Array.isArray(payload.employmentTypeIds) && payload.employmentTypeIds.length === 0) delete payload.employmentTypeIds;
      if (Array.isArray(payload.skillIds) && payload.skillIds.length === 0) delete payload.skillIds;
      if (Array.isArray(payload.criteria) && payload.criteria.length === 0) delete payload.criteria;

      const resp = await jobService.createJob(payload);
      if (resp?.status && String(resp.status).toLowerCase() === "success") {
        toastSuccess("Job created successfully");
        fetchJobs();
        fetchPendingJobs();
        return true;
      } else {
        toastError("Failed to create job", resp?.message);
      }
    } catch (err) {
      toastError("Error while creating job");
    } finally {
      setSaving(false);
    }
    return false;
  };

  const handleUpdate = async (values: any) => {
    if (!editingJob) return;
    setSaving(true);
    try {
      const payload: any = { ...values };
      if (Array.isArray(values.employmentTypes)) {
        payload.employmentTypeIds = values.employmentTypes.map((v: any) => Number(v));
        delete payload.employmentTypes;
      }
      if (Array.isArray(values.skills)) {
        payload.skillIds = values.skills.map((v: any) => Number(v));
        delete payload.skills;
      }
      if (Array.isArray(values.criteria)) {
        payload.criteria = values.criteria.map((c: any) => ({ name: c.name, weight: Number(c.weight) }));
      }
      const resp = await jobService.updateJob(editingJob.jobId, payload);
      if (resp.status && String(resp.status).toLowerCase() === "success") {
        toastSuccess("Job updated successfully!");
        setEditDrawerOpen(false);
        setEditingJob(null);
        form.resetFields();
        fetchJobs();
        fetchPendingJobs();
      } else {
        toastError("Failed to update job", resp?.message);
      }
    } catch (err) {
      toastError("Error while updating job");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (job: CompanyJob) => {
    try {
      const resp = await jobService.deleteJob(job.jobId);
      if (resp?.status?.toLowerCase() === "success") {
        toastSuccess("Job deleted");
        fetchJobs();
        fetchPendingJobs();
      } else {
        toastError("Failed to delete job");
      }
    } catch {
      toastError("Failed to delete job");
    }
  };

  const handleView = async (job: CompanyJob) => {
    try {
      const resp = await jobService.getJobById(job.jobId);
      if (resp?.status?.toLowerCase() === "success") {
        setSelectedJob(resp.data);
      } else {
        setSelectedJob(job);
      }
      setViewDrawerOpen(true);
    } catch {
      setSelectedJob(job);
      setViewDrawerOpen(true);
    }
  };

  const handleViewPending = async (job: CompanyJob) => {
    try {
      const resp = await jobService.getPendingJobById(job.jobId);
      if (resp?.status?.toLowerCase() === "success") {
        setSelectedJob(resp.data);
      } else {
        setSelectedJob(job);
      }
      setPendingDrawerOpen(false);
      setViewingPending(true);
      setViewDrawerOpen(true);
    } catch {
      setSelectedJob(job);
      setPendingDrawerOpen(false);
      setViewingPending(true);
      setViewDrawerOpen(true);
    }
  };

  const handleApprove = async (job: CompanyJob) => {
    try {
      const resp = await jobService.updateJobStatus(job.jobId, "Published");
      if (resp?.status && String(resp.status).toLowerCase() === "success") {
        fetchPendingJobs();
        fetchJobs();
        toastSuccess("Job approved successfully");
        return true;
      }
      if (resp?.message) {
        toastError("Failed to approve job", resp.message);
        return false;
      }
    } catch (err: any) {
      const serverMsg = err?.response?.data?.message || err?.message;
      if (serverMsg) toastError("Failed to approve job", serverMsg);
    }
    return false;
  };

  // --- EFFECTS ---
  useEffect(() => {
    fetchJobs();
    fetchPendingJobs();
    fetchCategories(); 
  }, []);

  // Polling fallback for realtime updates (refresh jobs and pending jobs periodically)
  useEffect(() => {
    if (!isHrManager) return; // only poll for HR managers who care about pending
    let mounted = true;
    const intervalMs = 10000; // 10 seconds
    const id = setInterval(async () => {
      if (!mounted) return;
      try {
        await fetchPendingJobs();
        await fetchJobs();
      } catch (e) {
        // ignore polling errors
      }
    }, intervalMs);

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [isHrManager]);

  // Filter Logic
  useEffect(() => {
    let result = [...jobs];

    if (searchText) {
      const v = searchText.trim().toLowerCase();
      result = result.filter(
        (j) =>
          j.title?.toLowerCase().includes(v) ||
          j.categoryName?.toLowerCase().includes(v) ||
          j.specializationName?.toLowerCase().includes(v)
      );
    }

    if (selectedCategoryName) {
      result = result.filter((j) => j.categoryName === selectedCategoryName);
    }

    if (selectedSpecName) {
      result = result.filter((j) => j.specializationName === selectedSpecName);
    }

    setFilteredJobs(result);
  }, [jobs, searchText, selectedCategoryName, selectedSpecName]);

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 16 }}>
          <div style={{ flex: '0 0 auto' }}>
            <span className="font-semibold">Jobs</span>
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 10 }}>
            <Input
              placeholder="Search title..."
              prefix={<SearchOutlined />}
              allowClear
              style={{ width: 240 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            
            {/* SELECT CATEGORY */}
            <Select
              placeholder="Select Category"
              allowClear
              style={{ width: 180 }}
              value={selectedCategoryName}
              onChange={handleCategoryChange} 
              options={categories.map((c: any) => ({ 
                label: c.name, 
                value: c.name 
              }))}
            />

            {/* 🔥 SELECT SPECIALIZATION - CHỈ HIỆN KHI CÓ CATEGORY */}
            {selectedCategoryName && (
              <Select
                placeholder="Select Specialization"
                allowClear
                style={{ width: 180 }}
                value={selectedSpecName}
                onChange={(val) => setSelectedSpecName(val)}
                options={specializations.map((s: any) => ({ 
                  label: s.name, 
                  value: s.name 
                }))}
              />
            )}
          </div>

          <div style={{ flex: '0 0 auto' }}>
            <div className="flex gap-2 items-center">
              {isHrManager && (
                <Button
                  className="company-btn--filled"
                  icon={<BellOutlined style={{ fontSize: 16 }} />}
                  onClick={() => {
                    fetchPendingJobs();
                    setPendingDrawerOpen(true);
                  }}
                >
                  <Badge className="company-badge" count={pendingCount} size="small" offset={[-15, -13]} />
                  <span>Pending</span>
                </Button>
              )}
              <Button
                className="company-btn"
                icon={<HistoryOutlined />}
                onClick={async () => {
                  await fetchPostedJobs();
                  setPostedDrawerOpen(true);
                }}
              >
                My posted
              </Button>
              <Button
                className="company-btn--filled"
                icon={<PlusOutlined />}
                onClick={() => setCreateDrawerOpen(true)}
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      }
      style={{
        maxWidth: 1200,
        margin: "12px auto",
        borderRadius: 12,
        height: 'calc(100% - 25px)',
      }}
    >
      <JobTable
        jobs={filteredJobs}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <JobViewDrawer
        open={viewDrawerOpen}
        onClose={() => {
          setViewDrawerOpen(false);
          setSelectedJob(null);
          setViewingPending(false);
        }}
        job={selectedJob}
        isPending={viewingPending}
        onApprove={handleApprove}
      />

      <PendingDrawer
        open={pendingDrawerOpen}
        onClose={() => setPendingDrawerOpen(false)}
        pendingJobs={pendingJobs}
        onApprove={handleApprove}
        onView={handleViewPending}
      />

      <JobEditDrawer
        open={editDrawerOpen}
        onClose={() => {
          setEditDrawerOpen(false);
          setEditingJob(null);
          form.resetFields();
        }}
        job={editingJob}
        form={form}
        onSubmit={handleUpdate}
        saving={saving}
      />

      <JobCreateDrawer
        open={createDrawerOpen}
        onClose={() => setCreateDrawerOpen(false)}
        onSubmit={handleCreate}
        saving={saving}
      />

      <PostedJobsDrawer
        open={postedDrawerOpen}
        onClose={() => setPostedDrawerOpen(false)}
        postedJobs={postedJobs}
      />
    </Card>
  );
};

export default JobManagement;