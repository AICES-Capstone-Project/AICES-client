import React, { useEffect, useState } from "react";
import { Drawer, Form, Input, Upload, Button } from "antd";
import { companyService } from "../../../../services/companyService";
import { toastError, toastSuccess } from "../../../../components/UI/Toast";
import { validateWebsite } from "../../../../utils/validations/company.validation";
import type { Company } from "../../../../types/company.types";

type Props = {
  open: boolean;
  onClose: () => void;
  company: Company | null;
  onUpdated?: (newCompany: Company) => void;
};

const CompanyEditModal: React.FC<Props> = ({ open, onClose, company, onUpdated }) => {
  const [form] = Form.useForm();
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (company) {
      form.setFieldsValue({ description: company.description || "", address: company.address || "", websiteUrl: company.websiteUrl || "" });
      setUploadFile(null);
      setPreviewUrl(company.logoUrl || null);
    }
  }, [company, form, open]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const fd = new FormData();
      if (values.description !== undefined) fd.append("description", values.description);
      if (values.address !== undefined) fd.append("address", values.address);
      if (values.websiteUrl !== undefined) fd.append("websiteUrl", values.websiteUrl);
      if (uploadFile) fd.append("logoFile", uploadFile);

      setSaving(true);
      const resp = await companyService.updateProfile(fd);
      if (resp?.status === "Success" || resp?.status === "success") {
        toastSuccess("Company profile updated");
        const refreshed = await companyService.getSelf();
        if (refreshed?.status === "Success" || refreshed?.status === "success") {
          onUpdated && onUpdated(refreshed.data as Company);
        }
        onClose();
      } else {
        toastError("Failed to update profile", resp?.message);
      }
    } catch (err: any) {
      console.error("Update profile error:", err);
      if (!err.errorFields) toastError("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer
      open={open}
      title="Edit Company Info"
      placement="right"
      onClose={onClose}
      width={520}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <Upload
              beforeUpload={(file) => {
                setUploadFile(file);
                try {
                  const url = URL.createObjectURL(file);
                  setPreviewUrl(url);
                } catch (e) {
                  setPreviewUrl(null);
                }
                return false;
              }}
              showUploadList={false}
              maxCount={1}
            >
              <div style={{ width: 160, height: 160, borderRadius: 12, overflow: "hidden", border: "1px solid #ddd", cursor: "pointer", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {previewUrl ? (
                  <img src={previewUrl} alt="logo preview" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block", margin: "0 auto" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#fafafa" }}>
                    <span style={{ color: "#888" }}>No logo</span>
                  </div>
                )}

                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "white", background: "rgba(0,0,0,0)", transition: "background 150ms" }} className="hover-overlay">
                  <div style={{ padding: 8, background: "rgba(0,0,0,0.5)", borderRadius: 6 }}>Edit logo</div>
                </div>
              </div>
            </Upload>
          </div>
        </Form.Item>
        <Form.Item
          label="Address"
          name="address"
          rules={[
            { required: true, message: 'Please enter the company address' },
            { max: 65, message: 'Address cannot exceed 65 characters' },
          ]}
        >
          <Input maxLength={65} showCount />
        </Form.Item>

        <Form.Item
          label="Website"
          name="websiteUrl"
          rules={[
            { required: true, message: 'Please enter a website URL' },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                const validation = validateWebsite(value);
                return validation.isValid
                  ? Promise.resolve()
                  : Promise.reject(new Error(validation.message));
              }
            },
          ]}
        >
          <Input maxLength={50} showCount />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[
            { max: 400, message: 'Description cannot exceed 400 characters' },
          ]}
        >
          <Input.TextArea rows={3} maxLength={400} showCount />
        </Form.Item>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 12 }}>
          <Button danger onClick={onClose}>Cancel</Button>
          <Button className="company-btn--filled" onClick={handleSubmit} loading={saving}>Save</Button>
        </div>
      </Form>
    </Drawer>
  );
};

export default CompanyEditModal;
