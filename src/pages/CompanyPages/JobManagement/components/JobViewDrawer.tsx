import { Drawer, Descriptions, Tag } from "antd";
import type { CompanyJob } from "../../../../services/jobService";

type Props = {
  open: boolean;
  onClose: () => void;
  job: CompanyJob | null;
};

const JobViewDrawer = ({ open, onClose, job }: Props) => {
  return (
    <Drawer title="Job Details" width={640} onClose={onClose} open={open}>
      {job ? (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Title">{job.title}</Descriptions.Item>
          <Descriptions.Item label="Category">{job.categoryName || "-"}</Descriptions.Item>
          <Descriptions.Item label="Specialization">{job.specializationName || "-"}</Descriptions.Item>
          <Descriptions.Item label="Description">{job.description || "-"}</Descriptions.Item>
          <Descriptions.Item label="Requirements">{job.requirements || "-"}</Descriptions.Item>
          <Descriptions.Item label="Employment Types">
            {Array.isArray(job.employmentTypes) && job.employmentTypes.length > 0 ? (
              job.employmentTypes.map((e: any) => <Tag key={e}>{e}</Tag>)
            ) : (
              <span>-</span>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Skills">
            {Array.isArray(job.skills) && job.skills.length > 0 ? (
              job.skills.map((s: any) => <Tag key={s}>{s}</Tag>)
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
