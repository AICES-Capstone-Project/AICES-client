import React from "react";
import { Table, Tag, Button, Space, Tooltip, Popover } from "antd";
import { useNavigate } from "react-router-dom";
import { Flame } from "lucide-react";
import {
	EyeOutlined,
	EditOutlined,
	ReloadOutlined,
	TeamOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

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

interface ResumeTableProps {
	loading: boolean;
	dataSource: Resume[];
	editMode: boolean;
	selectedRowKeys: React.Key[];
	onSelectedRowKeysChange: (keys: React.Key[]) => void;
	currentPage: number;
	pageSize: number;
	onPageChange: (page: number, size: number) => void;
	onViewDetail: (resumeId: number) => void;
	onEnterEditMode: () => void;
	onRetry: (resumeId: number) => void;
	retryingIds: number[];
	scoreCounts: Map<number, number>;
	jobId?: string;
	targetQuantity?: number;
}

const ResumeTable: React.FC<ResumeTableProps> = ({
	loading,
	dataSource,
	editMode,
	selectedRowKeys,
	onSelectedRowKeysChange,
	currentPage,
	pageSize,
	onPageChange,
	onViewDetail,
	onEnterEditMode,
	onRetry,
	retryingIds,
	scoreCounts,
	jobId,
	targetQuantity,
}) => {
	const navigate = useNavigate();

	const isQualifiedCandidate = React.useCallback((index: number, record: Resume) => {
		// Must have score >= 50
		if (record.totalResumeScore == null || record.totalResumeScore < 50) {
			return false;
		}
		// Check if this candidate is within the top qualified range
		return targetQuantity ? index < targetQuantity : false;
	}, [targetQuantity]);

	const columns: ColumnsType<Resume> = [
		{
			title: "No",
			width: 80,
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
		{
			title: "Ties",
			width: 100,
			align: "center" as const,
			render: (_: unknown, record: Resume) => {
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
							style={{
								cursor: "pointer",
								backgroundColor: bgColor,
								color: textColor,
							}}
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
						onClick={() => onViewDetail(record.resumeId)}
					/>
					{/* Always show edit icon — clicking enters edit mode */}
					<Tooltip title="Enter edit mode (select resumes)">
						<Button
							type="text"
							icon={<EditOutlined />}
							style={{ color: "#096dd9" }}
							onClick={onEnterEditMode}
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
								onClick={() => onRetry(record.resumeId)}
							/>
						</Tooltip>
					)}
				</Space>
			),
		},
	];

	return (
		<Table
			rowKey="resumeId"
			loading={loading}
			dataSource={dataSource}
			rowSelection={
				editMode
					? {
							selectedRowKeys,
							onChange: onSelectedRowKeysChange,
							type: "checkbox",
					  }
					: undefined
			}
			columns={columns}
			scroll={{ y: "67vh" }}
			pagination={{
				current: currentPage,
				pageSize: pageSize,
				total: dataSource.length,
				showSizeChanger: true,
				showTotal: (total) => `Total ${total} resumes`,
				pageSizeOptions: ["10", "20", "50", "100"],
				onChange: onPageChange,
			}}
		/>
	);
};

export default ResumeTable;
