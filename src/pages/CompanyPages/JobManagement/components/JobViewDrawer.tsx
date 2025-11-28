import { Drawer, Descriptions, Tag, Button, message } from "antd";
import type { CompanyJob } from "../../../../services/jobService";
import { tagColorFor } from "../../../../utils/tagUtils";

type Props = {
  open: boolean;
  onClose: () => void;
  job: CompanyJob | null;
  onApprove?: (job: CompanyJob) => Promise<boolean>;
  isPending?: boolean;
};

const JobViewDrawer = ({ open, onClose, job, onApprove, isPending }: Props) => {
  const handleApproveClick = async () => {
    if (!job || !onApprove) return;
    try {
      const success = await onApprove(job);
      if (success) {
        message.success("Job approved successfully. Closing in 5 seconds...");
        setTimeout(() => {
          onClose();
        }, 5000);
      } else {
        message.error("Failed to approve job");
      }
    } catch (error) {
      message.error("An error occurred while approving the job");
    }
  };

  return (
    <Drawer
      title="Job Details"
      // use a fixed width to encourage vertical expansion instead of horizontal
      width={720}
      onClose={onClose}
      open={open}
      bodyStyle={{ overflowX: 'hidden' }}
      footer={
        isPending && onApprove ? (
          <div style={{ textAlign: "right" }}>
            <Button type="primary" onClick={handleApproveClick}>
              Approve
            </Button>
          </div>
        ) : undefined
      }
    >
      {job ? (
        <Descriptions column={1} bordered style={{ tableLayout: 'fixed', width: '100%' }}>
          <Descriptions.Item label={<div style={{ minWidth: 160, whiteSpace: 'nowrap' }}>Title</div>}>
            <div style={{ whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{job.title}</div>
          </Descriptions.Item>
          <Descriptions.Item label={<div style={{ minWidth: 160, whiteSpace: 'nowrap' }}>Category - Specialization</div>}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              {job.categoryName ? (
                <Tag color={tagColorFor(job.categoryName)} style={{ margin: 0, whiteSpace: 'normal', display: 'inline-block', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{job.categoryName}</Tag>
              ) : (
                "-"
              )}
              <span style={{ marginLeft: 8, marginRight: 8 }}> - </span>
              {job.specializationName ? (
                <Tag
                  color={
                    job.categoryName
                      ? tagColorFor(job.categoryName)
                      : tagColorFor(job.specializationName)
                  }
                  style={{ margin: 0, whiteSpace: 'normal', display: 'inline-block', overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                >
                  {job.specializationName}
                </Tag>
              ) : (
                "-"
              )}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label={<div style={{ minWidth: 160, whiteSpace: 'nowrap' }}>Description</div>}>
            <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{job.description || '-'}</div>
          </Descriptions.Item>
          <Descriptions.Item label={<div style={{ minWidth: 160, whiteSpace: 'nowrap' }}>Requirements</div>}>
            <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{job.requirements || '-'}</div>
          </Descriptions.Item>
          <Descriptions.Item label={<div style={{ minWidth: 160, whiteSpace: 'nowrap' }}>Criteria</div>}>
            {Array.isArray((job as any).criteria) && (job as any).criteria.length > 0 ? (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(job as any).criteria.map((c: any) => (
                  <Tag key={c.criteriaId} color={tagColorFor(c.name)} style={{ margin: 0, whiteSpace: 'normal', display: 'inline-block', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                    {`${c.name} (${c.weight})`}
                  </Tag>
                ))}
              </div>
            ) : (
              <span>-</span>
            )}
          </Descriptions.Item>
          <Descriptions.Item label={<div style={{ minWidth: 160, whiteSpace: 'nowrap' }}>Employment Types</div>}>
            {Array.isArray(job.employmentTypes) && job.employmentTypes.length > 0 ? (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {job.employmentTypes.map((e: any, i: number) => (
                  <Tag key={`${e}-${i}`} color={tagColorFor(String(e))} style={{ margin: 0, whiteSpace: 'normal', display: 'inline-block', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                    {e}
                  </Tag>
                ))}
              </div>
            ) : (
              <span>-</span>
            )}
          </Descriptions.Item>
          <Descriptions.Item label={<div style={{ minWidth: 160, whiteSpace: 'nowrap' }}>Skills</div>}>
            {Array.isArray(job.skills) && job.skills.length > 0 ? (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {job.skills.map((s: any, i: number) => (
                  <Tag key={`${s}-${i}`} color={tagColorFor(String(s))} style={{ margin: 0, whiteSpace: 'normal', display: 'inline-block', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                    {s}
                  </Tag>
                ))}
              </div>
            ) : (
              <span>-</span>
            )}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <div>No job selected</div>
      )}
    </Drawer>
  );
};

export default JobViewDrawer;
