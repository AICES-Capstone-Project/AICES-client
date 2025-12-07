import React, { useEffect, useState, useMemo } from "react";
import {
	Card,
	Table,
	Tag,
	Button,
	Drawer,
	Space,
	Upload,
	message,
	Popover,
	Modal,
	Input,
	Tooltip,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import {
	ArrowLeftOutlined,
	InboxOutlined,
	TeamOutlined,
	EyeOutlined,
	EditOutlined,
	ReloadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import resumeService from "../../../../services/resumeService";
import { toastError, toastSuccess } from "../../../../components/UI/Toast";

interface Resume {
	resumeId: number;
	fullName: string;
	status: string;
	totalResumeScore: number | null;
	email?: string;
	phoneNumber?: string;
	fileUrl?: string;
	aiExplanation?: string;
	scoreDetails?: Array<{
		criteriaId: number;
		criteriaName: string;
		matched: number;
		score: number;
		aiNote: string;
	}>;
}

const ResumeList: React.FC = () => {
	const { jobId } = useParams<{ jobId: string }>();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [resumes, setResumes] = useState<Resume[]>([]);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
	const [loadingDetail, setLoadingDetail] = useState(false);
	const [uploadDrawerOpen, setUploadDrawerOpen] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [editMode, setEditMode] = useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [confirmInput, setConfirmInput] = useState("");
	const [deletingMultiple, setDeletingMultiple] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [jobTitle, setJobTitle] = useState<string>("");
	const [scoreFilter, setScoreFilter] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });

	// Ensure displayed order is always by score desc (nulls last)
	const sortedResumes = useMemo(() => {
		let filtered = resumes.slice();

		// Apply score filter
		if (scoreFilter.min !== null || scoreFilter.max !== null) {
			filtered = filtered.filter((r) => {
				const score = r.totalResumeScore;
				if (score == null) return false;
				if (scoreFilter.min !== null && score < scoreFilter.min) return false;
				if (scoreFilter.max !== null && score > scoreFilter.max) return false;
				return true;
			});
		}

		return filtered.sort((a, b) => {
			const aS = a.totalResumeScore;
			const bS = b.totalResumeScore;
			if (aS == null && bS == null) return a.resumeId - b.resumeId;
			if (aS == null) return 1;
			if (bS == null) return -1;
			if (bS !== aS) return bS - aS;
			return a.resumeId - b.resumeId;
		});
	}, [resumes, scoreFilter]);

	useEffect(() => {
		if (jobId) {
			loadJobInfo();
			loadResumes();
		}
	}, [jobId]);

	const loadJobInfo = async () => {
		try {
			const { jobService } = await import("../../../../services/jobService");
			const resp = await jobService.getJobById(Number(jobId));
			if (String(resp?.status || "").toLowerCase() === "success" && resp.data) {
				setJobTitle(resp.data.title || "");
			}
		} catch (e) {
			console.error("Failed to load job info:", e);
		}
	};

	const loadResumes = async () => {
		setLoading(true);
		try {
			console.debug("[ResumeList] calling resumeService.getByJob", { jobId });
			const resp = await resumeService.getByJob(Number(jobId));
			console.debug("[ResumeList] resumeService.getByJob response", resp);

			if (String(resp?.status || "").toLowerCase() === "success" && resp.data) {
				const raw = Array.isArray(resp.data) ? resp.data : resp.data.items || [];
				const resumeList = (Array.isArray(raw) ? raw : []) as any[];
				const mapped: Resume[] = resumeList.map((r) => ({
					resumeId: r.resumeId,
					fullName: r.fullName || r.candidateName || "Unknown",
					status: r.status || r.stage || "Processing",
					totalResumeScore: r.totalResumeScore ?? null,
					email: r.email,
					phoneNumber: r.phone || r.phoneNumber,
					fileUrl: r.fileUrl,
					aiExplanation: r.aiExplanation,
					scoreDetails: r.scoreDetails,
				}));
				// Sort by totalResumeScore descending (highest first). Place null/undefined scores last.
				// For equal scores, fallback to resumeId ascending for stable order.
				const sortedList = mapped.slice().sort((a, b) => {
					const aS = a.totalResumeScore;
					const bS = b.totalResumeScore;
					if (aS == null && bS == null) return a.resumeId - b.resumeId;
					if (aS == null) return 1; // a should come after b
					if (bS == null) return -1; // b should come after a
					if (bS !== aS) return bS - aS; // descending numeric
					return a.resumeId - b.resumeId;
				});
				setResumes(sortedList);
			} else {
				message.error(resp?.message || "Unable to load resumes");
			}
		} catch (e) {
			console.error("Failed to load resumes:", e);
			toastError("Unable to load resumes");
		} finally {
			setLoading(false);
		}
	};

	// canRetrySelected: true only when at least one selected and ALL selected have status === "Failed"
	const canRetrySelected = useMemo(() => {
		if (!selectedRowKeys || selectedRowKeys.length === 0) return false;
		// map to numbers and find the resume objects
		const ids = selectedRowKeys.map((k) => Number(k));
		const selected = resumes.filter((r) => ids.includes(r.resumeId));
		if (selected.length === 0) return false;
		return selected.every((r) => String(r.status) === "Failed");
	}, [selectedRowKeys, resumes]);

	// compute score counts to detect duplicates (based on displayed/sorted list)
	const scoreCounts = useMemo(() => {
		const m = new Map<number, number>();
		for (const r of sortedResumes) {
			if (r.totalResumeScore != null) {
				m.set(r.totalResumeScore, (m.get(r.totalResumeScore) || 0) + 1);
			}
		}
		return m;
	}, [sortedResumes]);

	const loadResumeDetail = async (resumeId: number) => {
		setLoadingDetail(true);
		try {
			console.debug("[ResumeList] calling resumeService.getById", {
				jobId,
				resumeId,
			});
			const resp = await resumeService.getById(Number(jobId), resumeId);
			console.debug("[ResumeList] resumeService.getById response", resp);
			if (String(resp?.status || "").toLowerCase() === "success" && resp.data) {
				setSelectedResume(resp.data as unknown as Resume);
			} else {
				message.error(resp?.message || "Unable to load resume details");
			}
		} catch (e) {
			console.error("Failed to load resume detail:", e);
			toastError("Unable to load resume details");
		} finally {
			setLoadingDetail(false);
		}
	};

	// retry analysis for a failed resume
	const [retryingIds, setRetryingIds] = useState<number[]>([]);
	const handleRetry = async (resumeId: number) => {
		if (!resumeId) return;
		setRetryingIds((s) => [...s, resumeId]);
		try {
			const resp = await resumeService.retryAnalysis(resumeId);
			if (String(resp?.status || "").toLowerCase() === "success") {
				toastSuccess("Retry requested", "Resume reprocessing has been queued.");
				// reload list to reflect status changes (if backend updates quickly)
				await loadResumes();
			} else {
				toastError("Retry failed", resp?.message);
			}
		} catch (e) {
			console.error("Retry analysis failed:", e);
			toastError("Retry failed", (e as any)?.message);
		} finally {
			setRetryingIds((s) => s.filter((id) => id !== resumeId));
		}
	};

	const handleRetrySelected = async () => {
		if (!selectedRowKeys || selectedRowKeys.length === 0) return;
		setDeletingMultiple(true);
		const ids = selectedRowKeys.map((k) => Number(k));
		let success = 0;
		for (const id of ids) {
			try {
				const resp = await resumeService.retryAnalysis(id);
				if (String(resp?.status || "").toLowerCase() === "success") {
					success++;
				}
			} catch (e) {
				console.error("Retry selected resume failed:", e);
			}
		}
		setDeletingMultiple(false);
		setSelectedRowKeys([]);
		// keep edit mode on — user can continue editing; if you want to auto-exit, uncomment next line
		// setEditMode(false);
		await loadResumes();
		setCurrentPage(1);
		toastSuccess(
			"Retry completed",
			`${success} of ${ids.length} resumes queued for reprocessing`
		);
	};

	const handleDeleteSelected = async () => {
		if (!selectedRowKeys || selectedRowKeys.length === 0) return;
		setDeletingMultiple(true);
		const ids = selectedRowKeys.map((k) => Number(k));
		let success = 0;
		for (const id of ids) {
			try {
				const resp = await resumeService.delete(id);
				if (String(resp?.status || "").toLowerCase() === "success") {
					success++;
				}
			} catch (e) {
				console.error("Delete selected resume failed:", e);
			}
		}
		setDeletingMultiple(false);
		setDeleteModalOpen(false);
		setSelectedRowKeys([]);
		// reload and reset page
		await loadResumes();
		setCurrentPage(1);
		setSelectedResume(null);
		setConfirmInput("");
		// Optionally exit edit mode after delete:
		setEditMode(false);
		toastSuccess("Delete completed", `${success} of ${ids.length} resumes deleted`);
	};

	const handleUpload = async (file: File) => {
		if (!jobId) return false;
		setUploading(true);
		try {
			const formData = new FormData();
			formData.append("JobId", jobId);
			formData.append("File", file);
			console.debug("[ResumeList] Upload formData entries:");
			for (const pair of formData.entries()) {
				console.debug(pair[0], pair[1]);
			}

			console.debug("[ResumeList] calling resumeService.uploadToJob");
			const resp = await resumeService.uploadToJob(formData);
			console.debug("[ResumeList] uploadToJob response", resp);
			if (String(resp?.status || "").toLowerCase() === "success") {
				toastSuccess("Upload successful", `Uploaded ${file.name} successfully!`);
				await loadResumes();
			} else {
				toastError("Upload failed", resp?.message);
			}
		} catch (e: any) {
			console.error("Upload error:", e);
			toastError("Upload failed", e?.message);
		} finally {
			setUploading(false);
		}
		return false;
	};

	const columns: ColumnsType<Resume> = [
		{
			title: "No",
			width: 80,
			align: "center" as const,
			render: (_: any, __: any, index: number) =>
				(currentPage - 1) * pageSize + index + 1,
		},
		{
			title: "Full Name",
			dataIndex: "fullName",
			align: "center" as const,
			render: (text: string) => <strong>{text || "Unknown"}</strong>,
		},
		{
			title: "Screening Status",
			dataIndex: "status",
			align: "center" as const,
			width: 150,
			render: (status: string) => (
				<Tag
					color={
						status === "Completed"
							? "green"
							: status === "Pending"
								? "blue"
								: "default"
					}
				>
					{status || "Processing"}
				</Tag>
			),
		},
		{
			title: "Score",
			dataIndex: "totalResumeScore",
			width: 120,
			align: "center" as const,
			render: (score: number | null) =>
				score != null ? (
					<Tag color={score >= 70 ? "green" : score >= 40 ? "orange" : "red"}>
						{score}
					</Tag>
				) : (
					<span>—</span>
				),
		},
		{
			title: "Ties",
			width: 100,
			align: "center" as const,
			render: (_: any, record: Resume) => {
				const score = record.totalResumeScore;
				if (score == null || score === 0)
					return <span style={{ color: "#9ca3af" }}>—</span>;
				const count = scoreCounts.get(score) || 0;
				if (count <= 1) return <span style={{ color: "#9ca3af" }}>—</span>;
				const content = (
					<div style={{ maxWidth: 290 }}>
						<div>There are {count} candidates with the same score.</div>
					</div>
				);

				// choose tag color based on number of ties
				let bgColor = "var(--color-primary-light)";
				let textColor = "#fff";
				if (count < 5) {
					bgColor = "#f472b6"; // pink
					textColor = "#fff";
				} else if (count < 10) {
					bgColor = "#f59e0b"; // amber/yellow
					textColor = "#000";
				} else {
					bgColor = "#ef4444"; // red
					textColor = "#fff";
				}

				return (
					<Popover content={content} trigger={["hover"]}>
						<Tag
							style={{ cursor: "pointer", backgroundColor: bgColor, color: textColor }}
							onClick={() =>
								navigate(
									`/company/ai-screening/compare?jobId=${jobId}&score=${score}`
								)
							}
						>
							{count}{" "}
							<TeamOutlined style={{ marginLeft: 6, color: textColor }} />
						</Tag>
					</Popover>
				);
			},
		},
		{
			title: "Actions",
			key: "actions",
			width: 120,
			align: "center" as const,
			render: (_, record) => (
				<Space size="middle">
					<Button
						type="text"
						icon={<EyeOutlined />}
						aria-label="View detail"
						onClick={async () => {
							setDrawerOpen(true);
							await loadResumeDetail(record.resumeId);
						}}
					/>
					{/* Always show edit icon — clicking enters edit mode */}
					<Tooltip title="Enter edit mode (select resumes)">
						<Button
							type="text"
							icon={<EditOutlined />}
							style={{ color: "#096dd9" }}
							onClick={() => {
								// enter edit mode; keep existing selection if any
								setEditMode(true);
							}}
						/>
					</Tooltip>

					{/* Per-row retry button (optional) - show only for Failed */}
					{String(record.status) === "Failed" && (
						<Tooltip title="Retry processing">
							<Button
								type="text"
								icon={<ReloadOutlined />}
								style={{ color: "#096dd9" }}
								loading={retryingIds.includes(record.resumeId)}
								onClick={async () => handleRetry(record.resumeId)}
							/>
						</Tooltip>
					)}
				</Space>
			),
		},
	];

	return (
		<>
			<Card
				title={
					<div className="flex justify-between items-center w-full">
						<div className="flex items-center gap-2">
							<Button
								className="company-btn"
								icon={<ArrowLeftOutlined />}
								onClick={() => navigate("/company/ai-screening")}
							/>
							<span className="font-semibold">{jobTitle || `Job #${jobId}`}</span>
						</div>
						<div style={{ marginBottom: 16, display: "flex", gap: 8, alignItems: "center" }}>
							<span>Filter by score:</span>
							<Input
								type="number"
								placeholder="Min"
								style={{ width: 100 }}
								value={scoreFilter.min ?? ""}
								onChange={(e) => {
									const val = e.target.value === "" ? null : Number(e.target.value);
									setScoreFilter((prev) => ({ ...prev, min: val }));
								}}
							/>
							<span>to</span>
							<Input
								type="number"
								placeholder="Max"
								style={{ width: 100 }}
								value={scoreFilter.max ?? ""}
								onChange={(e) => {
									const val = e.target.value === "" ? null : Number(e.target.value);
									setScoreFilter((prev) => ({ ...prev, max: val }));
								}}
							/>
							{(scoreFilter.min !== null || scoreFilter.max !== null) && (
								<Button
									size="small"
									onClick={() => setScoreFilter({ min: null, max: null })}
								>
									Clear
								</Button>
							)}
						</div>
						<div className="flex gap-2 items-center">
							{/* Buttons visible only in edit mode */}
							{editMode && (
								<>
									{canRetrySelected && (
										<Button
											type="primary"
											onClick={() => handleRetrySelected()}
											disabled={!canRetrySelected || deletingMultiple}
											style={{ marginRight: 8 }}
										>
											Retry screening ({selectedRowKeys.length})
										</Button>
									)}

									{selectedRowKeys.length > 0 && (
										<Button
											type="primary"
											danger
											onClick={() => setDeleteModalOpen(true)}
											style={{ marginRight: 8 }}
										>
											Delete resumes ({selectedRowKeys.length})
										</Button>
									)}

									{/* Done / Exit edit mode */}
									<Button
										onClick={() => {
											setEditMode(false);
											setSelectedRowKeys([]);
										}}
										style={{ marginRight: 8 }}
									>
										Done
									</Button>
								</>
							)}

							<Button
								className="company-btn--filled"
								onClick={() => setUploadDrawerOpen(true)}
							>
								Upload CV
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
				<Table
					rowKey="resumeId"
					loading={loading}
					dataSource={sortedResumes}
					rowSelection={
						editMode
							? {
								selectedRowKeys,
								onChange: (keys) => setSelectedRowKeys(keys),
								type: "checkbox",
							}
							: undefined
					}
					columns={columns}
					scroll={{ y: "67vh" }}
					pagination={{
						current: currentPage,
						pageSize: pageSize,
						total: resumes.length,
						showSizeChanger: true,
						showTotal: (total) => `Total ${total} resumes`,
						pageSizeOptions: ["10", "20", "50", "100"],
						onChange: (page, size) => {
							setCurrentPage(page);
							setPageSize(size);
						},
					}}
				/>
			</Card>

			{/* Delete selected confirmation modal requiring exact job title */}
			<Modal
				title={`Confirm delete ${selectedRowKeys.length} resumes`}
				open={deleteModalOpen}
				onCancel={() => {
					setDeleteModalOpen(false);
					setConfirmInput("");
				}}
				onOk={handleDeleteSelected}
				okButtonProps={{
					disabled: confirmInput !== (jobTitle || "") || deletingMultiple,
					loading: deletingMultiple,
				}}
				cancelButtonProps={{ disabled: deletingMultiple }}
			>
				<div>
					<p>
						Việc xóa CV là hành động <strong>không thể khôi phục</strong> và có thể gây
						ra những bất tiện cho bạn trong quá trình sử dụng hệ thống. Vui lòng nhập
						chính xác tiêu đề công việc{" "}
						<strong>{jobTitle || "(job title)"}</strong> để xác nhận xoá.
					</p>

					<Input
						value={confirmInput}
						onChange={(e) => setConfirmInput(e.target.value)}
						placeholder="Type job title here"
					/>
				</div>
			</Modal>

			<Drawer
				title={selectedResume ? `Resume Detail - ${selectedResume.fullName}` : "Resume Detail"}
				width={720}
				onClose={() => {
					setDrawerOpen(false);
					setSelectedResume(null);
				}}
				open={drawerOpen}
				destroyOnClose
				loading={loadingDetail}
			>
				{selectedResume && (
					<Space direction="vertical" style={{ width: "100%" }} size="large">
						<Card size="small" title="Basic Information">
							<Space direction="vertical" style={{ width: "100%" }}>
								<div>
									<strong>Full Name:</strong> {selectedResume.fullName || "Unknown"}
								</div>
								{selectedResume.email && (
									<div>
										<strong>Email:</strong> {selectedResume.email}
									</div>
								)}
								{selectedResume.phoneNumber && (
									<div>
										<strong>Phone:</strong> {selectedResume.phoneNumber}
									</div>
								)}
								<div>
									<strong>Status:</strong>{" "}
									<Tag
										color={
											selectedResume.status === "Completed"
												? "green"
												: selectedResume.status === "Pending"
													? "blue"
													: "default"
										}
									>
										{selectedResume.status || "Processing"}
									</Tag>
								</div>
								{selectedResume.fileUrl && (
									<div>
										<strong>Resume File:</strong>{" "}
										<Button type="link" href={selectedResume.fileUrl} target="_blank">
											View PDF
										</Button>
									</div>
								)}
							</Space>
						</Card>

						<Card size="small" title="AI Evaluation">
							<Space direction="vertical" style={{ width: "100%" }}>
								<div>
									<strong>Total Score:</strong>{" "}
									{selectedResume.totalResumeScore != null ? (
										<Tag
											color={
												selectedResume.totalResumeScore >= 70
													? "green"
													: selectedResume.totalResumeScore >= 40
														? "orange"
														: "red"
											}
											style={{ fontSize: 16, padding: "4px 12px" }}
										>
											{selectedResume.totalResumeScore}
										</Tag>
									) : (
										<span>—</span>
									)}
								</div>
								{selectedResume.aiExplanation && (
									<div>
										<strong>AI Explanation:</strong>
										<p
											style={{
												marginTop: 8,
												padding: 12,
												background: "#f5f5f5",
												borderRadius: 4,
											}}
										>
											{selectedResume.aiExplanation.replace(/\\u0027/g, "'")}
										</p>
									</div>
								)}
							</Space>
						</Card>

						{selectedResume.scoreDetails && selectedResume.scoreDetails.length > 0 && (
							<Card size="small" title="Criteria Scores">
								<Space direction="vertical" style={{ width: "100%" }} size="middle">
									{selectedResume.scoreDetails.map((detail) => (
										<div
											key={detail.criteriaId}
											style={{
												padding: 12,
												border: "1px solid #d9d9d9",
												borderRadius: 4,
											}}
										>
											<div style={{ marginBottom: 8 }}>
												<strong>{detail.criteriaName}</strong>
												<Tag
													color={
														detail.score >= 70
															? "green"
															: detail.score >= 40
																? "orange"
																: "red"
													}
													style={{ marginLeft: 8 }}
												>
													Score: {detail.score}
												</Tag>
												<Tag color={detail.matched ? "success" : "default"} style={{ marginLeft: 4 }}>
													{detail.matched ? "Matched" : "Not Matched"}
												</Tag>
											</div>
											<div style={{ color: "#666" }}>
												<em>{detail.aiNote}</em>
											</div>
										</div>
									))}
								</Space>
							</Card>
						)}
					</Space>
				)}
			</Drawer>

			<Drawer
				title={`Upload CV - ${jobTitle || `Job #${jobId}`}`}
				width={500}
				onClose={() => setUploadDrawerOpen(false)}
				open={uploadDrawerOpen}
				destroyOnClose
			>
				<Upload.Dragger
					multiple
					beforeUpload={handleUpload}
					accept=".pdf,.doc,.docx"
					disabled={uploading}
					showUploadList={false}
					style={{ padding: 12 }}
				>
					<p className="ant-upload-drag-icon">
						<InboxOutlined />
					</p>
					<p className="ant-upload-text">Click or drag CV files here</p>
					<p className="ant-upload-hint">
						Supports PDF / DOC / DOCX. The AI system will automatically analyze and evaluate resumes.
					</p>
				</Upload.Dragger>
			</Drawer>
		</>
	);
};

export default ResumeList;
