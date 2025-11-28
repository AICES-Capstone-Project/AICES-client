import React, { useEffect, useState } from "react";
import { Card, Table, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
// Upload icons removed while upload is disabled
import { useNavigate } from "react-router-dom";
import { jobService } from "../../../services/jobService";
import { toastError } from "../../../components/UI/Toast";
// postForm import removed while upload is disabled

interface JobRow {
  jobId: number;
  title: string;
  jobStatus: string;
  createdAt?: string;
}

const AIScreening: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  // Upload UI temporarily disabled
  // const [uploadDrawerOpen, setUploadDrawerOpen] = useState(false);
  // Upload state removed while upload is disabled
  // const [activeJob, setActiveJob] = useState<JobRow | null>(null);
  // const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const load = async () => {
      setLoadingJobs(true);
      try {
        const jobsResp = await jobService.getCompanyJobs(1, 50);
        if (jobsResp.status === "Success" && jobsResp.data?.jobs) {
          const mapped = jobsResp.data.jobs.map((j) => ({
            jobId: j.jobId,
            title: j.title || "(No title)",
            jobStatus: j.jobStatus || "Unknown",
            createdAt: j.createdAt,
          }));
          setJobs(mapped);
        }
      } catch (e) {
        toastError("Failed to load jobs");
      } finally {
        setLoadingJobs(false);
      }
    };
    load();
  }, []);

  // Upload functions commented out while upload is disabled
  // const openUploadDrawer = (job: JobRow) => {
  //   setActiveJob(job);
  //   setUploadDrawerOpen(true);
  // };

  // const closeUploadDrawer = () => {
  //   setUploadDrawerOpen(false);
  //   setActiveJob(null);
  // };

  // const handleUpload = async (file: File) => {
  //   if (!activeJob) return false;
  //   setUploading(true);
  //   try {
  //     const formData = new FormData();
  //     formData.append("JobId", activeJob.jobId.toString());
  //     formData.append("File", file);
  //     const response = await postForm("resume/upload", formData);
  //     if (response.status === "Success") {
  //       message.success(`Uploaded ${file.name} successfully!`);
  //     } else {
  //       message.error(response.message || "Upload failed");
  //     }
  //   } catch (e: any) {
  //     message.error(e?.message || "Upload failed");
  //   } finally {
  //     setUploading(false);
  //   }
  //   return false;
  // };

  const columns: ColumnsType<JobRow> = [
    {
      title: "No",
      width: 80,
      align: "center" as const,
      render: (_: any, __: any, index: number) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Title",
      dataIndex: "title",
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 250,
      align: "center" as const,
      render: (_, row: JobRow) => (
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          <Button className="company-btn--filled" onClick={() => navigate(`/company/ai-screening/${row.jobId}/resumes`)}>
            List Resumes
          </Button>
          {/* Upload disabled: to re-enable, uncomment openUploadDrawer + Upload Drawer */}
          {/* <Button className="company-btn" onClick={() => openUploadDrawer(row)}>
            Upload CV
          </Button> */}
        </div>
      ),
    },
  ];

  return (
    <>
      <Card
        title={
          <div className="flex justify-between items-center w-full">
            <span className="font-semibold">AI CV Screening</span>
          </div>
        }
        style={{
          maxWidth: 1200,
          margin: "12px auto",
          borderRadius: 12,
        }}
      >
        <Table<JobRow>
          rowKey="jobId"
          loading={loadingJobs}
          dataSource={jobs}
          columns={columns}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: jobs.length,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} jobs`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
        />
      </Card>

      {/* Upload Drawer disabled. To restore, uncomment related state and handlers above. */}
      {/*
      <Drawer
      title={activeJob ? `Upload CV - ${activeJob.title}` : "Upload CV"}
      width={500}
      onClose={closeUploadDrawer}
      open={uploadDrawerOpen}
      destroyOnClose
    >
      {activeJob && (
        <Upload.Dragger
          multiple
          beforeUpload={handleUpload}
          accept=".pdf,.doc,.docx"
          disabled={uploading}
          showUploadList={false}
          style={{ padding: 12 }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click hoặc kéo thả file CV vào đây</p>
          <p className="ant-upload-hint">Hỗ trợ PDF / DOC / DOCX. Hệ thống AI sẽ phân tích và đánh giá CV tự động.</p>
        </Upload.Dragger>
      )}
      </Drawer>
      */}
    </>
  );
};

export default AIScreening;