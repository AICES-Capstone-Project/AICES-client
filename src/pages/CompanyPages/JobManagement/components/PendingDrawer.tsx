import React, { useState } from 'react';
import { Drawer, List, Tag, Empty } from 'antd';
import type { CompanyJob } from '../../../../services/jobService';
import { tagColorFor } from '../../../../utils/tagUtils';

type Props = {
  open: boolean;
  onClose: () => void;
  pendingJobs: CompanyJob[];
  onApprove: (job: CompanyJob) => Promise<boolean>;
  onView: (job: CompanyJob) => void;
};

const PendingDrawer: React.FC<Props> = ({ open, onClose, pendingJobs, onView }) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <Drawer title={`Pending Jobs (${pendingJobs.length})`} open={open} onClose={onClose} width={420}>
      {pendingJobs.length === 0 ? (
        <Empty description="No pending jobs" />
      ) : (
        <List
          dataSource={pendingJobs}
          renderItem={(job, index) => {
            const isHovered = hoveredId === job.jobId;
            const itemStyle: React.CSSProperties = {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 8,
              borderRadius: 8,
              border: isHovered ? '1px solid var(--color-primary-medium)' : '1px solid transparent',
              background: isHovered ? '#ffffffff' : 'transparent',
              transition: 'all 0.12s ease',
              cursor: 'pointer',
            };

            return (
              <List.Item
                key={job.jobId}
                style={itemStyle}
                role="button"
                tabIndex={0}
                onClick={() => onView(job)}
                onKeyDown={(e) => e.key === 'Enter' && onView(job)}
                onMouseEnter={() => setHoveredId(job.jobId)}
                onMouseLeave={() => setHoveredId((id) => (id === job.jobId ? null : id))}
              >
                <div style={{ width: 30 }}>{index + 1}.</div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{job.title}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>{job.categoryName || job.specializationName}</div>
                </div>

                <div style={{ marginLeft: 12 }}>
                  <Tag color={tagColorFor(job.jobStatus)}>{job.jobStatus || '-'}</Tag>
                </div>
              </List.Item>
            );
          }}
        />
      )}
    </Drawer>
  );
};

export default PendingDrawer;
