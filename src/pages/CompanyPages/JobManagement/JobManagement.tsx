import { useState, useEffect } from "react";
import { Card, message, Modal, Button } from "antd";
import { jobService } from "../../../services/jobService";
import type { CompanyJob } from "../../../services/jobService";
import { Form } from "antd";
import { useAppSelector } from "../../../hooks/redux";
import { ROLES } from "../../../services/config";
import JobViewDrawer from "./components/JobViewDrawer";
import JobEditDrawer from "./components/JobEditDrawer";
import JobTable from "./components/JobTable";
import JobSearchBar from "./components/JobSearchBar";
import PendingDrawer from "./components/PendingDrawer";

// Search component is provided via JobSearchBar

const JobManagement = () => {
	const [jobs, setJobs] = useState<CompanyJob[]>([]);
	const [filteredJobs, setFilteredJobs] = useState<CompanyJob[]>([]);
	const [loading, setLoading] = useState(false);
	const [pendingDrawerOpen, setPendingDrawerOpen] = useState(false);
	const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
	const [editDrawerOpen, setEditDrawerOpen] = useState(false);
	const [selectedJob, setSelectedJob] = useState<CompanyJob | null>(null);
	const [editForm] = Form.useForm();

	// Fetch company jobs data
	const fetchJobs = async () => {
		setLoading(true);
		try {
			const response = await jobService.getCompanyJobs(1, 100); // fetch first 100 for management view
			if (response?.status === "Success" || response?.status === "success") {
				const jobsData = response.data?.jobs || [];
				setJobs(jobsData);
				setFilteredJobs(jobsData);
			} else {
				message.error("Failed to fetch jobs");
			}
		} catch (error) {
			console.error("Error fetching jobs:", error);
			message.error("Error fetching jobs");
		} finally {
			setLoading(false);
		}
	};

	const { user } = useAppSelector((s) => s.auth);
	const isHrManager = (user?.roleName || "").toLowerCase() === (ROLES.Hr_Manager || "").toLowerCase();

	useEffect(() => {
		fetchJobs();
	}, []);

	// Table columns moved to JobTable component

	// Action handlers
	const handleView = (job: CompanyJob) => {
		setSelectedJob(job);
		setViewDrawerOpen(true);
	};

	const handleEdit = (job: CompanyJob) => {
		setSelectedJob(job);
		setEditDrawerOpen(true);
	};

	const handleDelete = (job: CompanyJob) => {
		Modal.confirm({
			title: "Delete Job",
			content: `Are you sure you want to delete "${job.title}"? This action cannot be undone.`,
			okText: "Delete",
			okType: "danger",
			cancelText: "Cancel",
			onOk: async () => {
				try {
					const response = await jobService.deleteJob(job.jobId);
					if (response?.status === "Success") {
						message.success("Job deleted successfully");
						fetchJobs();
					} else {
						message.error(response?.message || "Failed to delete job");
					}
				} catch (error) {
					console.error("Error deleting job:", error);
					message.error("Error deleting job");
				}
			},
		});
	};

	const handleCreateNew = () => {
		message.info("Redirecting to create new job...");
	};



	const isJobPending = (j: any) => {
		const s = (j as any).status || (j as any).publishStatus || (j as any).isActive;
		if (typeof s === 'boolean') return s === false;
		if (typeof s === 'string') return s.toLowerCase() === 'draft' || s.toLowerCase() === 'pending';
		return false;
	};

	const pendingJobs = jobs.filter(isJobPending);

	const handleApprove = async (job: CompanyJob) => {
		try {
			// Try to set status to 'Open' or isActive to true; backend may accept either field
			const response = await jobService.updateJob(job.jobId, { status: 'Open', isActive: true } as any);
			if (response?.status === 'Success') {
				message.success('Job approved');
				// refresh lists
				fetchJobs();
			} else {
				message.error(response?.message || 'Failed to approve job');
			}
		} catch (err) {
			console.error('Error approving job', err);
			message.error('Error approving job');
		}
	};

	// Handle edit submit from drawer
	const handleEditSubmit = async (values: any) => {
		if (!selectedJob) return;

		// Normalize employmentTypes and skills fields which may be comma-separated strings
		const normalizeToArray = (val: any) => {
			if (!val) return [];
			if (Array.isArray(val)) return val;
			if (typeof val === "string") return val.split(",").map((s) => s.trim()).filter(Boolean);
			return [];
		};

		const payload: any = {
			title: values.title,
			description: values.description,
			requirements: values.requirements,
			specializationName: values.specializationName,
			employmentTypes: normalizeToArray(values.employmentTypes),
			skills: normalizeToArray(values.skills),
		};

		try {
			const response = await jobService.updateJob(selectedJob.jobId, payload);
			if (response?.status === "Success") {
				message.success("Job updated successfully");
				setEditDrawerOpen(false);
				setSelectedJob(null);
				editForm.resetFields();
				fetchJobs();
			} else {
				message.error(response?.message || "Failed to update job");
			}
		} catch (error) {
			console.error("Error updating job:", error);
			message.error("Error updating job");
		}
	};

	const handleSearch = (value: string) => {
		const v = value.trim().toLowerCase();
		if (!v) {
			setFilteredJobs(jobs);
			return;
		}
		const filtered = jobs.filter(job =>
			(job.title || "").toLowerCase().includes(v) ||
			(job.description || "").toLowerCase().includes(v) ||
			(job.categoryName || "").toLowerCase().includes(v) ||
			(job.specializationName || "").toLowerCase().includes(v)
		);
		setFilteredJobs(filtered);
	};

	return (
		<Card
			title={<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
				<span style={{ fontWeight: 600 }}>Job Management</span>
				<div style={{ display: 'flex', gap: 8 }}>
					{isHrManager && <Button onClick={() => setPendingDrawerOpen(true)}>Pending</Button>}
					<Button type="primary" onClick={handleCreateNew}>
						Create New Job
					</Button>
				</div>
			</div>}
			style={{
				maxWidth: 1200,
				margin: "12px auto",
				padding: "0 5px",
				borderRadius: 12,
				boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
			}}
		>
			<div className="w-full">
				<JobSearchBar onSearch={handleSearch} />

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
					}}
					job={selectedJob}
				/>

				<PendingDrawer
					open={pendingDrawerOpen}
					onClose={() => setPendingDrawerOpen(false)}
					pendingJobs={pendingJobs}
					onApprove={handleApprove}
					onView={(job) => {
						setSelectedJob(job);
						setViewDrawerOpen(true);
					}}
				/>

				<JobEditDrawer
					open={editDrawerOpen}
					onClose={() => {
						setEditDrawerOpen(false);
						setSelectedJob(null);
					}}
					job={selectedJob}
					form={editForm}
					onSubmit={handleEditSubmit}
				/>
			</div>
		</Card>
	);
};

export default JobManagement;
