import { Card, Spin, Descriptions, Typography, Table, Button, message, Space, Divider } from "antd";
import { MailOutlined, PhoneOutlined, FileTextOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import candidateService from "../../../../services/candidateService";
import CandidateApplicationsDrawer from './CandidateApplicationsDrawer';

type Resume = any;
const { Text } = Typography;

export default function CandidateDetail() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();

  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(false);
  const [appsModalOpen, setAppsModalOpen] = useState(false);
  const [appsLoading, setAppsLoading] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [currentResumeId, setCurrentResumeId] = useState<number | null>(null);
  const [currentResumeName, setCurrentResumeName] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!candidateId) {
        setResume(null);
        return;
      }

      setLoading(true);
      try {
        const resp = await candidateService.getCandidateById(Number(candidateId));
        // Expected API shape: { status, message, data: { candidate, resumes } }

        if (String(resp?.status || "").toLowerCase() === "success") {
          const apiData = resp.data ?? null;
          if (!apiData) {
            if (mounted) setResume(null);
            return;
          }

          const candidate = apiData.candidate ?? null;
          const resumes: any[] = Array.isArray(apiData.resumes) ? apiData.resumes : [];

          const normalizeResumeItem = (r: any) => {
            if (!r) return { resumeId: null, fileUrl: null, fileName: 'Resume', createdAt: null, status: null, isLatest: false };
            if (typeof r === 'string') {
              const url = r;
              return {
                resumeId: null,
                fileUrl: url,
                fileName: url.split('/').pop() || url,
                createdAt: null,
                status: null,
                isLatest: false,
                jobTitle: null,
              };
            }
            const fileUrl = r.fileUrl ?? r.file_url ?? null;
            return {
              resumeId: r.resumeId ?? r.id ?? null,
              fileUrl,
              fileName: r.fileName ?? (fileUrl ? String(fileUrl).split('/').pop() : null) ?? 'Resume',
              createdAt: r.createdAt ?? r.created_at ?? null,
              status: r.status ?? null,
              isLatest: Boolean(r.isLatest),
              jobTitle: r.jobTitle ?? r.title ?? null,
            };
          };

          const resumesNormalized: any[] = resumes.map(normalizeResumeItem);
          const latest = resumesNormalized.find((r: any) => r.isLatest) || resumesNormalized[0] || null;

          const mapped = {
            candidateName:
              candidate?.fullName ??
              candidate?.candidateName ??
              candidate?.name ??
              null,
            email: candidate?.email ?? null,
            phone: candidate?.phoneNumber ?? candidate?.phone ?? null,
            notes: candidate?.notes ?? null,
            jobTitle: latest?.jobTitle ?? null,
            createdAt: latest?.createdAt ?? candidate?.createdAt ?? null,
            resumes: resumesNormalized,
          };

          if (mounted) setResume(mapped);
        } else {
          if (mounted) setResume(null);
        }
      } catch (err) {
        console.error("Failed to load candidate detail:", err);
        if (mounted) setResume(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [candidateId]);

  const handleViewApplications = async (resumeId: number | null, resumeName?: string | null) => {
    if (!resumeId) return;
    setCurrentResumeId(resumeId);
    setCurrentResumeName(resumeName ?? null);
    setAppsLoading(true);
    try {
      const resp = await candidateService.getApplicationsByResume(resumeId);
      if (String(resp?.status || '').toLowerCase() === 'success') {
        // API returns data as an array in this endpoint
        const data = resp.data ?? null;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data?.applications)
              ? data.applications
              : [];
        setApplications(list);
        setAppsModalOpen(true);
      } else {
        message.error(resp?.message || 'Unable to load applications');
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
      message.error('Failed to load applications');
    } finally {
      setAppsLoading(false);
    }
  };

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            aria-label="Back"
          />
          <span>{resume?.candidateName || "Candidate Detail"}</span>
        </div>
      }
      style={{
        maxWidth: 1200,
        margin: "12px auto",
        borderRadius: 12,
        height: 'calc(100% - 25px)',
      }}
    >
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 32 }}><Spin /></div>
      ) : resume ? (
        <div style={{ padding: '4px' }}>
          {/* Section 1: Thông tin cá nhân dùng Descriptions */}
          <Descriptions 
            bordered 
            size="small"
            column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
          >
            <Descriptions.Item label={<Space><MailOutlined /> Email</Space>}>
              {resume.email || "-"}
            </Descriptions.Item>
            <Descriptions.Item label={<Space><PhoneOutlined /> Phone</Space>}>
              {resume.phone || "-"}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          {/* Section 2: Danh sách Resume */}
          <div style={{ marginBottom: 8 }}>
            <Text strong style={{ fontSize: 16 }}>
              <FileTextOutlined style={{ marginRight: 8 }} />
              Resume Files
            </Text>
          </div>

          <Table
            dataSource={(resume.resumes as any[]).map((r: any, idx: number) => ({ ...r, key: r.resumeId || idx, no: idx + 1 }))}
            pagination={false}
            size="middle"
            className="custom-table"
            columns={[
              { 
                title: 'No', 
                dataIndex: 'no', 
                key: 'no', 
                width: "10%", 
                align: 'center' 
              },
              {
                title: 'Resume Name',
                dataIndex: 'fileName',
                key: 'fileName',
                width: '50%',
                align: 'left' as const,
                render: (text) => <Text ellipsis={{ tooltip: text }}>{text}</Text>
              },
              {
                title: 'View CV',
                dataIndex: 'viewCv',
                key: 'viewCv',
                width: '10%',
                align: 'center' as const,
                render: (_: any, record: any) => (
                  <Button
                    icon={<FileTextOutlined style={{ color: 'var(--color-primary-light)' }} />}
                    href={(record as any).fileUrl}
                    target="_blank"
                    type="link"
                    aria-label="View CV"
                  />
                )
              },
              {
                title: 'Action',
                align: 'center' as const,
                key: 'actions',
                width: '20%',
                render: (_: any, record: any) => (
                  <Space size="middle">
                    <Button
                      className="company-btn--filled"
                      size="small"
                      onClick={() => handleViewApplications((record as any).resumeId, (record as any).fileName)}
                      disabled={!((record as any).resumeId)}
                    >
                      View Applications
                    </Button>
                  </Space>
                )
              },
            ]}
          />
        </div>
      ) : (
        <Text type="secondary">Candidate not found.</Text>
      )}

      <CandidateApplicationsDrawer
        open={appsModalOpen}
        onClose={() => setAppsModalOpen(false)}
        resumeId={currentResumeId}
        resumeName={currentResumeName}
        applications={applications}
        loading={appsLoading}
      />
    </Card>
  );
}