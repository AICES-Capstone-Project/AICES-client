import { Modal, Input, Button } from "antd";
import type { Company } from "../../../../types/company.types";

interface RejectCompanyModalProps {
  open: boolean;
  loading: boolean;
  company: Company | null;
  reason: string;
  onReasonChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function RejectCompanyModal({
  open,
  loading,
  company,
  reason,
  onReasonChange,
  onCancel,
  onConfirm,
}: RejectCompanyModalProps) {
  return (
    <Modal
      open={open}
      title={
        <div className="system-modal-title">
          Reject Company {company ? `#${company.companyId}` : ""}
        </div>
      }
      onCancel={onCancel}
      footer={null}
      className="system-modal"
      destroyOnClose
    >
      {/* SECTION TITLE */}
      <div className="system-modal-section-title">Rejection Reason</div>

      {/* TEXTAREA */}
      <Input.TextArea
        rows={4}
        value={reason}
        onChange={(e) => onReasonChange(e.target.value)}
        placeholder="Enter the reason for rejecting this company..."
        className="reject-textarea"
        maxLength={500}
        showCount
        style={{ marginTop: 8, marginBottom: 24 }}
      />

      {/* FOOTER */}
      <div className="system-modal-footer">
        <Button
          className="system-modal-btn system-modal-btn-cancel"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          className="system-modal-btn system-modal-btn-danger"
          danger
          loading={loading}
          onClick={onConfirm}
        >
          Reject
        </Button>
      </div>
    </Modal>
  );
}
