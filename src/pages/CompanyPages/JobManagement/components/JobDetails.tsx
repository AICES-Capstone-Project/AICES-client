import React from "react";
import { Descriptions, Tag } from "antd";
import type { CompanyJob } from "../../../../services/jobService";

interface Props {
  job: CompanyJob | null;
}

const JobDetails: React.FC<Props> = ({ job }) => {
  if (!job) return <div>No job selected</div>;

  return (
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
      <Descriptions.Item label="Criteria">
        {Array.isArray(job.criteria) && job.criteria.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {job.criteria.map((c: any, idx: number) => (
              <div key={c?.criteriaId || idx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Tag color="blue">{c?.name || "-"}</Tag>
                <span style={{ color: "rgba(0,0,0,0.65)" }}>Weight: {typeof c?.weight !== 'undefined' ? c.weight : '-'}</span>
              </div>
            ))}
          </div>
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
  );
};

export default JobDetails;
