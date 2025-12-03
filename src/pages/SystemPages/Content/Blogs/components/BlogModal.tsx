// src/pages/SystemPages/Content/Blogs/components/BlogModal.tsx

import { Modal, Form, Input } from "antd";
import { useEffect } from "react";

export interface BlogFormValues {
	title: string;
	slug: string;
	content: string;
	thumbnailUrl?: string | null;
}

interface BlogModalProps {
	open: boolean;
	mode: "create" | "edit";
	loading: boolean;
	initialValues?: BlogFormValues;
	onSubmit: (values: BlogFormValues) => void;
	onCancel: () => void;
}

const { TextArea } = Input;

export default function BlogModal({
	open,
	mode,
	loading,
	initialValues,
	onSubmit,
	onCancel,
}: BlogModalProps) {
	const [form] = Form.useForm<BlogFormValues>();

	useEffect(() => {
		if (open) {
			if (initialValues) {
				form.setFieldsValue(initialValues);
			} else {
				form.resetFields();
			}
		}
	}, [open, initialValues, form]);

	const handleOk = () => {
		form.submit();
	};

	const handleFinish = (values: BlogFormValues) => {
		onSubmit(values);
	};

	return (
		<Modal
			open={open}
			title={mode === "create" ? "Create Blog" : "Edit Blog"}
			okText={mode === "create" ? "Create" : "Save"}
			cancelText="Cancel"
			onOk={handleOk}
			onCancel={onCancel}
			confirmLoading={loading}
			destroyOnClose
		>
			<Form<BlogFormValues>
				form={form}
				layout="vertical"
				onFinish={handleFinish}
			>
				<Form.Item
					label="Title"
					name="title"
					rules={[{ required: true, message: "Please enter title" }]}
				>
					<Input placeholder="Enter blog title" />
				</Form.Item>

				<Form.Item
					label="Slug"
					name="slug"
					rules={[{ required: true, message: "Please enter slug" }]}
				>
					<Input placeholder="slug-for-this-blog" />
				</Form.Item>

				<Form.Item
					label="Thumbnail URL"
					name="thumbnailUrl"
				>
					<Input placeholder="https://example.com/image.jpg" />
				</Form.Item>

				<Form.Item
					label="Content"
					name="content"
					rules={[{ required: true, message: "Please enter content" }]}
				>
					<TextArea
						rows={6}
						placeholder="Write your blog content here..."
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
}
