import React from "react";
import { Card, Col, Select, Spin } from "antd";
import {
  ResponsiveContainer,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { DASHBOARD_COLORS } from "../constants/colors";

interface UsageHistoryProps {
  usageHistory: any;
  usageLoading: boolean;
  usageRange: string;
  handleUsageRangeChange: (range: string) => void;
}

const cardBaseStyle: React.CSSProperties = {
  borderRadius: 8,
  transition: "box-shadow 0.18s ease, transform 0.12s ease",
};

const UsageHistory: React.FC<UsageHistoryProps> = ({
  usageHistory,
  usageLoading,
  usageRange,
  handleUsageRangeChange,
}) => {
  return (
    <Col xs={24} style={{ marginBottom: 12 }}>
      <Card size="small" title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>📊 Subscription Usage History</span>
          <Select
            className="company-select"
            value={usageRange}
            onChange={handleUsageRangeChange}
            style={{ width: 120 }}
            size="small"
            options={[
              { label: 'Hour', value: 'hour' },
              { label: '1 Day', value: '1d' },
              { label: '7 Days', value: '7d' },
              { label: '28 Days', value: '28d' },
              { label: '90 Days', value: '90d' },
              { label: 'Month', value: 'month' },
              { label: 'Year', value: 'year' },
            ]}
          />
        </div>
      } style={{ ...cardBaseStyle }}>
        {usageLoading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin size="large" />
            <div style={{ marginTop: 8, color: '#666' }}>Loading usage data...</div>
          </div>
        ) : usageHistory && (usageHistory.labels?.length > 0 || usageHistory.resumeUploads?.length > 0) ? (
          <div>
            <div style={{
              background: '#f8f9fa',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
              gap: 12
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: DASHBOARD_COLORS.PRIMARY }}>
                  {usageHistory.resumeUploads?.reduce((a: number, b: number) => a + b, 0) || 0}
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>Resume Uploads</div>
                <div style={{ fontSize: 10, color: '#999' }}>Limit: {usageHistory.resumeLimit || 0}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: DASHBOARD_COLORS.PRIMARY_LIGHT }}>
                  {usageHistory.aiComparisons?.reduce((a: number, b: number) => a + b, 0) || 0}
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>AI Comparisons</div>
                <div style={{ fontSize: 10, color: '#999' }}>Limit: {usageHistory.aiComparisonLimit || 0}</div>
              </div>
            </div>

            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usageHistory.labels?.map((label: string, index: number) => ({
                  date: label,
                  resumeUploads: usageHistory.resumeUploads?.[index] || 0,
                  aiComparisons: usageHistory.aiComparisons?.[index] || 0
                })) || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e1e5e9" />
                  <XAxis
                    dataKey="date"
                    stroke="#666"
                    tick={{ fontSize: 11 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis stroke="#666" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e1e5e9',
                      borderRadius: 8,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="resumeUploads"
                    stroke={DASHBOARD_COLORS.PRIMARY}
                    strokeWidth={2}
                    name="Resume Uploads"
                    dot={{ fill: DASHBOARD_COLORS.PRIMARY, strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="aiComparisons"
                    stroke={DASHBOARD_COLORS.PRIMARY_LIGHT}
                    strokeWidth={2}
                    name="AI Comparisons"
                    dot={{ fill: "#4ade80", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
            No usage data available for the selected range
          </div>
        )}
      </Card>
    </Col>
  );
};

export default UsageHistory;