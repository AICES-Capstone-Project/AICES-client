import React, { useState } from 'react';
import { Drawer, Spin, List, Button, Table, Tag, Typography } from 'antd';
import { ClockCircleOutlined, RightOutlined, LeftOutlined, CheckCircleOutlined, CrownOutlined } from '@ant-design/icons';
import compareResumeService from '../../../services/compareResumeService';

const { Title } = Typography;

interface Props {
  open: boolean;
  onClose: () => void;
  loading?: boolean;
  list?: any[];
}

const HistoryDrawer: React.FC<Props> = ({ open, onClose, loading, list = [] }) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const drawerTitleText = selectedItem
    ? (selectedItem.name ??
      selectedItem.title ??
      selectedItem.comparisonName ??
      `#${selectedItem.id ?? selectedItem.comparisonId}`)
    : 'Comparison History';


  const drawerTitle = selectedItem ? (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <Button
        className="company-btn"
        icon={<LeftOutlined />}
        onClick={() => setSelectedItem(null)}
        aria-label="Back"
      />
      <div style={{ fontWeight: 700 }}>{drawerTitleText}</div>
    </div>
  ) : drawerTitleText;


  const handleClick = async (item: any) => {
    const id = item.id ?? item.comparisonId;
    try {
      const resp = await compareResumeService.getComparisonById(Number(id));
      if (resp && (String(resp?.status || '').toLowerCase() === 'success' || resp.data)) {
        const data = resp.data ?? resp;
        setSelectedItem(data);
      } else {
        setSelectedItem(item);
      }
    } catch (err) {
      console.error('Failed to fetch comparison detail', err);
      setSelectedItem(item);
    }
  };

  const formatTimestamp = (t: any) => {
    if (!t) return '';
    try {
      return new Date(t).toLocaleString();
    } catch {
      return String(t);
    }
  };

  const renderComparisonTable = (rawData: any) => {
    if (!rawData) return <div style={{ padding: 20, textAlign: 'center' }}>No data</div>;

    const result =
      rawData.resultData ??
      rawData.resultJson ??
      rawData.data?.resultData ??
      rawData.data?.resultJson ??
      rawData;

    const candidates = result?.candidates || [];

    if (!Array.isArray(candidates) || candidates.length === 0) {
      return (
        <pre style={{ whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      );
    }

    const EXCLUDED_KEYS = ['candidateName', 'recommendation'];

    const criteriaKeys: string[] = Array.from(
      new Set(
        candidates.flatMap((c: any) =>
          Object.keys(c.analysis || {}).filter((k) => !EXCLUDED_KEYS.includes(k))
        )
      )
    );

    const PRIORITY_KEYS = ['jobFit', 'overallSummary'];
    criteriaKeys.sort((a, b) => {
      if (PRIORITY_KEYS.includes(a)) return -1;
      if (PRIORITY_KEYS.includes(b)) return 1;
      return a.localeCompare(b);
    });

    const humanize = (key: string) =>
      key
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .replace(/^./, (c) => c.toUpperCase());

    const columns = [
      {
        title: 'Criteria',
        dataIndex: 'criteria',
        key: 'criteria',
        width: '10%',
        align: 'center' as const,
        render: (v: any) => <div style={{ textAlign: 'center' }}><strong>{v}</strong></div>,
      },
      ...candidates.map((c: any, index: number) => {
        const analysis = c.analysis || {};
        const name = analysis.candidateName || `Candidate ${index + 1}`;
        const rank = analysis?.recommendation?.rank;
        return {
          title: (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 48, textAlign: 'center' }}>
              {rank === 1 && <CrownOutlined style={{ color: '#fa1414', fontSize: 18 }} />}
              <span style={{ fontWeight: 600 }}>{name}</span>
              {rank && <Tag color={rank === 1 ? 'green' : 'blue'} style={{ marginLeft: 8 }}>Rank {rank}</Tag>}
            </div>
          ),
          dataIndex: `c_${index}`,
          key: `c_${index}`,
          align: 'center' as const,
          render: (v: any) => (
            <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', textAlign: 'center' }}>{v ?? '—'}</div>
          ),
        };
      }),
    ];

    const hasReason = candidates.some((c: any) => !!c.analysis?.recommendation?.reason);

    const dataSource: any[] = [];

    if (hasReason) {
      const reasonRow: any = { key: '__reason', criteria: 'Analysis' };
      candidates.forEach((c: any, index: number) => {
        const reason = c.analysis?.recommendation?.reason;
        reasonRow[`c_${index}`] = reason ? (
          <div style={{ background: 'linear-gradient(129deg, #4d7c0f 0%, #065f46 50%, #052e16 100%)', color: '#ffffff', padding: '8px', borderRadius: 8, lineHeight: 1.6 }}>
            <div style={{ fontSize: 13, textAlign: 'center' }}>{reason}</div>
          </div>
        ) : '—';
      });
      dataSource.push(reasonRow);
    }

    criteriaKeys.forEach((key) => {
      const row: any = { key, criteria: humanize(key) };
      candidates.forEach((c: any, index: number) => {
        row[`c_${index}`] = c.analysis?.[key];
      });
      dataSource.push(row);
    });

    return (
      <Table bordered pagination={false} columns={columns} dataSource={dataSource} size="middle" style={{ width: '100%' }} />
    );
  };

  return (
    <Drawer title={drawerTitle} width={1200} onClose={() => { setSelectedItem(null); onClose(); }} open={open}
      extra={
        selectedItem ? (
          <div style={{ display: 'inline-flex' }}>
            <Button
              className="company-btn"
              icon={<LeftOutlined />}
              onClick={() => setSelectedItem(null)}
            >
              Back
            </Button>
          </div>
        ) : null
      }
    >
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>
      ) : selectedItem ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Header Info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa', padding: '7px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Title level={4} style={{ margin: 0 }}>Candidate Comparison Analysis</Title>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ClockCircleOutlined />
                <span>{formatTimestamp(selectedItem.createdAt ?? selectedItem.created_at ?? selectedItem.createdAtUtc)}</span>
              </div>
              <Tag color={(selectedItem.status ?? '').toString().toLowerCase() === 'completed' ? 'green' : 'default'} icon={<CheckCircleOutlined />}>
                {(selectedItem.status ?? selectedItem.state ?? 'N/A').toUpperCase()}
              </Tag>
            </div>
          </div>

          {/* Comparison Table Section */}
          <div>
            {renderComparisonTable(selectedItem)}
          </div>

        </div>
      ) : (
        <List
          dataSource={list}
          renderItem={(item: any, index: number) => {
            const id = item.id ?? item.comparisonId;
            const no = (typeof index === 'number') ? index + 1 : undefined;
            const status = (item.status ?? item.state ?? '').toString();
            const ts = formatTimestamp(item.createdAt ?? item.created_at ?? item.createdAtUtc);
            const isHovered = hoveredId === id;

            return (
              <List.Item
                key={id}
                style={{
                  padding: '18px 16px',
                  cursor: 'pointer',
                  background: isHovered ? 'rgba(0,0,0,0.03)' : 'transparent',
                  borderRadius: 8,
                  marginBottom: 12,
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #f0f0f0'
                }}
                onMouseEnter={() => setHoveredId(id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleClick(item)}
              >
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div>
                      <strong>{typeof no === 'number' ? `${no}` : `No.`} {item.comparisonName ? `. ${item.comparisonName}` : ''}</strong>
                    </div>
                    <div style={{ color: '#9aa0a6', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ClockCircleOutlined />
                      <span>{ts}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {status && (
                    <Tag color={status.toLowerCase() === 'completed' ? 'green' : 'default'}>
                      {status.toUpperCase()}
                    </Tag>
                  )}
                  <RightOutlined style={{ color: '#8c8c8c', fontSize: 16 }} />
                </div>
              </List.Item>
            );
          }}
        />
      )}
    </Drawer>
  );
};

export default HistoryDrawer;