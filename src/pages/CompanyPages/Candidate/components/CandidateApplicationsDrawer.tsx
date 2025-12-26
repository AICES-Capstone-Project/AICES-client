import { useState } from 'react';
import { Drawer, Spin, Table, Tag, Button, Divider, Typography, List } from 'antd';
import { EyeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import candidateService from '../../../../services/candidateService';

type Props = {
  open: boolean;
  onClose: () => void;
  resumeId: number | null;
  resumeName?: string | null;
  applications: any[];
  loading: boolean;
};

export default function CandidateApplicationsDrawer({ open, onClose, resumeId, resumeName, applications, loading }: Props) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState<any | null>(null);

  const handleViewDetail = async (applicationId: number) => {
    if (!resumeId) return;
    setDetailOpen(true);
    setDetailLoading(true);
    try {
      const resp = await candidateService.getApplicationById(resumeId, applicationId);
      console.debug('[CandidateApplicationsDrawer] getApplicationById response:', resp);
      setDetail(resp?.data ?? null);
    } catch (err) {
      setDetail(null);
    }
    setDetailLoading(false);
  };

  const parseSkills = (val: any) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') return val.split(',').map((s) => s.trim()).filter(Boolean);
    return [String(val)];
  };

  return (
    <Drawer
      title={`Applications for resume ${resumeName ?? resumeId ?? ''}`}
      extra={detailOpen ? <Button type="text" icon={<ArrowLeftOutlined />} title="Back" onClick={() => setDetailOpen(false)} /> : undefined}
      open={open}
      onClose={onClose}
      width={1000}
      placement="right"
    >
      {detailOpen ? (
        <div>
          {detailLoading ? (
            <div style={{ textAlign: 'center', padding: 20 }}><Spin /></div>
          ) : detail ? (
            <div>
              <Typography.Title level={5}>
                <span style={{ display: 'inline-block', maxWidth: 760, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {detail.jobTitle ?? detail.campaignTitle}
                </span>
              </Typography.Title>
              <Typography.Text strong>Status: </Typography.Text>
              {(() => {
                const displayStatus = (detail.status ?? detail.applicationStatus ?? '-').toString();
                const s = displayStatus.toLowerCase();
                if (['reviewed', 'approved', 'completed'].includes(s)) return <Tag color="green">{displayStatus}</Tag>;
                if (['rejected', 'notapplied', 'failed', 'invalid'].includes(s)) return <Tag color="red">{displayStatus}</Tag>;
                if (['pending', 'submitted', 'processing'].includes(s)) return <Tag color="orange">{displayStatus}</Tag>;
                return <Tag>{displayStatus}</Tag>;
              })()}
              <Divider />
              <Typography.Paragraph>
                <strong>AI Explanation</strong>
                <div style={{ whiteSpace: 'pre-wrap' }}>{detail.aiExplanation ?? detail.aiNote}</div>
              </Typography.Paragraph>
              <Divider />
              <Typography.Paragraph>
                <strong>Matched Skills</strong>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  {parseSkills(detail.matchSkills ?? detail.match_skills ?? []).map((s: any) => (
                    <Tag color="blue" key={s}>{s}</Tag>
                  ))}
                </div>
              </Typography.Paragraph>
              <Divider />
              <Typography.Paragraph>
                <strong>Missing Skills</strong>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  {parseSkills(detail.missingSkills ?? detail.missing_skills ?? []).map((s: any) => (
                    <Tag color="orange" key={s}>{s}</Tag>
                  ))}
                </div>
              </Typography.Paragraph>
              <Divider />
              <Typography.Paragraph>
                <strong>Score Details</strong>
                <List
                  size="small"
                  dataSource={detail.scoreDetails ?? detail.scores ?? []}
                  renderItem={(item: any) => (
                    <List.Item>
                      <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <div>{item.criteriaName ?? item.name}</div>
                          <div>{item.score ?? item.value}</div>
                        </div>
                        {item.aiNote ? <div style={{ color: '#666' }}>{item.aiNote}</div> : null}
                      </div>
                    </List.Item>
                  )}
                />
              </Typography.Paragraph>
            </div>
          ) : (
            <div style={{ padding: 20 }}><Typography.Text type="secondary">No detail available</Typography.Text></div>
          )}
        </div>
      ) : loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}><Spin /></div>
      ) : (
        <Table
          dataSource={applications.map((a: any, i: number) => ({
            key: a.applicationId ?? a.id ?? i,
            no: i + 1,
            applicationId: a.applicationId ?? a.id,
            jobTitle: a.jobTitle ?? a.title ?? '-',
            campaignTitle: a.campaignTitle ?? a.campaign?.title ?? '-',
            companyName: a.companyName ?? a.company?.name ?? '-',
            createdAt: a.createdAt ?? a.created_at,
            // keep applicationStatus separately; status may be missing on list endpoints
            applicationStatus: a.applicationStatus ?? a.status ?? null,
            status: a.status ?? null,
            totalScore: a.totalScore ?? a.score ?? null,
            matchSkills: a.matchSkills ?? a.match_skills ?? '',
            missingSkills: a.missingSkills ?? a.missing_skills ?? '',
          }))}
          pagination={{ pageSize: 6 }}
          size="middle"
          rowClassName={() => 'candidate-app-row'}
          className="candidate-app-table"
          columns={[
            { title: 'No', dataIndex: 'no', key: 'no', width: "5%", align: 'center' as const },
            { title: 'Job', dataIndex: 'jobTitle', key: 'jobTitle', width: "32%", align: 'center' as const, render: (v: any) => (
              <span style={{ fontWeight: 700, color: 'var(--color-primary-medium)', maxWidth: 240, display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v}</span>
            ) },
            { title: 'Campaign', dataIndex: 'campaignTitle', key: 'campaignTitle', align: 'center' as const, width: "32%", render: (v: any) => (<span style={{ maxWidth: 220, display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v}</span>) },
            { title: 'Applied At', dataIndex: 'createdAt', key: 'createdAt', width: "15%", align: 'center' as const, render: (d: any) => d ? new Date(d).toLocaleString() : '-' },
            { title: 'Score', dataIndex: 'totalScore', key: 'totalScore', width: "8%", align: 'center' as const, render: (val: any) => {
                if (val == null) return '-';
                const n = Number(val);
                let color = 'red';
                if (!isNaN(n)) {
                  if (n >= 90) color = '#16a34a';
                  else if (n >= 70) color = '#f59e0b';
                  else color = '#ef4444';
                }
                return (<div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}><strong style={{ color }}>{isNaN(n) ? String(val) : String(n)}</strong></div>);
              } },
            { title: 'Status', dataIndex: 'status', key: 'status', width: "7%", align: 'center' as const, render: (s: any, record: any) => {
                const display = (s ?? record.applicationStatus ?? '-').toString();
                const st = (display || '').toLowerCase();
                if (['reviewed', 'approved', 'completed'].includes(st)) return <Tag color="green">{display}</Tag>;
                if (['rejected', 'notapplied', 'failed', 'invalid'].includes(st)) return <Tag color="red">{display}</Tag>;
                if (['pending', 'submitted', 'processing'].includes(st)) return <Tag color="orange">{display}</Tag>;
                return <Tag>{display}</Tag>;
              } },
            { title: 'View', dataIndex: 'view', key: 'view', width: "6%", align: 'center' as const, render: (_: any, record: any) => (
              <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetail(record.applicationId)} />
            ) },
          ]}
        />
      )}
    </Drawer>
  );
}
