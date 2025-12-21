import React from 'react';
import { InfoCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

type Props = {
  jobTarget: number | null;
  jobHiredCount: number | null;
  remaining: number | null;
};

const JobSummary: React.FC<Props> = ({ jobTarget, jobHiredCount, remaining }) => {
  return (
    <div style={{ marginTop: 8, marginBottom: 8, display: 'flex', justifyContent: 'center' }}>
      <div style={{ padding: '10px', borderRadius: 8, background: '#fff', width: '100%', maxWidth: 500, boxShadow: '0 1px 6px rgba(16,24,40,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center', fontSize: 14 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#777' }}>Job target</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{jobTarget ?? 'Unknown'}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#777' }}>Hired</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#237804' }}>{jobHiredCount ?? 0}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#777' }}>Remaining</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: remaining == null ? '#777' : remaining > 0 ? '#096dd9' : remaining === 0 ? '#237804' : '#cf1322' }}>{remaining != null ? remaining : 'N/A'}</div>
            </div>
          </div>
          <div style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
            {remaining == null ? (
              <>
                <InfoCircleOutlined style={{ color: '#888', fontSize: 16 }} />
                <span style={{ color: '#666' }}>Target unknown — cannot determine hiring status.</span>
              </>
            ) : remaining > 0 ? (
              <>
                <InfoCircleOutlined style={{ color: '#096dd9', fontSize: 16 }} />
                <span style={{ color: '#096dd9' }}>You need to hire {remaining} more.</span>
              </>
            ) : remaining === 0 ? (
              <>
                <CheckCircleOutlined style={{ color: '#237804', fontSize: 16 }} />
                <span style={{ color: '#237804' }}>You have hired enough for this job.</span>
              </>
            ) : (
              <>
                <ExclamationCircleOutlined style={{ color: '#cf1322', fontSize: 16 }} />
                <span style={{ color: '#cf1322' }}>You have over-hired by {Math.abs(remaining)}.</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSummary;
