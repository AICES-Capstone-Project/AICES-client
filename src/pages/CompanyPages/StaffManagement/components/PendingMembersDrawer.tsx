import React, { useState } from "react";
import { Drawer, List, Button, Empty, Modal, Card, Tag, Avatar } from "antd";
import { ArrowRightOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';

type JoinRequest = {
  comUserId: number;
  userId: number;
  fullName?: string;
  email?: string;
  joinStatus?: string | null;
  avatarUrl?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  createdAt?: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  requests: JoinRequest[];
  onApprove: (req: JoinRequest) => Promise<void>;
  onReject?: (req: JoinRequest) => Promise<void>;
};

const PendingMembersDrawer: React.FC<Props> = ({ open, onClose, requests, onApprove, onReject }) => {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<JoinRequest | null>(null);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [detailRequest, setDetailRequest] = useState<JoinRequest | null>(null);

  const handleApproveClick = (r: JoinRequest) => {
    setSelectedRequest(r);
    setConfirmVisible(true);
  };

  const handleShowDetail = (r: JoinRequest) => {
    setDetailRequest(r);
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

  const formatDateTime = (iso?: string | null) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "-";
    const pad = (n: number) => String(n).padStart(2, "0");
    const dd = pad(d.getDate());
    const mm = pad(d.getMonth() + 1);
    const yyyy = d.getFullYear();
    const HH = pad(d.getHours());
    const MM = pad(d.getMinutes());
    return `${dd}/${mm}/${yyyy} ${HH}:${MM}`;
  };
  return (
    <Drawer
      title={
        detailRequest ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ fontWeight: 700700, marginLeft: 8 }}>{detailRequest.fullName}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Button type="text" icon={<ArrowRightOutlined />} onClick={() => setDetailRequest(null)} />
            </div>
          </div>
        ) : (
          `Pending Members (${requests.length})`
        )
      }
      open={open}
      onClose={() => {
        setDetailRequest(null);
        onClose();
      }}
      width={420}
    >
      {detailRequest ? (
        <div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center' }}>
              <Avatar src={detailRequest.avatarUrl || undefined} size={80} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 10, }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MailOutlined style={{ color: 'var(--color-primary-medium)' }} />
                  <div style={{ fontSize: 13 }}>{detailRequest.email || '-'}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <PhoneOutlined style={{ color: 'var(--color-primary-medium)' }} />
                  <div style={{ fontSize: 13 }}>{detailRequest.phoneNumber || '-'}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <HomeOutlined style={{ color: 'var(--color-primary-medium)' }} />
                  <div style={{ fontSize: 13 }}>{detailRequest.address || '-'}</div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ width: '100%', textAlign: 'right', fontSize: 12, color: '#999', marginBottom: 16, marginTop: 24 }}>
            Requested at: {formatDateTime(detailRequest.createdAt)}
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', gap: 8 }}>

            <Button
              danger
              onClick={async () => {
                if (!detailRequest) return;
                if (onReject) {
                  try {
                    setRejecting(true);
                    await onReject(detailRequest);
                    setDetailRequest(null);
                  } catch (e) {
                    console.error('Reject error', e);
                  } finally {
                    setRejecting(false);
                  }
                }
              }}
              loading={rejecting}
            >
              Reject
            </Button>
            <Button className="company-btn--filled" onClick={() => handleApproveClick(detailRequest)}>
              Approve
            </Button>
          </div>
        </div>
      ) : requests.length === 0 ? (
        <Empty description="No pending members" />
      ) : (
        <List
          dataSource={requests}
          renderItem={(r, index) => (
            <List.Item key={r.comUserId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Card
                hoverable
                style={{ width: "100%", cursor: "pointer" }}
                bodyStyle={{ padding: 12, display: "flex", alignItems: "center", gap: 12 }}
                onClick={() => handleShowDetail(r)}
              >
                <div style={{ width: 30 }}>
                  {index + 1}.
                </div>
                <div style={{ display: 'flex', flex: 1, gap: 12, alignItems: 'center' }}>
                  <Avatar src={r.avatarUrl || undefined} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{r.fullName || r.email}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>{r.email}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Tag color={r.joinStatus ? "blue" : "orange"}>
                    {r.joinStatus ? r.joinStatus : "Pending"}
                  </Tag>
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}

      <Modal
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
        <div style={{ textAlign: "center", fontSize: 16, marginTop: 8 }}>
          <span>Are you sure you want to approve <strong>{selectedRequest?.fullName || selectedRequest?.email}</strong> staff?</span>
        </div>
      </Modal>

      {/* previously used modal for details — now showing details inline in drawer */}
    </Drawer>
  );
};

export default PendingMembersDrawer;
