import { useState, useEffect } from "react";
import { Card, message, Button, Badge, Form } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { jobService } from "../../../services/jobService";
import type { CompanyJob } from "../../../services/jobService";
import { useAppSelector } from "../../../hooks/redux";
import { ROLES } from "../../../services/config";
import JobTable from "./components/JobTable";
import JobSearchBar from "./components/JobSearchBar";
import JobViewDrawer from "./components/JobViewDrawer";
import PendingDrawer from "./components/PendingDrawer";
import JobEditDrawer from "./components/JobEditDrawer";

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
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const handleEdit = (job: CompanyJob) => {
    setEditingJob(job);
    setEditDrawerOpen(true);
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
      const resp = await jobService.updateJob(editingJob.jobId, values);
      if (resp?.status?.toLowerCase() === "success") {
        message.success("Job updated successfully");
        setEditDrawerOpen(false);
        setEditingJob(null);
        form.resetFields();
        fetchJobs(); // reload danh sách
      } else {
        message.error("Failed to update job");
      }
    } catch {
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
          <span className="font-semibold">Job Management</span>
          <div className="flex gap-2 items-center">
            {isHrManager && (
              <Button
                onClick={() => {
                  fetchPendingJobs();
                  setPendingDrawerOpen(true);
                }}
              >
                <Badge count={pendingCount} size="small" offset={[-2, 1]}>
                  <BellOutlined className="text-[16px]" />
                </Badge>
                <span className="ml-2">Pending Jobs</span>
              </Button>
            )}
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

    </Card>
  );
};

export default JobManagement;
