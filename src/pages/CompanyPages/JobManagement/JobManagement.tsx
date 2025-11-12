import { useState, useEffect } from "react";
import { Card, message, Button, Badge, Form } from "antd";
import { BellOutlined, PlusOutlined, HistoryOutlined } from "@ant-design/icons";
import { jobService } from "../../../services/jobService";
import type { CompanyJob } from "../../../services/jobService";
import { useAppSelector } from "../../../hooks/redux";
import { ROLES } from "../../../services/config";
import JobTable from "./components/JobTable";
import JobSearchBar from "./components/JobSearchBar";
import JobViewDrawer from "./components/JobViewDrawer";
import PendingDrawer from "./components/PendingDrawer";
import JobEditDrawer from "./components/JobEditDrawer";
import JobCreateDrawer from "./components/JobCreateDrawer";
import PostedJobsDrawer from "./components/JobPostedDrawer";

const JobManagement = () => {
  const [jobs, setJobs] = useState<CompanyJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<CompanyJob[]>([]);
  const [loading, setLoading] = useState(false);

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

  const handleEdit = (job: CompanyJob) => {
    setEditingJob(job);
    setEditDrawerOpen(true);
  };

  const handleCreate = async (values: any) => {
    console.log("📝 Form values gửi lên API:", values);
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
        message.success("Job created successfully");
        // don't force-close drawer here; let caller decide (to show 'Chờ duyệt' for recruiters)
        fetchJobs();
        fetchPendingJobs();
        return true;
      } else {
        message.error(resp?.message || "Failed to create job");
      }
    } catch (err) {
      console.error("❌ Lỗi khi gọi API create job:", err);
      message.error("Error while creating job");
    } finally {
      setSaving(false);
    }
    return false;
  };

  const { user } = useAppSelector((s) => s.auth);
  const isHrManager =
    (user?.roleName || "").toLowerCase() ===
    (ROLES.Hr_Manager || "").toLowerCase();

  const sortByTitle = (arr: CompanyJob[] = []) =>
    arr.slice().sort((a, b) => (a.title || "").localeCompare(b.title || ""));

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const resp = await jobService.getCompanyJobs(1, 100);
      if (resp?.status?.toLowerCase() === "success") {
        const serverJobs = resp.data?.jobs || [];
        const sorted = sortByTitle(serverJobs);
        setJobs(sorted);
        setFilteredJobs(sorted);
      }
    } catch (err) {
      message.error("Failed to fetch jobs");
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
      setPendingCount(0);
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

  const handleView = async (job: CompanyJob) => {
    try {
      const resp = await jobService.getJobById(job.jobId);
      console.log(resp.data);
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

  const handleUpdate = async (values: any) => {
    if (!editingJob) return;
    setSaving(true);
    try {
      const payload: any = { ...values };
      console.log("📦 Raw form values:", values);

      // Map to API expected shape (same mapping as create)
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

      console.log("📤 Final payload trước khi gọi API:", payload);
      const resp = await jobService.updateJob(editingJob.jobId, payload);
      console.log("🔍 API response:", resp); // <-- thêm dòng này

      if (resp.status && typeof resp.status === "string" && resp.status.toLowerCase() === "success") {
        message.success("Job updated successfully!");
        // close and reset
        setEditDrawerOpen(false);
        setEditingJob(null);
        form.resetFields();
        fetchJobs();
        fetchPendingJobs();
      } else {
        console.error("❌ API error:", resp);
        message.error(resp?.message || "Failed to update job");
      }

    } catch (err) {
      console.error("❌ Error updating job:", err);
      message.error("Error while updating job");
    } finally {
      setSaving(false);
    }
  };


  const handleApprove = async (job: CompanyJob) => {
    try {
      const resp = await jobService.updateJobStatus(job.jobId, "Published");
      if (resp?.status?.toLowerCase() === "success") {
        fetchPendingJobs();
        fetchJobs();
        message.success("Job approved successfully");
        return true;
      }
    } catch {
      // fall-through
    }
    message.error("Failed to approve job");
    return false;
  };

  const handleSearch = (value: string) => {
    const v = value.trim().toLowerCase();
    if (!v) return setFilteredJobs(jobs);
    setFilteredJobs(
      jobs.filter(
        (j) =>
          j.title?.toLowerCase().includes(v) ||
          j.categoryName?.toLowerCase().includes(v) ||
          j.specializationName?.toLowerCase().includes(v)
      )
    );
  };

  const handleDelete = async (job: CompanyJob) => {
    try {
      const resp = await jobService.deleteJob(job.jobId);
      if (resp?.status?.toLowerCase() === "success") {
        message.success("Job deleted");
        fetchJobs();
        fetchPendingJobs();
      } else {
        message.error("Failed to delete job");
      }
    } catch {
      message.error("Failed to delete job");
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchPendingJobs();
  }, []);

  return (
    <Card
      title={
        <div className="flex justify-between items-center w-full">
          <span className="font-semibold">Jobs</span>
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
              onClick={() => {
                setCreateDrawerOpen(true);
              }}
            >
              Create
            </Button>
          </div>
        </div>
      }
      style={{
        maxWidth: 1200,
        margin: "12px auto",
        borderRadius: 12,
      }}
    >
      <JobSearchBar onSearch={handleSearch} />

      <JobTable
        jobs={filteredJobs}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Drawer: View job details */}
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

      {/* Drawer: Pending jobs */}
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
