// src/pages/SystemPages/Content/Blogs/components/BlogModal.tsx

import { Modal, Form, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

export interface BlogFormValues {
  title: string;
  content: string;
  thumbnailFile?: File;
}

interface BlogModalProps {
  open: boolean;
  mode: "create" | "edit";
  loading: boolean;
  initialValues?: BlogFormValues;
  initialThumbnailUrl?: string | null;
  initialThumbnailName?: string | null;
  onSubmit: (values: BlogFormValues, thumbnailFile?: File | null) => void;
  onCancel: () => void;
}

const { TextArea } = Input;

export default function BlogModal({
  open,
  mode,
  loading,
  initialValues,
  initialThumbnailUrl,
  initialThumbnailName,
  onSubmit,
  onCancel,
}: BlogModalProps) {
  const [form] = Form.useForm<BlogFormValues>();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }

    // reset / set thumbnail preview
    if (mode === "edit" && initialThumbnailUrl) {
      setPreviewImage(initialThumbnailUrl);
    } else {
      setPreviewImage(null);
    }
  }, [open, initialValues, mode, initialThumbnailUrl, form]);

  const handleOk = () => form.submit();

  const handleFinish = (values: BlogFormValues) => {
    if (mode === "create" && !values.thumbnailFile) {
      message.error("Please choose a thumbnail image");
      return;
    }

    onSubmit(
      { title: values.title, content: values.content },
      values.thumbnailFile ?? null
    );
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
      centered
      className="system-modal"
      width={720}
    >
      <div className="system-modal-section-title">Blog information</div>

      <Form<BlogFormValues> form={form} layout="vertical" onFinish={handleFinish}>
        {/* TITLE */}
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter title" }]}
        >
          <Input placeholder="Enter blog title" />
        </Form.Item>

        {/* THUMBNAIL (BANNER STYLE) */}
        <Form.Item
          label="Thumbnail"
          name="thumbnailFile"
          rules={
            mode === "create"
              ? [{ required: true, message: "Please choose a thumbnail image" }]
              : []
          }
          extra={
            mode === "edit" && initialThumbnailName
              ? `Current: ${initialThumbnailName}`
              : "Upload an image file (.jpg/.jpeg/.png/.webp)"
          }
        >
          <Upload
            listType="picture-card"
            showUploadList={false}
            beforeUpload={() => false}
            accept="image/*"
            onChange={(info) => {
              const raw = info.fileList[0]?.originFileObj as File | undefined;
              form.setFieldValue("thumbnailFile", raw);

              if (raw) {
                setPreviewImage(URL.createObjectURL(raw));
              } else {
                setPreviewImage(null);
              }
            }}
          >
            {previewImage ? (
              <img
                src={previewImage}
                alt="thumbnail"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            ) : (
              <div style={{ textAlign: "center" }}>
                <UploadOutlined />
                <div style={{ marginTop: 8, fontSize: 12 }}>Upload image</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        {/* CONTENT */}
        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: "Please enter content" }]}
        >
          <TextArea
            rows={8}
            placeholder="Write your blog content here..."
            showCount
            maxLength={5000}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
