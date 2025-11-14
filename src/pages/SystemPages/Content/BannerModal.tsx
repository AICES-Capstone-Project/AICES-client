import { useEffect } from "react";
import { Button, Form, Input, Modal, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { bannerService } from "../../../services/bannerService";
import type { BannerConfig } from "../../../types/banner.types";

interface BannerModalProps {
  open: boolean;
  onClose: () => void;
  fetchData: () => void;
  editData: BannerConfig | null;
}

export default function BannerModal({
  open,
  onClose,
  fetchData,
  editData,
}: BannerModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editData) {
      form.setFieldsValue({
        title: editData.title,
        colorCode: editData.colorCode,
      });
    } else {
      form.resetFields();
    }
  }, [editData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const fd = new FormData();
      fd.append("Title", values.title);
      if (values.colorCode) fd.append("ColorCode", values.colorCode);
      if (values.source?.file) {
        fd.append("Source", values.source.file);
      }

      if (editData) {
        await bannerService.update(editData.id, fd);
        message.success("Updated banner successfully");
      } else {
        await bannerService.create(fd);
        message.success("Created banner successfully");
      }

      fetchData();
      onClose();
    } catch (error) {
      // nếu user bấm cancel form.validateFields sẽ throw, khỏi show lỗi
      if ((error as any)?.errorFields) return;
      message.error("Something went wrong");
    }
  };

  return (
    <Modal
      open={open}
      title={editData ? "Edit Banner" : "Create Banner"}
      onCancel={onClose}
      onOk={handleSubmit}
      okText={editData ? "Update" : "Create"}
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter title" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Color Code" name="colorCode">
          <Input placeholder="#FFD700 (optional)" />
        </Form.Item>

        <Form.Item label="Image" name="source">
          <Upload beforeUpload={() => false} maxCount={1}>
            <Button icon={<UploadOutlined />}>Upload image</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}
