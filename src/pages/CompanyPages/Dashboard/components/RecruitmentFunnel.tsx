import React from "react";
import { Card, Col, Button, Table, DatePicker, Space, Select, Spin } from "antd";
import {
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { DASHBOARD_COLORS } from "../constants/colors";

interface FunnelData {
  stage: string;
  value: number;
  conversionRate?: number;
}

interface RecruitmentFunnelProps {
  funnel: FunnelData[];
  funnelLoading: boolean;
  campaignsList: any[];
  filteredJobsList: any[];
  campaignIdParam: string | undefined;
  jobIdParam: string | undefined;
  dateRange: any;
  setCampaignIdParam: (value: string | undefined) => void;
  setJobIdParam: (value: string | undefined) => void;
  setDateRange: (value: any) => void;
  handleCampaignChange: (value: string | undefined) => void;
  applyFunnelParams: () => void;
  resetFunnel: () => void;
}

const cardBaseStyle: React.CSSProperties = {
  borderRadius: 8,
  transition: "box-shadow 0.18s ease, transform 0.12s ease",
};

const RecruitmentFunnel: React.FC<RecruitmentFunnelProps> = ({
  funnel,
  funnelLoading,
  campaignsList,
  filteredJobsList,
  campaignIdParam,
  jobIdParam,
  dateRange,
  handleCampaignChange,
  setJobIdParam,
  setDateRange,
  applyFunnelParams,
  resetFunnel,
}) => {
  return (
    <Col xs={24} style={{ marginBottom: 12 }}>
      <Card size="small" title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>📊 Recruitment Funnel</span>
        </div>
      } style={{ ...cardBaseStyle }}>
        <div style={{
          background: '#f5f5f5',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
            <Select
              placeholder="Select Campaign"
              value={campaignIdParam}
              onChange={handleCampaignChange}
              style={{ borderRadius: 6, width: 200 }}
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={campaignsList.length > 0 ? campaignsList : [{ value: 'no-data', label: 'No campaigns available', disabled: true }]}
            />
            <Select
              placeholder="Select Job"
              value={jobIdParam}
              onChange={(value) => setJobIdParam(value)}
              style={{ borderRadius: 6, width: 200 }}
              allowClear
              showSearch
              disabled={!campaignIdParam}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={filteredJobsList}
            />
            <DatePicker.RangePicker
              value={dateRange}
              onChange={(vals) => setDateRange(vals)}
              style={{ borderRadius: 6 }}
              placeholder={['Start date', 'End date']}
            />
            <Button
              className="company-btn--filled"
              onClick={applyFunnelParams}
              loading={funnelLoading}
              style={{ borderRadius: 6 }}
            >
              Apply
            </Button>
            <Button
              className="company-btn"
              onClick={resetFunnel}
              style={{ borderRadius: 6 }}
            >
              Reset
            </Button>
          </Space>
        </div>

        <div style={{ height: 240, background: '#fafafa', borderRadius: 8, padding: 8 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={funnel} margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1e5e9" />
              <XAxis type="number" stroke="#666" domain={[0, 100]} />
              <YAxis dataKey="stage" type="category" width={100} stroke="#666" />
              <Tooltip
                formatter={(value: any, name: any, props: any) => {
                  if (name === 'conversionRate') {
                    const count = props.payload.value;
                    return [`${Number(value).toFixed(1)}% (${count} candidates)`, 'Conversion Rate'];
                  }
                  return [value, name];
                }}
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e1e5e9',
                  borderRadius: 8,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar
                dataKey="conversionRate"
                fill="url(#colorGradient)"
                radius={[0, 4, 4, 0]}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="5%" stopColor={DASHBOARD_COLORS.PRIMARY_MEDIUM} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={DASHBOARD_COLORS.PRIMARY} stopOpacity={1} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {!funnelLoading && funnel && funnel.length > 0 && (
          <div style={{ marginTop: 16, background: '#f8f9fa', borderRadius: 8, padding: 12 }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#666', fontSize: 14 }}>📈 Conversion Rates</h4>
            <Table
              size="small"
              pagination={false}
              style={{ background: 'transparent' }}
              dataSource={funnel.map((f, idx) => ({
                key: idx,
                stage: f.stage,
                count: f.value,
                conversionRate: f.conversionRate
              }))}
              columns={[
                {
                  title: 'Stage',
                  dataIndex: 'stage',
                  key: 'stage',
                  render: (text: string) => <span style={{ fontWeight: 500, color: '#333' }}>{text}</span>
                },
                {
                  title: 'Count',
                  dataIndex: 'count',
                  key: 'count',
                  align: 'center' as const,
                  render: (value: number) => <span style={{ fontWeight: 600, color: DASHBOARD_COLORS.PRIMARY }}>{value}</span>
                },
                {
                  title: 'Conversion %',
                  dataIndex: 'conversionRate',
                  key: 'conversionRate',
                  align: 'center' as const,
                  render: (v: any) => {
                    if (v == null) return <span style={{ color: '#999' }}>-</span>;
                    const rate = Number(v).toFixed(1);
                    const color = Number(v) >= 50 ? '#16a34a' : Number(v) >= 20 ? '#22c55e' : '#dc2626';
                    return <span style={{ fontWeight: 600, color }}>{rate}%</span>;
                  }
                }
              ]}
            />
          </div>
        )}
        {funnelLoading && (
          <div style={{
            textAlign: 'center',
            padding: 20,
            background: '#f8f9fa',
            borderRadius: 8,
            marginTop: 16
          }}>
            <Spin size="large" />
            <div style={{ marginTop: 8, color: '#666' }}>Loading funnel data...</div>
          </div>
        )}
      </Card>
    </Col>
  );
};

export default RecruitmentFunnel;