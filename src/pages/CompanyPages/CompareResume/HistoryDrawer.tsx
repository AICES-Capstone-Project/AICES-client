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
    ? (selectedItem.name ?? selectedItem.title ?? selectedItem.comparisonName ?? `#${selectedItem.id ?? selectedItem.comparisonId}`)
    : 'Comparison History';

  const drawerTitle = selectedItem ? (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <div style={{ fontWeight: 700 }}>{drawerTitleText}</div>
      <Button className="company-btn" icon={<LeftOutlined />} onClick={() => setSelectedItem(null)} aria-label="Back" />
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

  const renderComparisonTable = (data: any) => {
    let resultObj: any = undefined;
    if (!data) return <div style={{ padding: 20, textAlign: 'center' }}>No data.</div>;

    if (data.resultJson !== undefined) {
      resultObj = data.resultJson;
    } else if (data.resultData !== undefined) {
      resultObj = data.resultData;
    } else if (data.data && (data.data.resultJson || data.data.resultData)) {
      resultObj = data.data.resultJson ?? data.data.resultData;
    } else if (Array.isArray(data.candidates)) {
      resultObj = { candidates: data.candidates };
    } else {
      resultObj = data;
    }

    if (typeof resultObj === 'string') {
      try {
        resultObj = JSON.parse(resultObj);
      } catch (e) {
        return <pre>{resultObj}</pre>;
      }
    }

    const candidates = resultObj?.candidates || [];

    if (candidates.length === 0) {
      return <div style={{ padding: 20, textAlign: 'center' }}>No candidate data found.</div>;
    }

    // Layout: criteria column 10%, candidate columns share remaining 90%
    const candidateCount = candidates.length;
    const criteriaWidth = '10%';
    const candidateWidth = candidateCount === 2 ? '45%' : `${Math.max(20, Math.floor(90 / candidateCount))}%`;

    // helper to read analysis fields with several possible key names
    const getAnalysisValue = (analysis: any, variants: string[]) => {
      if (!analysis) return '';
      for (const k of variants) {
        if (analysis[k] !== undefined && analysis[k] !== null) return analysis[k];
      }
      return '';
    };

    const fieldDefs = [
      { key: 'jobFit', label: 'Job Fit', variants: ['jobFit', 'Job Fit', 'job_fit'] },
      { key: 'techStack', label: 'Technical Stack', variants: ['Technical Stack Match', 'Technical Stack', 'techStack', 'technical_stack'] },
      { key: 'culture', label: 'Culture & Logistics', variants: ['Culture & Logistics Fit', 'Culture & Logistics', 'culture'] },
      { key: 'softSkills', label: 'Soft Skills', variants: ['Methodology & Soft Skills', 'Soft Skills', 'softSkills'] },
      { key: 'metrics', label: 'Exp & Metrics', variants: ['Experience & Performance Metrics', 'Experience & Metrics', 'metrics'] },
      { key: 'overall', label: 'Overall Summary', variants: ['overallSummary', 'overall', 'Overall Summary'] },
    ];

    const columns = [
      {
        title: <strong>Criteria</strong>,
        dataIndex: 'criteria',
        key: 'criteria',
        width: criteriaWidth,
        render: (text: string) => <strong>{text}</strong>,
      },
      ...candidates.map((c: any, index: number) => {
        const analysis = c.analysis ?? c.analysisData ?? c;
        const candidateName = getAnalysisValue(analysis, ['candidateName', 'candidate_name']) || c.candidateName || `Candidate ${index + 1}`;
        const rank = getAnalysisValue(analysis, ['recommendation'])?.rank ?? getAnalysisValue(analysis, ['recommendation', 'rank']) ?? (analysis?.recommendation?.rank ?? 'N/A');
        const rankText = rank === undefined || rank === null ? 'N/A' : rank;

        // choose a color to highlight rank: 1=green, 2=geekblue, 3=orange, >3=red, else default
        const rankNum = Number(rankText);
        const rankColor = Number.isFinite(rankNum)
          ? (rankNum === 1 ? 'green' : rankNum === 2 ? 'geekblue' : rankNum === 3 ? 'orange' : 'red')
          : 'default';

        return {
          title: (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <strong>{candidateName}</strong>
              {rankNum === 1 && <CrownOutlined style={{ color: '#fa1414ff', fontSize: 20 }} />}
              <Tag color={rankColor}>{`Rank ${rankText}`}</Tag>
            </div>
          ),
          dataIndex: `candidate_${index}`,
          key: `candidate_${index}`,
          width: candidateWidth,
          render: (_: any, record: any) => {
            const field = record.key;
            const def = fieldDefs.find(f => f.key === field);
            const val = def ? getAnalysisValue(analysis, def.variants) : '';
            return (
              <div style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                {val}
              </div>
            );
          }
        };
      })
    ];

    const dataSource = fieldDefs.map(f => ({ key: f.key, criteria: f.label }));

    return (
      <div style={{ width: '100%', overflowX: 'hidden' }}>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          bordered
          size="middle"
          style={{ width: '100%' }}
        />
      </div>
    );
  };

  return (
    <Drawer title={drawerTitle} width={1200} onClose={() => { setSelectedItem(null); onClose(); }} open={open} destroyOnClose>
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>
      ) : selectedItem ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Header Info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa', padding: '10px', borderRadius: '8px' }}>
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