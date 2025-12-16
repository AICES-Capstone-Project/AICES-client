import React from 'react';
import { Card, Progress, Tag } from 'antd';

interface Props {
  campaign: any;
  percent: number;
  totalTarget: number;
  totalHired: number;
  formatDateTime: (s?: string) => string;
  apiError?: string | null;
}

const CampaignInfoCard: React.FC<Props> = ({ campaign, percent, totalTarget, totalHired, formatDateTime, apiError }) => {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <Card size="small" bordered style={{ maxWidth: 1200, width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderRadius: 8 }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontWeight: 600, color: '#111' }}>{campaign?.description}</p>
            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 10, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Tag style={{ padding: '6px 10px', display: 'flex', alignItems: 'center' }}>
                  <div style={{ minWidth: 220, display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <strong style={{ whiteSpace: 'nowrap' }}>Progress</strong>
                    <div style={{ flex: 1 }}>
                      <Progress
                        percent={percent}
                        size="small"
                        strokeColor={percent === 100 ? '#52c41a' : '#ff4d4f'}
                        trailColor={percent === 0 ? '#b9b9b9ff' : undefined}
                      />
                    </div>
                  </div>
                </Tag>
              </div>
              <div style={{ minWidth: 200 }}>
                <div style={{ fontSize: 12, color: '#666' }}>Start date</div>
                <div style={{ fontWeight: 500 }}>{formatDateTime(campaign?.startDate)}</div>
              </div>
              <div style={{ minWidth: 200 }}>
                <div style={{ fontSize: 12, color: '#666' }}>End date</div>
                <div style={{ fontWeight: 500 }}>{formatDateTime(campaign?.endDate)}</div>
              </div>
              <div style={{ minWidth: 90 }}>
                <div style={{ fontSize: 12, color: '#666' }}>Total Target</div>
                <div style={{ fontWeight: 500 }}>{totalTarget}</div>
              </div>
              <div style={{ minWidth: 60 }}>
                <div style={{ fontSize: 12, color: '#666' }}>Hired</div>
                <div style={{ fontWeight: 500 }}>{totalHired}</div>
              </div>
              <div style={{ minWidth: 90 }}>
                <div style={{ fontSize: 12, color: '#666' }}>Status</div>
                <div style={{ fontWeight: 500 }}>{campaign?.status}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      {apiError && (
        <div style={{ textAlign: 'center', color: '#f5222d', marginTop: 8 }}>{apiError}</div>
      )}
    </div>
  );
};

export default CampaignInfoCard;
