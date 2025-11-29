import React, { useEffect, useState } from "react";
import { Card, Table, Tag, Button, Drawer, Space, Upload, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, InboxOutlined } from "@ant-design/icons";
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
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [jobTitle, setJobTitle] = useState<string>("");

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
				const raw = Array.isArray(resp.data)
					? resp.data
					: resp.data.items || [];
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
				const sortedList = mapped
					.slice()
					.sort((a, b) => a.resumeId - b.resumeId);
				setResumes(sortedList);
			} else {
				message.error(resp?.message || "Không thể tải danh sách CV");
			}
		} catch (e) {
			console.error("Failed to load resumes:", e);
			toastError("Không thể tải danh sách CV");
		} finally {
			setLoading(false);
		}
	};

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
				message.error(resp?.message || "Không thể tải chi tiết CV");
			}
		} catch (e) {
			console.error("Failed to load resume detail:", e);
			toastError("Không thể tải chi tiết CV");
		} finally {
			setLoadingDetail(false);
		}
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
			if (String(resp?.status || '').toLowerCase() === "success") {
				toastSuccess(
					"Upload thành công",
					`Uploaded ${file.name} successfully!`
				);
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
			render: (_: any, __: any, index: number) =>
				(currentPage - 1) * pageSize + index + 1,
		},
		{
			title: "Full Name",
			dataIndex: "fullName",
			render: (text: string) => <strong>{text || "Unknown"}</strong>,
		},
		{
			title: "Status",
			dataIndex: "status",
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
			render: (score: number | null) =>
				score != null ? (
					<Tag color={score >= 70 ? "green" : score >= 40 ? "orange" : "red"}>
						{score}
					</Tag>
				) : (
					<Tag color="default">—</Tag>
				),
		},
		{
			title: "Actions",
			key: "actions",
			width: 150,
			align: "center" as const,
			render: (_, record) => (
				<Button
					className="company-btn"
					onClick={async () => {
						setDrawerOpen(true);
						await loadResumeDetail(record.resumeId);
					}}
				>
					View Detail
				</Button>
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
							<span className="font-semibold">
								{jobTitle || `Job #${jobId}`}
							</span>
						</div>
						<div className="flex gap-2 items-center">
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
					dataSource={resumes}
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

			<Drawer
				title={
					selectedResume
						? `Resume Detail - ${selectedResume.fullName}`
						: "Resume Detail"
				}
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
									<strong>Full Name:</strong>{" "}
									{selectedResume.fullName || "Unknown"}
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
										<Button
											type="link"
											href={selectedResume.fileUrl}
											target="_blank"
										>
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
										<Tag color="default">—</Tag>
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

						{selectedResume.scoreDetails &&
							selectedResume.scoreDetails.length > 0 && (
								<Card size="small" title="Criteria Scores">
									<Space
										direction="vertical"
										style={{ width: "100%" }}
										size="middle"
									>
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
													<Tag
														color={detail.matched ? "success" : "default"}
														style={{ marginLeft: 4 }}
													>
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
					<p className="ant-upload-text">Click hoặc kéo thả file CV vào đây</p>
					<p className="ant-upload-hint">
						Hỗ trợ PDF / DOC / DOCX. Hệ thống AI sẽ phân tích và đánh giá CV tự
						động.
					</p>
				</Upload.Dragger>
			</Drawer>
		</>
	);
};

export default ResumeList;
