import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Modal,
  Upload,
  ColorPicker,
  type UploadProps,
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { UploadOutlined } from "@ant-design/icons";

import { bannerService } from "../../../../../services/bannerService";
import type { BannerConfig } from "../../../../../types/banner.types";
import { toastError, toastSuccess } from "../../../../../components/UI/Toast";

interface BannerModalProps {
  open: boolean;
  onClose: () => void;
  fetchData: () => void;
  editData: BannerConfig | null;
}

type BannerFormValues = {
  title: string;
  colorCode?: string;
  source?: UploadFile[];
};

export default function BannerModal({
  open,
  onClose,
  fetchData,
  editData,
}: BannerModalProps) {
  const [form] = Form.useForm<BannerFormValues>();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // ===== EFFECT: fill form khi edit / reset khi create =====
  useEffect(() => {
    if (editData) {
      form.setFieldsValue({
        title: editData.title,
        // 👇 lấy colorCode từ editData nếu có, không thì để rỗng
        colorCode: (editData as any).colorCode ?? "",
      });

      const img =
        (editData as any).src ||
        (editData as any).imageUrl ||
        (editData as any).image ||
        null;

      setPreviewImage(img || null);
    } else {
      form.resetFields();
      setPreviewImage(null);
    }
  }, [editData, form]);

  // ===== SUBMIT =====
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const fd = new FormData();
      fd.append("Title", values.title);

      if (values.colorCode) {
        fd.append("ColorCode", values.colorCode);
      }

      const fileList = values.source as UploadFile[] | undefined;
      const fileObj = fileList?.[0]?.originFileObj as File | undefined;
      if (fileObj) {
        fd.append("Source", fileObj);
      }

      if (editData) {
        await bannerService.update(editData.bannerId, fd);
        toastSuccess("Banner updated");
      } else {
        await bannerService.create(fd);
        toastSuccess("Banner created");
      }

      fetchData();
      onClose();
    } catch (e: any) {
      if (e?.errorFields) return;
      toastError("Something went wrong");
    }
  };

  // ===== UPLOAD PROPS (preview + control form) =====
  const uploadProps: UploadProps = {
    listType: "picture-card",
    showUploadList: false,
    beforeUpload: () => false,
    onChange(info) {
      const latestFileList = info.fileList.slice(-1);
      form.setFieldValue("source", latestFileList);

      const rawFile = latestFileList[0]?.originFileObj as File | undefined;
      if (rawFile) {
        const imgURL = URL.createObjectURL(rawFile);
        setPreviewImage(imgURL);
      }
    },
  };

  return (
    <Modal
      open={open}
      title={editData ? "Edit Banner" : "Create Banner"}
      onCancel={onClose}
      onOk={handleSubmit}
      okText={editData ? "Update" : "Create"}
      destroyOnClose
      centered
      className="system-modal"
      width={560}
    >
      <div className="system-modal-section-title">Banner Information</div>

      <Form<BannerFormValues> layout="vertical" form={form}>
        {/* TITLE */}
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter title" }]}
        >
          <Input placeholder="Homepage hero, sidebar promo..." />
        </Form.Item>

        {/* COLOR & PREVIEW GRID */}
        <Form.Item label="Color & Preview" style={{ marginBottom: 0 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
              gap: 16,
              alignItems: "flex-start",
            }}
          >
            {/* COLOR PICKER */}
            <Form.Item
              label="Color Code"
              name="colorCode"
              style={{ marginBottom: 0 }}
            >
              <ColorPicker
                format="hex"
                showText
                value={form.getFieldValue("colorCode") || "#F54964"}
                onChange={(_, hex) => form.setFieldValue("colorCode", hex)}
                getPopupContainer={(trigger) =>
                  trigger.parentElement as HTMLElement
                }
                style={{ width: "100%" }}
              />
            </Form.Item>

            {/* IMAGE UPLOAD + PREVIEW */}
            <Form.Item
              label="Image"
              name="source"
              valuePropName="fileList"
              getValueFromEvent={(e) => e?.fileList}
              style={{ marginBottom: 0 }}
            >
              <Upload {...uploadProps}>
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="banner"
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
                    <div style={{ marginTop: 8, fontSize: 12 }}>
                      Upload image
                    </div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
