import { Modal, Input } from "antd";
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
      title={company ? `Reject company #${company.companyId}` : "Reject company"}
      onCancel={onCancel}
      onOk={onConfirm}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 8 }}>
        <b>Rejection reason</b>
      </div>
      <Input.TextArea
        rows={4}
        value={reason}
        onChange={(e) => onReasonChange(e.target.value)}
        placeholder="Nhập lý do từ chối công ty này..."
      />
    </Modal>
  );
}
