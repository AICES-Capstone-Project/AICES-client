import React, { useState } from 'react';
import { Drawer, List, Button, Spin, Divider, Tag, Modal } from 'antd';
import { ArrowRightOutlined, CloseOutlined, CheckOutlined, EyeOutlined } from '@ant-design/icons';

type Props = {
  open: boolean;
  onClose: () => void;
  pendingCampaigns: any[];
  loading: boolean;
  pendingDetail: any | null;
  pendingDetailLoading: boolean;
  pendingActionLoading: boolean;
  onView: (campaignId: number) => void;
  onApprove: () => void;
  onReject: () => void;
  onBack: () => void;
};

const PendingCampaignsDrawer: React.FC<Props> = ({
  open,
  onClose,
  pendingCampaigns,
  loading,
  pendingDetail,
  pendingDetailLoading,
  pendingActionLoading,
  onView,
  onApprove,
  onReject,
  onBack,
}) => {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);

  const handleConfirmOk = () => {
    if (confirmAction === 'approve') {
      onApprove();
    } else if (confirmAction === 'reject') {
      onReject();
    }
    setConfirmVisible(false);
    setConfirmAction(null);
  };

  const handleConfirmCancel = () => {
    setConfirmVisible(false);
    setConfirmAction(null);
  };
  return (
    <Drawer
      title={
        pendingDetail ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>{pendingDetail.title || 'Campaign details'}</span>
              <Tag color={pendingDetail.status === 'Pending' ? 'orange' : pendingDetail.status === 'Published' ? 'green' : 'default'}>{pendingDetail.status || '-'}</Tag>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Button type="text" icon={<ArrowRightOutlined />} onClick={onBack} />
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>Pending Campaigns ({pendingCampaigns.length})</span>
          </div>
        )
      }
      open={open}
      onClose={onClose}
      width={760}
      bodyStyle={{ padding: 24 }}
    >
      {pendingDetail ? (
        pendingDetailLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}><Spin /></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ color: '#666', fontSize: 12 }}>Creator</div>
                <div style={{ fontWeight: 600 }}>{pendingDetail.creatorName || pendingDetail.creator || '-'}</div>
              </div>
              <div>
                <div style={{ color: '#666', fontSize: 12 }}>Created at</div>
                <div>{pendingDetail.createdAt ? new Date(pendingDetail.createdAt).toLocaleString() : '-'}</div>
              </div>
              <div>
                <div style={{ color: '#666', fontSize: 12 }}>Start date</div>
                <div>{pendingDetail.startDate ? new Date(pendingDetail.startDate).toLocaleDateString() : '-'}</div>
              </div>
              <div>
                <div style={{ color: '#666', fontSize: 12 }}>End date</div>
                <div>{pendingDetail.endDate ? new Date(pendingDetail.endDate).toLocaleDateString() : '-'}</div>
              </div>
            </div>

            <div>
              <div style={{ color: '#666', fontSize: 12 }}>Description</div>
              <div style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>{pendingDetail.description || '-'}</div>
            </div>

            <Divider />

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>Jobs</strong>
                <span style={{ color: '#666', fontSize: 12 }}>{Array.isArray(pendingDetail.jobs) ? `${pendingDetail.jobs.length} job(s)` : ''}</span>
              </div>
              {Array.isArray(pendingDetail.jobs) && pendingDetail.jobs.length ? (
                <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
                  {pendingDetail.jobs.map((j: any) => (
                    <div key={j.jobId} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '12px', border: '1px solid #f0f0f0', borderRadius: 8, background: '#fff' }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{j.jobTitle || j.title || `#${j.jobId}`}</div>
                      </div>
                      <div style={{ textAlign: 'right', minWidth: 140, display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'flex-end' }}>
                        <div style={{ color: '#666', fontSize: 13 }}><strong style={{ color: '#333', fontWeight: 600 }}>Target:</strong>&nbsp;{Number(j.targetQuantity ?? j.target ?? 0)}</div>
                        <div style={{ color: '#666', fontSize: 13 }}><strong style={{ color: '#333', fontWeight: 600 }}>Hired:</strong>&nbsp;{Number(j.currentHired ?? j.filled ?? 0)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ marginTop: 8, color: '#666' }}>{Array.isArray(pendingDetail.jobIds) ? `${pendingDetail.jobIds.length} job(s)` : '0 job(s)'}</div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 12 }}>
              <Button
                danger
                icon={<CloseOutlined />}
                loading={pendingActionLoading}
                onClick={() => {
                  setConfirmAction('reject');
                  setConfirmVisible(true);
                }}
              >
                Reject
              </Button>
              <Button
                className="company-btn--filled"
                icon={<CheckOutlined />}
                loading={pendingActionLoading}
                onClick={() => {
                  setConfirmAction('approve');
                  setConfirmVisible(true);
                }}
              >
                Approve
              </Button>
            </div>
            <Modal
              open={confirmVisible}
              title={
                <div style={{ textAlign: 'center', width: '100%', fontWeight: 600, marginBottom: 8 }}>
                    {confirmAction === 'approve' ? 'Are you sure you want to approve this campaign?' : 'Are you sure you want to reject this campaign?'}
                </div>
              }
              onCancel={handleConfirmCancel}
              centered
              footer={
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Button danger onClick={handleConfirmCancel}>No</Button>
                  <Button className="company-btn" type="primary" onClick={handleConfirmOk} loading={pendingActionLoading}>Yes</Button>
                </div>
              }
            />
          </div>
        )
      ) : (
        <List
          dataSource={pendingCampaigns}
          loading={loading}
          renderItem={(item: any, idx) => (
            <List.Item
              key={item.campaignId}
              className="pending-campaign-item"
              style={{ padding: 12, borderRadius: 8 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 12 }}>
                <div style={{ width: 40, textAlign: 'center', color: '#666', flexShrink: 0 }}>{idx + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title || '-'}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>{`Created by ${item.creatorName || item.creator || '-'} on ${item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}`}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 8, flexShrink: 0 }}>
                  <Button type="text" icon={<EyeOutlined />} onClick={() => onView(item.campaignId)} />
                  <Tag color={item.status === 'Pending' ? 'orange' : item.status === 'Published' ? 'green' : 'default'}>{item.status || '-'}</Tag>
                </div>
              </div>
            </List.Item>
          )}
        />
      )}
    </Drawer>
  );
};

export default PendingCampaignsDrawer;
