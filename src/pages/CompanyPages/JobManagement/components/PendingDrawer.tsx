import React from 'react';
import { Drawer, List, Button, Tag, Empty } from 'antd';
import type { CompanyJob } from '../../../../services/jobService';

type Props = {
  open: boolean;
  onClose: () => void;
  pendingJobs: CompanyJob[];
  onApprove: (job: CompanyJob) => Promise<void>;
  onView: (job: CompanyJob) => void;
};

const PendingDrawer: React.FC<Props> = ({ open, onClose, pendingJobs, onApprove, onView }) => {
  return (
    <Drawer title={`Pending Jobs (${pendingJobs.length})`} open={open} onClose={onClose} width={420}>
      {pendingJobs.length === 0 ? (
        <Empty description="No pending jobs" />
      ) : (
        <List
          dataSource={pendingJobs}
          renderItem={(job) => (
            <List.Item key={job.jobId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => onView(job)}>
                <div style={{ fontWeight: 600 }}>{job.title}</div>
                <div style={{ fontSize: 12, color: '#666' }}>{job.categoryName || job.specializationName}</div>
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Tag color="gold">Pending</Tag>
                <Button type="primary" onClick={() => onApprove(job)} size="small">
                  Approve
                </Button>
              </div>
            </List.Item>
          )}
        />
      )}
    </Drawer>
  );
};

export default PendingDrawer;
