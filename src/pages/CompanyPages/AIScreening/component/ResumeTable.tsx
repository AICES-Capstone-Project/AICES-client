import React from "react";
import { Table, Tag, Button, Space, Tooltip, Modal, Input } from "antd";
// import { useNavigate } from "react-router-dom";
import { Flame } from "lucide-react";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { ResumeLocal } from "../../../../types/resume.types";

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
	onPageChange: (page: number, size: number) => void;
	onViewDetail: (resumeId: number) => void;
	onDelete: (resumeId: number) => void;
	scoreCounts: Map<number, number>;
	jobId?: string;
	targetQuantity?: number;
}

const ResumeTable: React.FC<ResumeTableProps> = ({
	loading,
	dataSource,
	editMode = false,
	className,
	selectedRowKeys = [],
	onSelectedRowKeysChange = () => {},
	currentPage,
	pageSize,
	onViewDetail,
	onDelete,
	// scoreCounts,
	jobId,
	targetQuantity,
}) => {
	// const navigate = useNavigate();

	const [confirmModalOpen, setConfirmModalOpen] = React.useState(false);
	const [pendingDelete, setPendingDelete] = React.useState<{ resumeId: number; name: string } | null>(null);
	const [confirmInput, setConfirmInput] = React.useState("");
	const [confirmLoading, setConfirmLoading] = React.useState(false);

	const isQualifiedCandidate = React.useCallback((index: number, record: Resume) => {
		// Must have score >= 50
		if (record.totalScore == null || record.totalScore < 50) {
			return false;
		}
		// Check if this candidate is within the top qualified range
		return targetQuantity ? index < targetQuantity : false;
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
			title: "Full Name",
			dataIndex: "fullName",
			align: "center" as const,
			render: (text: string, record: Resume, index: number) => {
				const isTopCandidate = isQualifiedCandidate(index, record);
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
		// {
		// 	title: "Ties",
		// 	width: 100,
		// 	align: "center" as const,
		// 	render: (_: unknown, record: Resume) => {
		// 		const score = record.totalScore;
		// 		if (score == null || score === 0)
		// 			return <span style={{ color: "#9ca3af" }}>—</span>;
		// 		const count = scoreCounts.get(score) || 0;
		// 		if (count <= 1) return <span style={{ color: "#9ca3af" }}>—</span>;
		// 		const content = (
		// 			<div style={{ maxWidth: 290 }}>
		// 				<div>There are {count} candidates with the same score.</div>
		// 			</div>
		// 		);

		// 		// choose tag color based on number of ties
		// 		let bgColor = "var(--color-primary-light)";
		// 		let textColor = "#fff";
		// 		if (count < 5) {
		// 			bgColor = "#f472b6"; // pink
		// 			textColor = "#fff";
		// 		} else if (count < 10) {
		// 			bgColor = "#f59e0b"; // amber/yellow
		// 			textColor = "#000";
		// 		} else {
		// 			bgColor = "#ef4444"; // red
		// 			textColor = "#fff";
		// 		}

		// 		return (
		// 			<Popover content={content} trigger={["hover"]}>
		// 				<Tag
		// 					style={{
		// 						cursor: "pointer",
		// 						backgroundColor: bgColor,
		// 						color: textColor,
		// 					}}
		// 					onClick={() =>
		// 						navigate(
		// 							`/company/ai-screening/compare?jobId=${jobId}&score=${score}`
		// 						)
		// 					}
		// 				>
		// 					{count}{" "}
		// 					<TeamOutlined style={{ marginLeft: 6, color: textColor }} />
		// 				</Tag>
		// 			</Popover>
		// 		);
		// 	},
		// },
		{
			title: "Actions",
			key: "actions",
			width: "15%",
			align: "center" as const,
			render: (_, record) => (
				<Space size="middle">
					<Button
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
					/>
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

	return (
		<>
			<Table
				className={`edit-mode-table ${className ?? ""}`}
				rowKey="resumeId"
				loading={loading}
				dataSource={dataSource}
				rowSelection={
					editMode
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
					pageSize: 10,
					total: dataSource.length,
					showSizeChanger: false,
					showTotal: (total) => `Total ${total} resumes`,
					
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
					<div style={{ display: 'flex', justifyContent: 'center', gap: 12, width: '100%' }}>
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
		</>
	);
};

export default ResumeTable;
