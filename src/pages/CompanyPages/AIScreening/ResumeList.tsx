import React, {
	useEffect,
	useState,
	useMemo,
	useCallback,
	useRef,
} from "react";
import { Card, Tag, Button, message, Input, Tooltip } from "antd";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
	ArrowLeftOutlined,
	SearchOutlined,
} from "@ant-design/icons";
import resumeService from "../../../services/resumeService";
import { APP_ROUTES } from "../../../services/config";
import { Swords } from "lucide-react";
// APP_ROUTES not needed here after wiring compare modal
import { toastError, toastSuccess } from "../../../components/UI/Toast";
import { useResumeSignalR } from "../../../hooks/useResumeSignalR";
import ScoreFilter from "./component/ScoreFilter";
import ResumeTable from "./component/ResumeTable";
import ResumeDetailDrawer from "./component/ResumeDetailDrawer";
import type { ResumeLocal } from "../../../types/resume.types";
import UploadDrawer from "./component/UploadDrawer";

type UIResume = ResumeLocal;

type ResumeListProps = {
	jobId?: string | number;
};

const ResumeList: React.FC<ResumeListProps> = ({ jobId: propJobId }) => {
	const params = useParams<{ campaignId?: string; jobId?: string }>();
	const location = useLocation();
	const jobId = propJobId ?? params.jobId;
	// campaignId: prefer route param, fall back to query param for compatibility
	const campaignIdFromParams = params.campaignId ? Number(params.campaignId) : undefined;
	const search = new URLSearchParams(location.search);
	const campaignIdFromQuery = search.get("campaignId") ? Number(search.get("campaignId")) : undefined;
	const campaignId = campaignIdFromParams ?? campaignIdFromQuery;
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [resumes, setResumes] = useState<UIResume[]>([]);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [selectedResume, setSelectedResume] = useState<UIResume | null>(null);
	const [loadingDetail, setLoadingDetail] = useState(false);
	const [uploadDrawerOpen, setUploadDrawerOpen] = useState(false);
	const [uploading, setUploading] = useState(false);
	const tableRef = useRef<{ openCompare: () => void } | null>(null);
	// removed batch-delete state
	// removed selectedRowKeys/editMode/multi-delete related state
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [jobTitle, setJobTitle] = useState<string>("");
	const [targetQuantity, setTargetQuantity] = useState<number | undefined>(undefined);
	const [searchText, setSearchText] = useState<string>("");
	const [scoreFilter, setScoreFilter] = useState<{
		min: number | null;
		max: number | null;
	}>({ min: null, max: null });
	const resumesRef = useRef<UIResume[]>([]);

	// Ensure displayed order is always by score desc (nulls last)
	const sortedResumes = useMemo(() => {
		let filtered = resumes.slice();

		// Apply search filter
		if (searchText.trim()) {
			const searchLower = searchText.toLowerCase().trim();
			filtered = filtered.filter((r) => {
				const fullName = (r.fullName || "").toLowerCase();
				const email = (r.email || "").toLowerCase();
				const phone = (r.phoneNumber || "").toLowerCase();
				return (
					fullName.includes(searchLower) ||
					email.includes(searchLower) ||
					phone.includes(searchLower)
				);
			});
		}

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
	}, [resumes, scoreFilter, searchText]);

	const loadJobInfo = useCallback(async () => {
		if (!jobId) return;
		try {
			const { jobService } = await import("../../../services/jobService");
			const resp = await jobService.getJobById(Number(jobId));

			let jobData: any = null;
			if (resp == null) {
				jobData = null;
			} else if ((resp as any).data) {
				// data may itself be the object or an object with `data` inside
				jobData = (resp as any).data.data ?? (resp as any).data;
			} else {
				jobData = resp;
			}
			setJobTitle(jobData?.title ?? "");
			setTargetQuantity(jobData?.targetQuantity ?? jobData?.target ?? undefined);
		} catch (e) {
			console.error("Failed to load job info:", e);
		}
	}, [jobId]);

	const loadResumes = useCallback(async () => {
		if (!jobId) return;
		setLoading(true);
		try {
			const resp = campaignId
				? await resumeService.getByJob(Number(campaignId), Number(jobId))
				: await resumeService.getByJob(Number(jobId));

			if (String(resp?.status || "").toLowerCase() === "success" && resp.data) {
				const raw = resp.data as any;
				let resumeList: any[] = [];
				if (Array.isArray(raw)) resumeList = raw;
				else if (Array.isArray(raw.data)) resumeList = raw.data;
				else if (Array.isArray(raw.resumes)) resumeList = raw.resumes;
				else if (Array.isArray(raw.items)) resumeList = raw.items;
				else resumeList = [];

				const mapped: UIResume[] = resumeList.map((r: any) => ({
					resumeId: (r.resumeId ?? r.applicationId) as number,
					applicationId: (r.applicationId ?? r.resumeId) as number,
					fullName: r.fullName || r.candidateName || "Unknown",
					status: r.applicationStatus || r.status || r.stage || "Processing",
					// preserve raw scores from backend
					totalScore: (r.totalScore ?? null) as number | null,
					adjustedScore: (r.adjustedScore ?? null) as number | null,
					// totalResumeScore is the value used for sorting/display when totalScore missing
					totalResumeScore: (r.totalScore ?? r.adjustedScore ?? null) ?? null,
					email: r.email,
					phoneNumber: r.phone || r.phoneNumber,
					fileUrl: r.fileUrl,
					aiExplanation: r.aiExplanation,
					scoreDetails: r.scoreDetails,
				}));

				// If caller requested only scored resumes via query param, filter here
				const qp = new URLSearchParams(location.search);
				const onlyScored = qp.get("onlyScored") === "1" || qp.get("onlyScored") === "true";

				let filteredMapped = mapped;
				if (onlyScored) {
					filteredMapped = mapped.filter((m) => m.totalResumeScore != null && m.totalResumeScore > 0);
				}

				const sortedList = filteredMapped.slice().sort((a, b) => {
					const aS = a.totalResumeScore;
					const bS = b.totalResumeScore;
					if (aS == null && bS == null) return a.resumeId - b.resumeId;
					if (aS == null) return 1;
					if (bS == null) return -1;
					if (bS !== aS) return bS - aS;
					return a.resumeId - b.resumeId;
				});

				setResumes(sortedList);
				resumesRef.current = sortedList; // Update ref
			} else {
				message.error(resp?.message || "Unable to load resumes");
			}
		} catch (e) {
			console.error("Failed to load resumes:", e);
			toastError("Unable to load resumes");
		} finally {
			setLoading(false);
		}
	}, [jobId, campaignId]);

	useEffect(() => {
		if (jobId) {
			loadJobInfo();
			loadResumes();
		}
	}, [jobId, loadJobInfo, loadResumes]);

	// Update ref whenever resumes change
	useEffect(() => {
		resumesRef.current = resumes;
	}, [resumes]);

	// Polling fallback: Check for status changes every 5 seconds if there are Pending resumes
	useEffect(() => {
		if (!jobId) return;

		console.log("⏰ Setting up polling for pending resumes...");
		let pollCount = 0;
		const maxPolls = 60; // Stop after 5 minutes (60 * 5 seconds)

		const pollInterval = setInterval(() => {
			// Check if there are any Pending resumes before polling (use ref for latest value)
			const currentResumes = resumesRef.current;
			const hasPendingResumes = currentResumes.some(
				(r) => r.status === "Pending" || r.status === "pending"
			);

			if (!hasPendingResumes) {
				console.log("✅ No pending resumes, stopping polling");
				clearInterval(pollInterval);
				return;
			}

			pollCount++;
			if (pollCount > maxPolls) {
				console.log("⏱️ Max polling time reached, stopping");
				clearInterval(pollInterval);
				return;
			}

			console.log(
				`🔄 Polling (${pollCount}/${maxPolls}): Checking for status updates...`
			);
			loadResumes();
		}, 5000); // Poll every 5 seconds

		return () => {
			console.log("🛑 Stopping polling");
			clearInterval(pollInterval);
		};
	}, [jobId, loadResumes]); // Only depend on jobId and loadResumes, not resumes

	// SignalR handlers for real-time updates
	const handleResumeUpdated = useCallback(
		(data: {
			eventType: string;
			jobId: number;
			resumeId: number;
			status: string;
			fullName: string;
			totalResumeScore?: number | null;
			timestamp: string;
			data?: unknown;
		}) => {
			console.log("📨 ResumeUpdated received in handler:", data);
			console.log("📨 Current jobId from params:", jobId);
			const {
				resumeId,
				status,
				fullName,
				totalResumeScore,
				eventType,
				jobId: eventJobId,
			} = data;

			// Verify this event is for the current job
			if (eventJobId && jobId && Number(jobId) !== eventJobId) {
				console.log(
					`⚠️ Ignoring event for different job: eventJobId=${eventJobId}, currentJobId=${jobId}`
				);
				return;
			}

			// If status changed to Completed, Failed, or Invalid, reload the entire list
			// to get full updated data (scores, details, etc.)
			if (
				eventType === "status_changed" &&
				(status === "Completed" || status === "Failed" || status === "Invalid")
			) {
				console.log(
					`🔄 Status changed to ${status} for resume ${resumeId}, reloading resume list...`
				);
				// Reload the entire list to get fresh data
				setTimeout(() => {
					loadResumes();
				}, 500); // Small delay to ensure backend has updated

				// Show notification
				const statusMessages: Record<string, string> = {
					Completed: "✅ Resume analysis completed",
					Failed: "❌ Resume analysis failed",
					Invalid: "⚠️ Invalid resume file",
					Pending: "⏳ Resume analysis in progress",
				};
				const statusMessage =
					statusMessages[status] || `Resume status changed to ${status}`;
				message.info({
					content: `${statusMessage}: ${fullName || `Resume #${resumeId}`}`,
					duration: 3,
				});
				return;
			}

			// Also reload for any status change from Pending
			if (eventType === "status_changed") {
				console.log(
					`🔄 Status changed from Pending to ${status}, reloading resume list...`
				);
				setTimeout(() => {
					loadResumes();
				}, 500);
			}

			setResumes((prevResumes) => {
				// If resume was deleted, remove it from the list
				if (eventType === "deleted") {
					return prevResumes.filter((r) => r.resumeId !== resumeId);
				}

				// Check if resume already exists
				const existingIndex = prevResumes.findIndex(
					(r) => r.resumeId === resumeId
				);

				if (existingIndex >= 0) {
					// Update existing resume
					const updated = [...prevResumes];
					updated[existingIndex] = {
						...updated[existingIndex],
						status: status || updated[existingIndex].status,
						fullName: fullName || updated[existingIndex].fullName,
						totalResumeScore:
							totalResumeScore != null
								? totalResumeScore
								: updated[existingIndex].totalResumeScore,
					};
					return updated;
				} else {
					// New resume uploaded - reload the list to get full data
					if (eventType === "uploaded") {
						loadResumes();
					}
					return prevResumes;
				}
			});

			// Show notification for other status changes (not Completed/Failed/Invalid)
			if (eventType === "status_changed") {
				const statusMessages: Record<string, string> = {
					Completed: "✅ Resume analysis completed",
					Failed: "❌ Resume analysis failed",
					Invalid: "⚠️ Invalid resume file",
					Pending: "⏳ Resume analysis in progress",
				};
				const statusMessage =
					statusMessages[status] || `Resume status changed to ${status}`;
				message.info({
					content: `${statusMessage}: ${fullName || `Resume #${resumeId}`}`,
					duration: 3,
				});
			}
		},
		[loadResumes, jobId]
	);

	const handleResumeListUpdated = useCallback(
		(data: { eventType: string; jobId: number; timestamp: string }) => {
			console.log("📋 ResumeListUpdated received:", data);
			// Reload the entire list when list changes
			loadResumes();
		},
		[loadResumes] // jobId not needed as loadResumes already depends on it
	);

	// Connect to SignalR ResumeHub
	useResumeSignalR({
		onResumeUpdated: handleResumeUpdated,
		onResumeListUpdated: handleResumeListUpdated,
		enabled: !!jobId,
		jobId: jobId ? Number(jobId) : null,
	});

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
				campaignId,
				resumeId,
			});
			const resp = campaignId
				? await resumeService.getById(Number(campaignId), Number(jobId), resumeId)
				: await resumeService.getById(Number(jobId), resumeId);
			console.debug("[ResumeList] resumeService.getById response", resp);
			if (String(resp?.status || "").toLowerCase() === "success" && resp.data) {
				const data = resp.data as unknown as {
					resumeId: number;
					fullName: string;
					email?: string;
					phoneNumber?: string;
					status: string;
					fileUrl?: string;
					aiScores?: Array<{
						scoreId?: number;
						totalResumeScore: number;
						aiExplanation?: string;
						createdAt?: string;
						scoreDetails?: Array<{
							criteriaId: number;
							criteriaName: string;
							matched: number;
							score: number;
							aiNote: string;
						}>;
					}>;
				};

				// Map response to Resume interface
				// Extract data from aiScores[0] if available
				const latestScore =
					data.aiScores && data.aiScores.length > 0
						? data.aiScores[data.aiScores.length - 1] // Get the latest score
						: null;

				const mappedResume: UIResume = {
					resumeId: data.resumeId,
					applicationId: (data as any).applicationId,
					applicationStatus: (data as any).applicationStatus ?? data.status,
					fullName: data.fullName,
					status: data.status,
					queueJobId: (data as any).queueJobId,
					campaignId: (data as any).campaignId,
					createdAt: (data as any).createdAt,
					matchSkills: (data as any).matchSkills,
					missingSkills: (data as any).missingSkills,
					totalScore: (data as any).totalScore ?? null,
					adjustedScore: (data as any).adjustedScore ?? null,
					note: (data as any).note ?? (latestScore as any)?.note ?? null,
					// prefer latest ai score, otherwise fall back to top-level adjusted/total score
					totalResumeScore:
						latestScore?.totalResumeScore ??
						((data as any).totalScore ?? (data as any).adjustedScore ?? null),
					email: data.email,
					phoneNumber: data.phoneNumber,
					fileUrl: data.fileUrl,
					// prefer per-score explanation when present, otherwise top-level aiExplanation
					aiExplanation: latestScore?.aiExplanation ?? (data as any).aiExplanation,
					errorMessage: (data as any).errorMessage ?? null,
					// prefer detailed score details from latest ai score, else top-level
					scoreDetails: latestScore?.scoreDetails ?? (data as any).scoreDetails,
					// aiScores: data.aiScores?.map((score) => ({
					// 	scoreId: score.scoreId || 0,
					// 	totalResumeScore: score.totalResumeScore,
					// 	aiExplanation: score.aiExplanation ?? "",
					// 	createdAt: score.createdAt ?? "",
					// 	scoreDetails: score.scoreDetails,
					// })), // Map to match interface structure
				};

				console.debug("[ResumeList] Mapped resume detail:", mappedResume);
				setSelectedResume(mappedResume);
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

	const handleDeleteOne = async (resumeId: number) => {
		if (!resumeId) return;
		try {
			// Resolve applicationId when available; backend delete expects applicationId
			const found = resumes.find((r) => r.resumeId === resumeId);
			const idToDelete = (found && (found.applicationId ?? found.resumeId)) || resumeId;
			const resp = await resumeService.delete(idToDelete as number);
			if (String(resp?.status || "").toLowerCase() === "success") {
				toastSuccess("Delete completed", `Resume deleted`);
				await loadResumes();
				setSelectedResume(null);
			} else {
				toastError("Delete failed", resp?.message);
			}
		} catch (e) {
			console.error("Delete resume failed:", e);
			toastError("Delete failed", (e as Error)?.message ?? String(e));
		}
	};

	const handleUpload = async (file: File) => {
		if (!jobId) return false;
		setUploading(true);
		try {
			const formData = new FormData();
			formData.append("JobId", String(jobId));
			if (campaignId) formData.append("CampaignId", String(campaignId));
			formData.append("File", file);
			console.debug("[ResumeList] Upload formData entries:");
			for (const pair of formData.entries()) {
				console.debug(pair[0], pair[1]);
			}

			console.debug("[ResumeList] calling resumeService.uploadToJob");
			const resp = await resumeService.uploadToJob(formData);
			console.debug("[ResumeList] uploadToJob response", resp);
			if (String(resp?.status || "").toLowerCase() === "success") {
				toastSuccess(
					"Upload successful",
					`Uploaded ${file.name} successfully!`
				);
				await loadResumes();
			} else {
				toastError("Upload failed", resp?.message);
			}
		} catch (e: unknown) {
			console.error("Upload error:", e);
			const errorMessage = e instanceof Error ? e.message : "Unknown error";
			toastError("Upload failed", errorMessage);
		} finally {
			setUploading(false);
		}
		return false;
	};

	return (
		<>
			<Card
				title={
					<div className="flex justify-between items-center w-full">
						<div className="flex items-center gap-2">
							<Button
								className="company-btn"
								icon={<ArrowLeftOutlined />}
								onClick={() => navigate(-1)}
							/>
							<span className="font-semibold">
								{jobTitle}
							</span>
						</div>

						<div className="flex gap-2 items-center">
							<Button
								className="company-btn"
								icon={<Swords size={16} />}
								onClick={() => {
									// Navigate to compare page for this campaign/job
									const cid = campaignId ?? "0";
									const jid = jobId ?? "0";
									try {
										navigate(`/company/ai-screening/${cid}/${jid}/resumes/compare`);
									} catch (e) {
										// fallback to APP_ROUTES template
										navigate(APP_ROUTES.COMPANY_AI_SCREENING_RESUMES_COMPARE.replace(":campaignId", String(cid)).replace(":jobId", String(jid)));
									}
								}}
							>
								<span>Compare Candidate</span>
							</Button>
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
				<div className="flex gap-3 items-center justify-center" style={{ marginBottom: 12 }}>
					<Input
						placeholder="Search by name, email, or phone"
						prefix={<SearchOutlined />}
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						allowClear
						style={{ width: 280 }}
					/>
					<ScoreFilter
						scoreFilter={scoreFilter}
						onFilterChange={setScoreFilter}
					/>
					{targetQuantity && (() => {
						const qualifiedCount = sortedResumes.filter(
							r => r.totalResumeScore != null && r.totalResumeScore >= 50
						).length;
						return qualifiedCount < targetQuantity ? (
							<Tooltip title={`Not enough qualified candidates. Need ${targetQuantity}, only ${qualifiedCount} with score ≥ 50`}>
								<Tag color="var(--color-primary)" style={{ fontSize: 14, padding: "4px 12px" }}>
									Insufficient candidates ({qualifiedCount}/{targetQuantity})
								</Tag>
							</Tooltip>
						) : null;
					})()}
				</div>
				<ResumeTable
					ref={tableRef}
					loading={loading}
					dataSource={sortedResumes}
					campaignId={campaignId}
					currentPage={currentPage}
					pageSize={pageSize}
					onPageChange={(page, size) => {
						setCurrentPage(page);
						setPageSize(size);
					}}
					onViewDetail={async (resumeId) => {
						setDrawerOpen(true);
						await loadResumeDetail(resumeId);
					}}
					onDelete={handleDeleteOne}
					scoreCounts={scoreCounts}
					jobId={jobId ? String(jobId) : undefined}
					targetQuantity={targetQuantity}
				/>
			</Card>

			<ResumeDetailDrawer
				open={drawerOpen}
				loading={loadingDetail}
				selectedResume={selectedResume}
				onClose={() => {
					setDrawerOpen(false);
					setSelectedResume(null);
				}}
			/>

			<UploadDrawer
				open={uploadDrawerOpen}
				onClose={() => setUploadDrawerOpen(false)}
				jobTitle={jobTitle}
				jobId={jobId ? String(jobId) : undefined}
				onUpload={handleUpload}
				uploading={uploading}
			/>
		</>
	);
};

export default ResumeList;
