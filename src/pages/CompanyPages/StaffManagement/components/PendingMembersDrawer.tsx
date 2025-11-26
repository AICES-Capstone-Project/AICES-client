import React, { useState } from "react";
import { Drawer, List, Button, Empty, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

type JoinRequest = {
  comUserId: number;
  userId: number;
  fullName?: string;
  email?: string;
  roleName?: string | null;
  requestedAt?: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  requests: JoinRequest[];
  onApprove: (req: JoinRequest) => Promise<void>;
};

const PendingMembersDrawer: React.FC<Props> = ({ open, onClose, requests, onApprove }) => {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<JoinRequest | null>(null);
  const [approving, setApproving] = useState(false);

  const handleApproveClick = (r: JoinRequest) => {
    setSelectedRequest(r);
    setConfirmVisible(true);
  };

  const handleConfirmApprove = async () => {
    if (!selectedRequest) return;
    setApproving(true);
    try {
      await onApprove(selectedRequest);
    } finally {
      setApproving(false);
      setConfirmVisible(false);
      setSelectedRequest(null);
    }
  };
  return (
    <Drawer title={`Pending Members (${requests.length})`} open={open} onClose={onClose} width={420}>
      {requests.length === 0 ? (
        <Empty description="No pending members" />
      ) : (
        <List
          dataSource={requests}
          renderItem={(r, index) => (
            <List.Item key={r.comUserId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ width: 30 }}>
                {index + 1}.
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{r.fullName || r.email}</div>
                <div style={{ fontSize: 12, color: "#666" }}>{r.email}</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Button 
                  className="company-btn--filled" 
                  onClick={() => handleApproveClick(r)} 
                  size="small"
                >
                  Approve
                </Button>
              </div>
            </List.Item>
          )}
        />
      )}

      <Modal
        title="Approve Member"
        open={confirmVisible}
        onCancel={() => {
          setConfirmVisible(false);
          setSelectedRequest(null);
        }}
        footer={[
          <div key="footer" style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <Button
              key="cancel"
              className="company-btn"
              onClick={() => {
                setConfirmVisible(false);
                setSelectedRequest(null);
              }}
            >
              Cancel
            </Button>

            <Button
              key="approve"
              className="company-btn--filled"
              onClick={handleConfirmApprove}
              loading={approving}
            >
              Approve
            </Button>
          </div>,
        ]}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ExclamationCircleOutlined style={{ fontSize: 22, color: "#faad14" }} />
          <span>Are you sure you want to approve <strong>{selectedRequest?.fullName || selectedRequest?.email}</strong>?</span>
        </div>
      </Modal>
    </Drawer>
  );
};

export default PendingMembersDrawer;
