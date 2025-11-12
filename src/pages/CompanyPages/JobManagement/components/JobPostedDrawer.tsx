import React from 'react';
import { Drawer, List, Empty, Tag } from 'antd';
import type { CompanyJob } from '../../../../services/jobService';
import { tagColorFor } from '../../../../utils/tagUtils';

type Props = {
  open: boolean;
  onClose: () => void;
  postedJobs: CompanyJob[];
};

const PostedDrawer: React.FC<Props> = ({ open, onClose, postedJobs }) => {
  return (
    <Drawer
      title={`My Posted Jobs (${postedJobs.length})`}
      open={open}
      onClose={onClose}
      width={420}
    >
      {postedJobs.length === 0 ? (
        <Empty description="No posted jobs" />
      ) : (
        <List
          dataSource={postedJobs}
          renderItem={(job, index) => (
            <List.Item
              key={job.jobId}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ width: 30}}>
                {index + 1}.
              </div>

              <div
                style={{
                  flex: 1,
                }}
              >
                <div style={{ fontWeight: 600 }}>{job.title}</div>
                <div style={{ fontSize: 12, color: '#666' }}>
                  {job.categoryName || job.specializationName}
                </div>
              </div>

              <div style={{ marginLeft: 12 }}>
                <Tag color={tagColorFor(job.jobStatus)}>
                  {job.jobStatus || '-'}
                </Tag>
              </div>
            </List.Item>
          )}
        />
      )}
    </Drawer>
  );
};

export default PostedDrawer;
