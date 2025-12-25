import React from "react";
import { Drawer, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";

interface UploadDrawerProps {
	open: boolean;
	onClose: () => void;
	jobTitle: string;
	jobId?: string;
	uploading: boolean;
	onUpload: (file: File) => Promise<boolean>;
}

const UploadDrawer: React.FC<UploadDrawerProps> = ({
	open,
	onClose,
	jobTitle,
	jobId,
	uploading,
	onUpload,
}) => {
	return (
		<Drawer
			title={`Upload CV - ${jobTitle || `Job #${jobId}`}`}
			width={500}
			onClose={onClose}
			open={open}
			destroyOnClose
		>
			<Upload.Dragger
				multiple={false}
				beforeUpload={onUpload}
				accept=".pdf,.doc,.docx"
				disabled={uploading}
				showUploadList={false}
				style={{ padding: 12, borderColor: 'var(--color-primary-medium)' }}
			>
				<p className="ant-upload-drag-icon">
					<InboxOutlined style={{ color: 'var(--color-primary-medium)' }} />
				</p>
				<p className="ant-upload-text">Click or drag CV files here</p>
				<p className="ant-upload-hint">
					Supports PDF / DOC / DOCX. The AI system will automatically analyze
					and evaluate resumes.
				</p>
			</Upload.Dragger>
		</Drawer>
	);
};

export default UploadDrawer;
