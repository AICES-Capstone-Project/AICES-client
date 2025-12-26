import { Table, Space, Tooltip, Button, Tag, Modal, Input } from "antd";
import { useEffect, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { CompanyJob } from "../../../../services/jobService";
import { useAppSelector } from "../../../../hooks/redux";
import { ROLES } from "../../../../services/config";

import { tagColorFor } from "../../../../utils/tagUtils";

type Props = {
  jobs: CompanyJob[];
  loading: boolean;
  onView: (job: CompanyJob) => void;
  onEdit: (job: CompanyJob) => void;
  onDelete: (job: CompanyJob) => void;
};

const JobTable = ({ jobs, loading, onView, onEdit, onDelete }: Props) => {
  // Table height
  const [tableHeight, setTableHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const calculate = () => {
      const reserved = 220; // px
      const h = window.innerHeight - reserved;
      setTableHeight(h > 300 ? h : 300);
    };

    calculate();
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, []);

  // Role checker
  const { user } = useAppSelector((s) => s.auth);
  const isRecruiter =
    (user?.roleName || "").toLowerCase() ===
    (ROLES.Hr_Recruiter || "").toLowerCase();

  // Modal delete states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [selectedJob, setSelectedJob] = useState<CompanyJob | null>(null);

  const handleDeleteSelected = async () => {
    if (!selectedJob) return;

    setDeleting(true);
    await onDelete(selectedJob);
    setDeleting(false);
    setDeleteModalOpen(false);
    setConfirmInput("");
  };

  // Table columns
  const columns: ColumnsType<CompanyJob> = [
    {
      title: "No",
      key: "no",
      width: "5%",
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "40%",
      align: "center",
      ellipsis: { showTitle: false },
      render: (title) => (
        <Tooltip title={title || "-"}>
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title || "-"}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
      width: "15%",
      align: "center",
      render: (cat) => (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Tooltip title={cat || "-"}>
            <Tag
              color={tagColorFor(cat)}
              style={{
                display: "inline-block",
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                verticalAlign: "middle",
              }}
            >
              {cat || "-"}
            </Tag>
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Specialization",
      dataIndex: "specializationName",
      key: "specializationName",
      width: "15%",
      align: "center",
      render: (spec, record) => {
        const category = (record as CompanyJob).categoryName;
        const color = category ? tagColorFor(category) : tagColorFor(spec);
        return (
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <Tooltip title={spec || "-"}>
              <Tag
                color={color}
                style={{
                  display: "inline-block",
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  verticalAlign: "middle",
                }}
              >
                {spec || "-"}
              </Tag>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "Posted by",
      dataIndex: "fullName",
      key: "fullName",
      width: "15%",
      align: "center",
      render: (fullName) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {fullName || "-"}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "10%",
      fixed: "right",
      align: "center",
      render: (_, record) => {
        const isInCampaign = record.isInCampaign === true;

        return (
          <Space size="small">
            {/* VIEW – luôn được phép */}
            <Tooltip title="View Details">
              <Button
                type="text"
                icon={<EyeOutlined />}
                size="small"
                onClick={() => onView(record)}
              />
            </Tooltip>

            {/* MANAGER – Edit/Delete */}
            {!isRecruiter && (
              <>
                <Tooltip
                  title={
                    isInCampaign
                      ? "Job is in campaign, cannot edit"
                      : "Edit Job"
                  }
                >
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    size="small"
                    disabled={isInCampaign}
                    onClick={() => {
                      if (isInCampaign) return;
                      onEdit(record);
                    }}
                  />
                </Tooltip>

                <Tooltip
                  title={
                    isInCampaign
                      ? "Job is in campaign, cannot delete"
                      : "Remove Job"
                  }
                >
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    size="small"
                    danger
                    disabled={isInCampaign}
                    onClick={() => {
                      if (isInCampaign) return;
                      setSelectedJob(record);
                      setJobTitle(record.title);
                      setDeleteModalOpen(true);
                    }}
                  />
                </Tooltip>
              </>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      <Table<CompanyJob>
        columns={columns}
        dataSource={jobs}
        loading={loading}
        rowKey="jobId"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          total: jobs.length,
          showTotal: (total) => `Total ${total} jobs`,
        }}
        style={{ width: "100%" }}
        tableLayout="fixed"
        className="job-table"
        scroll={{ y: tableHeight }}
        rowClassName={(_, index) =>
          index % 2 === 0 ? "table-row-light" : "table-row-dark"
        }
      />

      <Modal
        open={deleteModalOpen}
        onCancel={() => {
          setDeleteModalOpen(false);
          setConfirmInput("");
        }}
        footer={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Button
              className="company-btn"
              onClick={() => {
                setDeleteModalOpen(false);
                setConfirmInput("");
              }}
              disabled={deleting}
            >
              Cancel
            </Button>

            <Button
              className="company-btn--danger"
              danger
              onClick={handleDeleteSelected}
              disabled={confirmInput !== (jobTitle || "")}
              loading={deleting}
            >
              Delete
            </Button>
          </div>
        }
      >
        <div>
          <p style={{ textAlign: "center", fontSize: 16, marginTop: 8 }}>
            Deleting this job posting is <strong>irreversible</strong>.
            <br />
            Please type the exact job title <strong>{jobTitle || "(job title)"}</strong> to confirm deletion.
          </p>

          <Input
            style={{ marginTop: 16, width: "100%" }}
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            placeholder="Type job title here"
          />
        </div>
      </Modal>

    </div>
  );
};

export default JobTable;
