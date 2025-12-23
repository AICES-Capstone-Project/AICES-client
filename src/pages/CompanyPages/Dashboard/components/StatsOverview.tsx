import React from "react";
import { Card, Col, Table } from "antd";
import { DASHBOARD_COLORS } from "../constants/colors";

interface StatsOverviewProps {
  statsOverview: any;
}

const cardBaseStyle: React.CSSProperties = {
  borderRadius: 8,
  transition: "box-shadow 0.18s ease, transform 0.12s ease",
};

const StatsOverview: React.FC<StatsOverviewProps> = ({ statsOverview }) => {
  if (!statsOverview) return null;

  return (
    <>
      <Col xs={24} lg={12} style={{ paddingRight: 6 }}>
        <Card size="small" title="🏆 Top Jobs in Campaigns" style={{ ...cardBaseStyle }}>
          <Table
            pagination={false}
            dataSource={statsOverview.top5JobsInCampaigns?.slice(0, 5).map((job: any, idx: number) => ({
              key: job.jobId ?? idx,
              title: job.title || '-',
              campaignCount: job.campaignCount || 0
            })) || []}
            columns={[
              { title: 'Job Title', dataIndex: 'title', key: 'title', ellipsis: true },
              {
                title: 'Campaigns',
                dataIndex: 'campaignCount',
                key: 'campaignCount',
                align: 'center' as const,
                render: (value: number) => <span style={{ fontWeight: 600, color: DASHBOARD_COLORS.PRIMARY }}>{value}</span>
              },
            ]}
            size="small"
          />
        </Card>
      </Col>

      <Col xs={24} lg={12} style={{ paddingLeft: 6 }}>
        <Card size="small" title="📊 Top Campaigns" style={{ ...cardBaseStyle }}>
          <Table
            pagination={false}
            dataSource={statsOverview.top5CampaignsWithMostJobs?.slice(0, 5).map((campaign: any, idx: number) => ({
              key: campaign.campaignId ?? idx,
              title: campaign.title || '-',
              jobCount: campaign.jobCount || 0
            })) || []}
            columns={[
              { title: 'Campaign Title', dataIndex: 'title', key: 'title', ellipsis: true },
              {
                title: 'Jobs',
                dataIndex: 'jobCount',
                key: 'jobCount',
                align: 'center' as const,
                render: (value: number) => <span style={{ fontWeight: 600, color: DASHBOARD_COLORS.PRIMARY_MEDIUM }}>{value}</span>
              },
            ]}
            size="small"
          />
        </Card>
      </Col>

      <Col xs={24} lg={12} style={{ paddingRight: 6 }}>
        <Card size="small" title="🎯 Highest Score CVs" style={{ ...cardBaseStyle }}>
          <Table
            pagination={false}
            dataSource={statsOverview.top5HighestScoreCVs?.slice(0, 5).map((cv: any, idx: number) => ({
              key: cv.applicationId ?? idx,
              candidateName: cv.candidateName || '-',
              jobTitle: cv.jobTitle || '-',
              score: cv.score || 0
            })) || []}
            columns={[
              { title: 'Candidate', dataIndex: 'candidateName', key: 'candidateName', width: '35%', ellipsis: true },
              { title: 'Job', dataIndex: 'jobTitle', key: 'jobTitle', width: '45%', ellipsis: true },
              {
                title: 'Score',
                dataIndex: 'score',
                key: 'score',
                width: '20%',
                align: 'center' as const,
                render: (value: number) => {
                  const color = value >= 90 ? DASHBOARD_COLORS.PRIMARY_DARK : value >= 80 ? DASHBOARD_COLORS.PRIMARY : value >= 70 ? DASHBOARD_COLORS.PRIMARY_LIGHT : DASHBOARD_COLORS.ERROR;
                  return <span style={{ fontWeight: 600, color }}>{Number(value).toFixed(1)}</span>;
                }
              },
            ]}
            size="small"
          />
        </Card>
      </Col>

      <Col xs={24} lg={12} style={{ paddingLeft: 6 }}>
        <Card size="small" title="⭐ Active Candidates" style={{ ...cardBaseStyle }}>
          <div style={{
            background: '#f8f9fa',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '12px',
            textAlign: 'center'
          }}>
            {/* <div style={{ fontSize: 32, fontWeight: 'bold', color: BRAND_GREEN, marginBottom: 8 }}>
              {statsOverview.onTimeCampaignsThisMonth || 0}
            </div>
            <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>On-Time Campaigns This Month</div>
            <div style={{ fontSize: 20, fontWeight: 'bold', color: DASHBOARD_COLORS.PRIMARY_MEDIUM }}>
              {statsOverview.totalJobs || 0}
            </div>
            <div style={{ fontSize: 12, color: '#999' }}>Total Active Jobs</div> */}
          </div>
          <Table
            pagination={false}
            dataSource={statsOverview.top5CandidatesWithMostJobs?.slice(0, 4).map((candidate: any, idx: number) => ({
              key: candidate.candidateId ?? idx,
              name: candidate.fullName || '-',
              jobCount: candidate.jobCount || 0
            })) || []}
            columns={[
              { title: 'Candidate', dataIndex: 'name', key: 'name', ellipsis: true },
              {
                title: 'Applications',
                dataIndex: 'jobCount',
                key: 'jobCount',
                align: 'center' as const,
                render: (value: number) => <span style={{ fontWeight: 600, color: DASHBOARD_COLORS.PRIMARY }}>{value}</span>
              },
            ]}
            size="small"
          />
        </Card>
      </Col>
    </>
  );
};

export default StatsOverview;