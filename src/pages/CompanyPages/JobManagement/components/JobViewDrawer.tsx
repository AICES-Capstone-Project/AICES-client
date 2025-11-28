import { Drawer, Descriptions, Tag, Button } from "antd";
import type { CompanyJob } from "../../../../services/jobService";
import { tagColorFor } from "../../../../utils/tagUtils";
import { toastError, toastSuccess } from "../../../../components/UI/Toast";

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
        toastSuccess("Job approved successfully", "Closing in 5 seconds...");
        setTimeout(() => {
          onClose();
        }, 5000);
      } else {
        toastError("Failed to approve job");
      }
    } catch (error) {
      toastError("An error occurred while approving the job");
    }
  };

  return (
    <Drawer
      title="Job Details"
      width={640}
      onClose={onClose}
      open={open}
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
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Title">{job.title}</Descriptions.Item>
          <Descriptions.Item label="Category - Specialization">
            {job.categoryName ? (
              <Tag color={tagColorFor(job.categoryName)}>{job.categoryName}</Tag>
            ) : (
              "-"
            )}
            {" - "}
            <span style={{ marginLeft: "8px" }}>
              {job.specializationName ? (
                <Tag
                  color={
                    job.categoryName
                      ? tagColorFor(job.categoryName)
                      : tagColorFor(job.specializationName)
                  }
                >
                  {job.specializationName}
                </Tag>
              ) : (
                "-"
              )}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Description">{job.description || "-"}</Descriptions.Item>
          <Descriptions.Item label="Requirements">{job.requirements || "-"}</Descriptions.Item>
          <Descriptions.Item label="Criteria">
            {Array.isArray((job as any).criteria) && (job as any).criteria.length > 0 ? (
              (job as any).criteria.map((c: any) => (
                <Tag key={c.criteriaId} color={tagColorFor(c.name)}>
                  {`${c.name} (${c.weight})`}
                </Tag>
              ))
            ) : (
              <span>-</span>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Employment Types">
            {Array.isArray(job.employmentTypes) && job.employmentTypes.length > 0 ? (
              job.employmentTypes.map((e: any, i: number) => (
                <Tag key={`${e}-${i}`} color={tagColorFor(String(e))}>
                  {e}
                </Tag>
              ))
            ) : (
              <span>-</span>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Skills">
            {Array.isArray(job.skills) && job.skills.length > 0 ? (
              job.skills.map((s: any, i: number) => (
                <Tag key={`${s}-${i}`} color={tagColorFor(String(s))}>
                  {s}
                </Tag>
              ))
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
