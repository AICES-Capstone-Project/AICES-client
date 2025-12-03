import React, { useEffect, useState } from "react";
// 1. Thêm Dropdown, MenuProps, message vào import
import { Card, Table, Button, Input, Dropdown, message } from "antd";
import type { MenuProps } from "antd"; 
// 2. Thêm các Icon cần thiết cho Export
import { 
  SearchOutlined, 
  MoreOutlined, 
  FileExcelOutlined, 
  FilePdfOutlined 
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { jobService } from "../../../services/jobService";
import { toastError } from "../../../components/UI/Toast";

interface JobRow {
  jobId: number;
  title: string;
  jobStatus: string;
  createdAt?: string;
}

const AIScreening: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobRow[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 3. Hàm xử lý Export (Placeholder)
  const handleExport = (jobId: number, type: 'excel' | 'pdf') => {
    // TODO: Gọi API backend thực tế ở đây
    // Ví dụ: window.open(`${API_BASE_URL}/jobs/${jobId}/export?type=${type}`, '_blank');
    
    message.loading(`Đang xuất báo cáo ${type.toUpperCase()}...`);
    setTimeout(() => {
      message.success(`Đã tải xuống báo cáo cho Job #${jobId}`);
    }, 1000);
  };

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
          setFilteredJobs(mapped);
        }
      } catch (e) {
        toastError("Failed to load jobs");
      } finally {
        setLoadingJobs(false);
      }
    };
    load();
  }, []);

  const [tableHeight, setTableHeight] = useState<number | undefined>(undefined);
  useEffect(() => {
    const calculate = () => {
      const reserved = 220;
      const h = window.innerHeight - reserved;
      setTableHeight(h > 300 ? h : 300);
    };
    calculate();
    window.addEventListener('resize', calculate);
    return () => window.removeEventListener('resize', calculate);
  }, []);

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
      align: "center" as const,
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 250,
      align: "center" as const,
      render: (_, row: JobRow) => {
        // 4. Cấu hình Menu Export
        const items: MenuProps['items'] = [
          {
            key: 'export_excel',
            label: 'Export Excel',
            icon: <FileExcelOutlined style={{ color: '#1D6F42' }} />, // Màu xanh đặc trưng Excel
            onClick: () => handleExport(row.jobId, 'excel'),
          },
          {
            key: 'export_pdf',
            label: 'Export PDF',
            icon: <FilePdfOutlined style={{ color: '#F40F02' }} />, // Màu đỏ đặc trưng PDF
            onClick: () => handleExport(row.jobId, 'pdf'),
          },
        ];

        return (
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", alignItems: "center" }}>
            <Button 
              className="company-btn--filled" 
              onClick={() => navigate(`/company/ai-screening/${row.jobId}/resumes`)}
            >
              List Resumes
            </Button>
            
            {/* 5. Dropdown Button mới */}
            <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
              <Button className="company-btn" icon={<MoreOutlined />} title="More actions" />
            </Dropdown>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Card
        title={
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 16 }}>
              <div style={{ flex: '0 0 auto' }}>
                <span className="font-semibold">AI CV Screening</span>
              </div>

              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <Input
                  placeholder="Search by title..."
                  prefix={<SearchOutlined />}
                  allowClear
                  style={{ width: 360 }}
                  onChange={(e) => {
                    const v = e.target.value.trim().toLowerCase();
                    if (!v) return setFilteredJobs(jobs);
                    setFilteredJobs(jobs.filter(j => (j.title || '').toLowerCase().includes(v)));
                  }}
                />
              </div>

              <div style={{ flex: '0 0 auto' }} />
            </div>
          }
        style={{
          maxWidth: 1200,
          margin: "12px auto",
          borderRadius: 12,
          height: 'calc(100% - 25px)',
        }}
      >
        <Table<JobRow>
          rowKey="jobId"
          loading={loadingJobs}
          dataSource={filteredJobs}
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
          scroll={{ y: tableHeight }}
        />
      </Card>
    </>
  );
};

export default AIScreening;