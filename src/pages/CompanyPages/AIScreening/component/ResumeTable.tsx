import React from "react";
import { Table, Tag, Button, Space, Tooltip, Modal, Input, message } from "antd";
import { Flame, Pencil } from "lucide-react";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { ResumeLocal } from "../../../../types/resume.types";
import resumeService from "../../../../services/resumeService";
import compareResumeService from "../../../../services/compareResumeService";
import { getStatusColor, getStatusLabel, isSelectableForComparison, isQualifiedCandidate } from "../../../../utils/statusHelpers";

type Resume = ResumeLocal;

interface ResumeTableProps {
	loading: boolean;
	dataSource: Resume[];
	className?: string;
	editMode?: boolean;
	selectedRowKeys?: React.Key[];
	onSelectedRowKeysChange?: (keys: React.Key[]) => void;
	currentPage: number;
	pageSize: number;
	totalCount: number;
	onPageChange: (page: number, size: number) => void;
	onViewDetail: (resumeId: number) => void;
	onDelete: (resumeId: number) => void;
	scoreCounts: Map<number, number>;
	jobId?: string;
	campaignId?: number;
	targetQuantity?: number;
}

type ResumeTableHandle = {
	openCompare: () => void;
};

const ResumeTable = React.forwardRef<ResumeTableHandle, ResumeTableProps>((props, ref) => {
	const {
		loading,
		dataSource,
		editMode = false,
		className,
		selectedRowKeys = [],
		onSelectedRowKeysChange = () => {},
		currentPage,
		pageSize,
		totalCount,
		onPageChange,
		onViewDetail,
		onDelete,
		jobId,
		campaignId,
		targetQuantity,
	} = props;

	const [confirmModalOpen, setConfirmModalOpen] = React.useState(false);
	const [pendingDelete, setPendingDelete] = React.useState<{ resumeId: number; name: string } | null>(null);
	const [confirmInput, setConfirmInput] = React.useState("");
	const [confirmLoading, setConfirmLoading] = React.useState(false);
	const [editingAppId, setEditingAppId] = React.useState<number | null>(null);
	const [editValue, setEditValue] = React.useState<string>("");
	const [editingOriginalValue, setEditingOriginalValue] = React.useState<string>("");
	const [savingAppId, setSavingAppId] = React.useState<number | null>(null);
	const [adjConfirmOpen, setAdjConfirmOpen] = React.useState(false);
	const [adjPendingAppId, setAdjPendingAppId] = React.useState<number | null>(null);
	const [adjPendingValue, setAdjPendingValue] = React.useState<number | null>(null);
	const [adjPendingName, setAdjPendingName] = React.useState<string | null>(null);
	const [adjConfirmLoading, setAdjConfirmLoading] = React.useState(false);
	const [adjustedOverrides, setAdjustedOverrides] = React.useState<Map<number, number | null>>(() => new Map());
	const [hoveredAppId, setHoveredAppId] = React.useState<number | null>(null);
	const [compareSelectedKeys, setCompareSelectedKeys] = React.useState<React.Key[]>([]);
	const [compareLoading, setCompareLoading] = React.useState(false);
	const [compareMode, setCompareMode] = React.useState(false);

	const isSelectable = React.useCallback((record: Resume) => {
		return isSelectableForComparison(record);
	}, []);

	const isQualified = React.useCallback((index: number, record: Resume) => {
		return isQualifiedCandidate(record, index, targetQuantity);
	}, [targetQuantity]);

	const columns: ColumnsType<Resume> = [
		{
			title: "No",
			width: "10%",
			align: "center" as const,
			render: (_: unknown, __: unknown, index: number) =>
				(currentPage - 1) * pageSize + index + 1,
		},
		{
			title: "Full name",
			dataIndex: "fullName",
			width: "15%",
			align: "center" as const,
			render: (text: string, record: Resume, index: number) => {
				const isTopCandidate = isQualified(index, record);
				return (
					<Space>
						{isTopCandidate && (
							<Tooltip title="Top resume recommend">
								<Flame
									size={18}
									style={{ color: "#f59e0b", flexShrink: 0 }}
								/>
							</Tooltip>
						)}
						<strong>{text || "Unknown"}</strong>
					</Space>
				);
			},
		},
		{
			title: "Hiring status",
			dataIndex: "status",
			align: "center" as const,
			width: "18%",
			render: (_: string, record: Resume) => {
				const color = getStatusColor(record);
				const label = getStatusLabel(record);

				return (
					<Tag
						color={color}
						style={{ display: "inline-flex", justifyContent: "center", alignItems: "center", padding: "0 8px", whiteSpace: "nowrap" }}
					>
						{label}
					</Tag>
				);
			},
		},
		{
			title: "Screening score",
			dataIndex: "totalResumeScore",
			width: "15%",
			align: "center" as const,
			render: (_: number | null, record) => {
				const score = record.totalScore ?? record.totalResumeScore ?? null;
				return score != null ? (
					<Tag color={score >= 70 ? "green" : score >= 40 ? "orange" : "red"}>
						{score}
					</Tag>
				) : (
					<span>—</span>
				);
			},
		},
		{
			title: "Adjusted Score",
			dataIndex: "adjustedScore",
			width: "15%",
			align: "center" as const,
			render: (adjustedScore: number | null, record: Resume) => {
				const applicationId = Number(record.applicationId ?? record.resumeId);
				const applicationStatus = record.applicationStatus?.toLowerCase();
				const legacyStatus = record.status?.toLowerCase();
				const editable = applicationStatus === "reviewed" || 
								(legacyStatus === "reviewed" && !applicationStatus);

				const display = adjustedOverrides.has(applicationId)
					? adjustedOverrides.get(applicationId)
					: adjustedScore;

				const startEdit = (val: number | null) => {
					if (!editable) return;
					setEditingAppId(applicationId);
					setEditValue(val != null ? String(val) : "");
					setEditingOriginalValue(val != null ? String(val) : "");
				};

				const cancelEdit = () => {
					setEditingAppId(null);
					setEditValue("");
					setEditingOriginalValue("");
				};

				const saveEdit = async () => {
					const v = editValue.trim();
					if (v === "") {
						message.error("Please enter a score between 0 and 100.");
						return;
					}
					const n = Number(v);
					if (!Number.isFinite(n) || n < 0 || n > 100) {
						message.error("Score must be a number between 0 and 100.");
						return;
					}

					if (v === editingOriginalValue) {
						cancelEdit();
						return;
					}
					setAdjPendingAppId(applicationId);
					setAdjPendingValue(Math.round(n));
					setAdjPendingName(record.fullName ?? null);
					setAdjConfirmOpen(true);
				};

				const hovered = hoveredAppId === applicationId;

				if (editingAppId === applicationId) {
					return (
						<Input
							size="small"
							autoFocus
							value={editValue}
							onChange={(e) => setEditValue(e.target.value)}
							onBlur={() => saveEdit()}
							onKeyDown={(e) => {
								if (e.key === "Enter") saveEdit();
								if (e.key === "Escape") cancelEdit();
							}}
							style={{ width: 80, textAlign: "center" }}
							disabled={savingAppId === applicationId}
						/>
					);
				}
				const cellStyle: React.CSSProperties = {
					display: "inline-flex",
					alignItems: "center",
					justifyContent: "center",
					padding: "2px 8px",
					borderRadius: 6,
					transition: "background-color 120ms",
					backgroundColor: hovered && editable ? "#f3f4f6" : "transparent",
					cursor: editable ? "pointer" : "default",
				};

				const hidePencil = !editable;

				const content = display != null ? (
					<>
						<Tag color={display >= 70 ? "green" : display >= 40 ? "orange" : "red"} style={{ margin: 0 }}>
							{display}
						</Tag>
						{!hidePencil && (
							<Pencil size={12} style={{ marginLeft: 6, color: hovered && editable ? "#6b7280" : "#9ca3af" }} />
						)}
					</>
				) : (
					<>
						<span style={{ color: editable ? "#6b7280" : "#9ca3af", marginRight: 6 }}>{editable ? "Add score" : "—"}</span>
						{!hidePencil && (
							<Pencil size={14} style={{ color: editable ? (hovered ? "#6b7280" : "#9ca3af") : "#e5e7eb" }} />
						)}
					</>
				);

				const wrapper = (
					<div
						style={cellStyle}
						onMouseEnter={() => setHoveredAppId(applicationId)}
						onMouseLeave={() => setHoveredAppId(null)}
						onClick={() => startEdit(display != null ? Number(display) : null)}
						role={editable ? "button" : undefined}
						tabIndex={editable ? 0 : undefined}
						onKeyDown={(e) => {
							if (!editable) return;
							if (e.key === "Enter" || e.key === " ") startEdit(display != null ? Number(display) : null);
						}}
					>
						{content}
					</div>
				);

				return editable ? (
					<Tooltip title="Click to edit score">{wrapper}</Tooltip>
				) : (
					wrapper
				);
			},
		},
		{
			title: "Actions",
			key: "actions",
			width: "10%",
			align: "center" as const,
			render: (_, record) => (
				<Space size="middle">
					<Tooltip title="View detail result resume"><Button
						type="text"
						icon={<EyeOutlined />}
						aria-label="View detail"
						onClick={() => {
							console.debug("View detail clicked", {
								applicationId: record.applicationId,
								resumeId: record.resumeId,
								jobId,
							});
							onViewDetail(Number(record.applicationId ?? record.resumeId));
						}}
					/></Tooltip>
					
					<Tooltip title="Delete resume">
						<Button
							type="text"
							icon={<DeleteOutlined style={{ color: "#f5222d" }} />}
							onClick={() => {
								setPendingDelete({ resumeId: Number(record.resumeId), name: String(record.fullName ?? "") });
								setConfirmInput("");
								setConfirmModalOpen(true);
							}}
						/>
					</Tooltip>
				</Space>
			),
		},
	];

	const confirmAdjusted = async () => {
		if (adjPendingAppId == null) return;
		setAdjConfirmLoading(true);
		setSavingAppId(adjPendingAppId);
		try {
			await resumeService.updateAdjustedScore(adjPendingAppId, adjPendingValue ?? 0);
			setAdjustedOverrides(prev => {
				const next = new Map(prev);
				next.set(adjPendingAppId, adjPendingValue ?? null);
				return next;
			});
			message.success("Adjusted score updated");
			if (editingAppId === adjPendingAppId) {
				setEditingAppId(null);
				setEditValue("");
			}
		} catch (err) {
			console.error(err);
			message.error("Failed to update adjusted score");
		} finally {
			setSavingAppId(null);
			setAdjConfirmLoading(false);
			setAdjConfirmOpen(false);
			setAdjPendingAppId(null);
			setAdjPendingValue(null);
			setAdjPendingName(null);
		}
	};

	const openCompare = React.useCallback(() => {
		setCompareSelectedKeys([]);
		setCompareMode((prev) => !prev);
	}, []);

	React.useImperativeHandle(ref, () => ({
		openCompare,
	}), [openCompare]);

	const handleCompare = async () => {
		if (!jobId) {
			message.error("Missing jobId for compare");
			return;
		}
		if (!compareSelectedKeys || compareSelectedKeys.length === 0) {
			message.error("Select at least one resume to compare (max 5)");
			return;
		}

		const applicationIds = compareSelectedKeys.map((k) => Number(k));
		console.debug("Compare triggered", { jobId, campaignId, selectedKeys: compareSelectedKeys });

		try {
			const selectedRecords = compareSelectedKeys.map((k) => {
				const id = Number(k);
				return dataSource.find((r) => Number(r.applicationId ?? r.resumeId) === id) || null;
			});
			console.debug("Selected records (from table dataSource):", selectedRecords);
			const missing = selectedRecords.map((r, i) => (r ? null : compareSelectedKeys[i])).filter(Boolean);
			if (missing.length) console.warn("Some selected applicationIds not found in current table data:", missing);
			const mismatches: any[] = [];
			selectedRecords.forEach((rec, idx) => {
				if (!rec) return;
				if (typeof (rec as any).campaignId !== 'undefined' && campaignId != null && Number((rec as any).campaignId) !== Number(campaignId)) {
					mismatches.push({ applicationId: compareSelectedKeys[idx], field: 'campaignId', record: (rec as any).campaignId });
				}
				if (typeof (rec as any).jobId !== 'undefined' && jobId != null && Number((rec as any).jobId) !== Number(jobId)) {
					mismatches.push({ applicationId: compareSelectedKeys[idx], field: 'jobId', record: (rec as any).jobId });
				}
			});
			if (mismatches.length) console.warn('Detected possible job/campaign mismatches for selected records:', mismatches);
		} catch (dbgErr) {
			console.error('Error while preparing compare debug info', dbgErr);
		}
		setCompareLoading(true);
		try {
			const body: any = { applicationIds };
			const jid = Number(jobId);
			if (!Number.isNaN(jid)) body.jobId = jid;
			if (typeof campaignId === "number") body.campaignId = campaignId;

			const resp = await compareResumeService.compare(body);
			console.debug("compare response:", resp);
			if (resp) {
				const statusStr = String(resp.status || "");
				if (statusStr.toLowerCase() === "success" || resp.data) {
					message.success("Compare request sent");
					setCompareMode(false);
					setCompareSelectedKeys([]);
				} else {
					let errMsg = resp.message || "Compare request failed";
					try {
						if (!errMsg && resp.data) errMsg = JSON.stringify(resp.data);
						if (resp.data && (resp.data as any).errors) {
							errMsg = (resp.data as any).errors.join ? (resp.data as any).errors.join("; ") : JSON.stringify((resp.data as any).errors);
						}
					} catch (ee) {
						console.error("Error formatting compare response", ee);
					}
					message.error(errMsg);
				}
			} else {
				message.error("Compare request failed");
			}
		} catch (err) {
			console.error(err);
			message.error("Compare request failed");
		} finally {
			setCompareLoading(false);
		}
	};

	return (
		<>
			{compareMode && (
				<div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 8 }}>
					<Button onClick={() => { setCompareMode(false); setCompareSelectedKeys([]); }}>Cancel</Button>
					<Button type="primary" loading={compareLoading} onClick={handleCompare} disabled={compareSelectedKeys.length === 0}>
						Compare ({compareSelectedKeys.length})
					</Button>
				</div>
			)}
			<Table
				className={`edit-mode-table ${className ?? ""}`}
				rowKey={(r: Resume) => r.applicationId ?? r.resumeId}
				loading={loading}
				dataSource={dataSource}
				rowSelection={
					compareMode
						? {
							selectedRowKeys: compareSelectedKeys,
							columnWidth: '2%',
							onChange: (keys) => {
								const attempted = (keys as React.Key[]) || [];
								const allowed = attempted.filter((k) => {
									const id = Number(k);
									const rec = dataSource.find((r) => Number(r.applicationId ?? r.resumeId) === id);
									return !!rec && isSelectable(rec);
								});
								if (allowed.length > 5) {
									message.error("You may select up to 5 resumes only");
									return;
								}
								setCompareSelectedKeys(allowed);
							},
							getCheckboxProps: (record: Resume) => {
								const selectable = isSelectable(record);
								return {
									disabled: !selectable,
									style: !selectable ? { display: "none" } : undefined,
								} as any;
							},
							type: "checkbox",
						}
						: editMode
							? {
								selectedRowKeys: selectedRowKeys ?? [],
								onChange: (keys) => onSelectedRowKeysChange && onSelectedRowKeysChange(keys as React.Key[]),
								type: "radio",
							}
							: undefined
				}
				columns={columns}
				scroll={{ y: "60vh" }}
				pagination={{
					current: currentPage,
					pageSize: pageSize,
					total: totalCount,
					showSizeChanger: true,
					showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} resumes`,
					onChange: (page: number, size: number) => {
						console.log('Pagination onChange:', { page, size });
						onPageChange(page, size);
					},
					onShowSizeChange: (current: number, size: number) => {
						console.log('Pagination onShowSizeChange:', { current, size });
						onPageChange(1, size); // Reset to page 1 when changing page size
					},
					pageSizeOptions: ['10', '20', '50', '100'],
				}}
			/>

			<Modal
				title={<div style={{ textAlign: 'center', width: '100%' }}>Confirm delete</div>}
				open={confirmModalOpen}
				onCancel={() => {
					setConfirmModalOpen(false);
					setPendingDelete(null);
					setConfirmInput("");
				}}
				footer={
					<div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, width: '100%' }}>
						<div>
							<Button
								className="company-btn"
								style={{ marginRight: 12 }}
								onClick={() => {
									setConfirmModalOpen(false);
									setPendingDelete(null);
									setConfirmInput("");
								}}>Cancel</Button>
						</div>
						<div>
							<Button
								danger
								loading={confirmLoading}
								disabled={confirmInput.trim() !== (pendingDelete?.name ?? "")}
								onClick={async () => {
									if (!pendingDelete) return;
									setConfirmLoading(true);
									try {
										await Promise.resolve(onDelete(pendingDelete.resumeId));
									} finally {
										setConfirmLoading(false);
										setConfirmModalOpen(false);
										setPendingDelete(null);
										setConfirmInput("");
									}
								}}
							>
								Delete
							</Button>
						</div>
					</div>
				}
			>
				<div style={{ textAlign: 'center' }}>
					<p style={{ marginBottom: 12 }}>
						Type <strong>{pendingDelete?.name}</strong> to confirm deletion.
					</p>
					<Input style={{ margin: '0 auto', display: 'block', maxWidth: "100%" }} value={confirmInput} onChange={(e) => setConfirmInput(e.target.value)} placeholder="Enter full name to confirm" />
				</div>
			</Modal>

			<Modal
				title={<div style={{ textAlign: 'center', width: '100%' }}>Confirm adjusted score change</div>}
				open={adjConfirmOpen}
				onCancel={() => {
					setAdjConfirmOpen(false);
					setAdjPendingName(null);
					setAdjPendingValue(null);
				}}
				footer={
					<div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, width: '100%' }}>
						<div>
							<Button danger onClick={() => { setAdjConfirmOpen(false); setAdjPendingAppId(null); setAdjPendingValue(null); }}>Cancel</Button>
						</div>
						<div>
							<Button className="company-btn--filled" loading={adjConfirmLoading} onClick={confirmAdjusted}>Confirm</Button>
						</div>
					</div>
				}
			>
				<div style={{ textAlign: 'center' }}>
					<p style={{ marginBottom: 12 }}>
						You are about to change adjusted score to <strong>{adjPendingValue ?? '—'}</strong> for <strong>{adjPendingName ?? '—'}</strong>.
					</p>
				</div>
			</Modal>
		</>
	);
});

export default ResumeTable;
