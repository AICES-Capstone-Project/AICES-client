import React, { useEffect, useState } from "react";
import { Card, Table, Tag, Button, Space, message, Tooltip, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useParams, useNavigate } from "react-router-dom";
import resumeService from "../../../services/resumeService";
import compareResumeService from "../../../services/compareResumeService";
import HistoryDrawer from './HistoryDrawer';
import ResumeDetailDrawer from '../AIScreening/component/ResumeDetailDrawer';
import { EyeOutlined, ArrowLeftOutlined, CrownOutlined } from "@ant-design/icons";
import { toastError } from "../../../components/UI/Toast";

interface Resume {
    resumeId: number;
    applicationId?: number;
    fullName: string;
    status: string;
    totalResumeScore: number | null;
    totalScore?: number | null;
    adjustedScore?: number | null;
    email?: string;
    phoneNumber?: string;
    fileUrl?: string;
    aiExplanation?: string;
    scoreDetails?: Array<any>;
}

const CompareResumes: React.FC = () => {
    const params = useParams<{ campaignId?: string; jobId?: string }>();
    const navigate = useNavigate();
    const campaignId = params.campaignId ? Number(params.campaignId) : undefined;
    const jobId = params.jobId ? Number(params.jobId) : undefined;

    const [loading, setLoading] = useState(false);
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [polling, setPolling] = useState(false);
    const [comparisonResult, setComparisonResult] = useState<any>(null);
    const [comparisonName, setComparisonName] = useState<string | null>(null);
    const pollingRef = React.useRef<number | null>(null);
    const [selectionEnabled, setSelectionEnabled] = useState(false);

    // history
    const [historyOpen, setHistoryOpen] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyList, setHistoryList] = useState<any[]>([]);

    useEffect(() => {
        if (!jobId) return;
        loadMatchingResumes();
    }, [jobId, campaignId]);

    const loadMatchingResumes = async () => {
        setLoading(true);
        try {
            const resp = campaignId
                ? await resumeService.getByJob(Number(campaignId), Number(jobId))
                : await resumeService.getByJob(Number(jobId));
            if (String(resp?.status || "").toLowerCase() === "success" && resp.data) {
                const raw = resp.data as any;
                let list: any[] = [];
                if (Array.isArray(raw)) list = raw;
                else if (Array.isArray(raw.data)) list = raw.data;
                else if (Array.isArray(raw.resumes)) list = raw.resumes;
                else if (Array.isArray(raw.items)) list = raw.items;

                const mapped: Resume[] = list.map((r: any) => ({
                    resumeId: r.resumeId ?? (r.applicationId ?? 0),
                    applicationId: r.applicationId ?? r.resumeId,
                    fullName: r.fullName || r.candidateName || "Unknown",
                    status: r.applicationStatus || r.status || r.stage || "Processing",
                    // Support multiple possible API field names
                    totalScore: r.totalScore ?? r.totalResumeScore ?? r.aiScore ?? null,
                    adjustedScore: r.adjustedScore ?? r.adjusted_score ?? null,
                    totalResumeScore: (r.totalScore ?? r.totalResumeScore ?? r.adjustedScore ?? r.adjusted_score ?? r.aiScore ?? null),
                    email: r.email,
                    phoneNumber: r.phone || r.phoneNumber,
                    fileUrl: r.fileUrl,
                    aiExplanation: r.aiExplanation,
                    scoreDetails: r.scoreDetails,
                }));

                // keep only resumes that have a score
                const filtered = mapped.filter((r) => r.totalResumeScore != null);
                setResumes(filtered);
            } else {
                message.error(resp?.message || "Unable to load resumes");
            }
        } catch (e) {
            console.error("Failed to load resumes:", e);
            toastError("Unable to load resumes");
        } finally {
            setLoading(false);
        }
    };

    const loadResumeDetail = async (applicationId: number) => {
        setLoadingDetail(true);
        try {
            if (!jobId && !campaignId) {
                message.error('Missing jobId to load resume details');
                setLoadingDetail(false);
                return;
            }

            let resp;
            if (typeof campaignId === 'number' && typeof jobId === 'number') {
                resp = await resumeService.getById(Number(campaignId), Number(jobId), applicationId);
            } else if (typeof jobId === 'number') {
                resp = await resumeService.getById(Number(jobId), applicationId);
            } else {
                // fallback
                resp = await resumeService.getById(Number(jobId as any), applicationId);
            }
            if (String(resp?.status || "").toLowerCase() === "success" && resp.data) {
                setSelectedResume(resp.data as unknown as Resume);
                setDrawerOpen(true);
            } else {
                message.error(resp?.message || "Unable to load resume details");
            }
        } catch (e) {
            console.error("Failed to load resume detail:", e);
            toastError("Unable to load resume details");
        } finally {
            setLoadingDetail(false);
        }
    };

    const handleCompare = async () => {
        if (!jobId) return message.error('Missing jobId');
        if (!selectedKeys.length) return message.error('Select at least one resume');
        if (selectedKeys.length > 5) return message.error('You may select up to 5 resumes only');
        setSubmitting(true);
        try {
            const applicationIds = selectedKeys.map(k => Number(k));
            const body: any = { applicationIds };
            if (!Number.isNaN(Number(jobId))) body.jobId = Number(jobId);
            if (typeof campaignId === 'number') body.campaignId = campaignId;
            const resp = await compareResumeService.compare(body);
            const ok = resp && (String(resp.status || '').toLowerCase() === 'success' || resp.data);
            // helper: try several common shapes to find comparisonName
            const extractComparisonName = (obj: any) => {
                if (!obj) return null;
                return obj.comparisonName ?? obj.comparison_name ?? obj.name ?? obj.title ?? obj.data?.comparisonName ?? obj.data?.comparison_name ?? obj.data?.name ?? obj.data?.title ?? obj.resultData?.comparisonName ?? obj.resultData?.comparison_name ?? null;
            };

            if (ok) {
                // Try to read comparisonId and comparisonName from response
                const id = resp.data?.comparisonId ?? resp.data?.id ?? resp.data?.data?.comparisonId ?? null;
                const name = extractComparisonName(resp.data ?? resp);
                setComparisonName(name ? String(name) : (id ? String(id) : null));
                if (id) {
                    setPolling(true);
                    message.success('Compare request sent. Starting comparison...');
                    // start polling every 3s
                    pollingRef.current = window.setInterval(async () => {
                        try {
                            const r = await compareResumeService.getComparisonById(Number(id));
                            const status = (r?.data?.status || r?.status || "").toString();
                            const lc = status.toLowerCase();
                            if (lc === 'completed') {
                                // done
                                window.clearInterval(pollingRef.current ?? undefined);
                                pollingRef.current = null;
                                setPolling(false);
                                // prefer server-provided comparisonName if present
                                const remoteName = extractComparisonName(r?.data ?? r);
                                if (remoteName) setComparisonName(String(remoteName));
                                const result = r.data?.resultJson ?? r.data?.result ?? r.data?.resultData ?? r.data;
                                setComparisonResult(result);
                            } else {
                                // still pending/processing, keep waiting
                                setPolling(true);
                            }
                        } catch (err) {
                            console.error('Polling error', err);
                        }
                    }, 3000);
                } else {
                    message.success('Compare request sent');
                }
            } else {
                message.error(resp?.message || 'Compare failed');
            }
        } catch (e) {
            console.error(e);
            message.error('Compare failed');
        } finally {
            setSubmitting(false);
        }
    };

    // cleanup polling on unmount
    useEffect(() => {
        return () => {
            if (pollingRef.current) {
                window.clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
        };
    }, []);

    const openHistory = async () => {
        if (!jobId) return message.error('Missing jobId');
        setHistoryOpen(true);
        setHistoryLoading(true);
        try {
            const resp = await compareResumeService.getComparisonsByJobCampaign(Number(jobId), Number(campaignId ?? 0));
            if (String(resp?.status || '').toLowerCase() === 'success' && resp.data) {
                // assume resp.data is array
                const list = Array.isArray(resp.data) ? resp.data : (resp.data.items ?? resp.data.data ?? []);
                setHistoryList(list);
            } else {
                message.error(resp?.message || 'Unable to load history');
            }
        } catch (err) {
            console.error(err);
            message.error('Unable to load history');
        } finally {
            setHistoryLoading(false);
        }
    };

    // Note: history items are fetched and displayed inside HistoryDrawer itself.

    const columns: ColumnsType<Resume> = [
        {
            title: "No", width: "10%",
            align: "center" as const,
            render: (_: any, __: any, index: number) => index + 1
        },
        {
            title: "Full Name",
            width: "40%",
            align: "center" as const,
            dataIndex: "fullName", render: (t) => <strong>{t}</strong>
        },
        {
            title: "Score",
            width: "15%",
            dataIndex: "totalResumeScore",
            align: "center" as const,
            render: (_: number | null, record) => {
                const score = record.totalScore ?? record.totalResumeScore ?? null;
                return score != null ? (
                    <Tag color={score >= 70 ? "green" : score >= 40 ? "orange" : "red"}>
                        {score}
                    </Tag>
                ) : (
                    <span>—</span>
                );
            },
        },
        {
            title: "Adjusted",
            width: "15%",
            dataIndex: "adjustedScore",
            align: "center" as const,
            render: (adjustedScore: number | null) => {
                const display = adjustedScore ?? null;
                return display != null ? (
                    <Tag color={display >= 70 ? "green" : display >= 40 ? "orange" : "red"} style={{ margin: 0 }}>
                        {display}
                    </Tag>
                ) : (
                    <span>—</span>
                );
            },
        },
        // {
        //     title: "Status",
        //     width: "40%",
        //     dataIndex: "status",
        //     align: "center" as const,
        //     render: (s: string) => (
        //         <Tag color={s === "Completed" ? "green" : s === "Pending" ? "blue" : "default"}>{s}</Tag>
        //     ),
        // },
        {
            title: "Actions",
            key: "actions",
            width: "20%",
            align: "center" as const,
            render: (_, record) => (
                <Space>
                    <Tooltip title="View Details">
                        <Button
                                type="text"
                                icon={<EyeOutlined/>}
                                onClick={() => loadResumeDetail(Number(record.applicationId ?? record.resumeId))}
                            />
                    </Tooltip>
                </Space>
            ),
        },
    ];

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
            // Try fallback: use jobFit/recommendation/etc if present
            if (resultObj && (resultObj.jobFit || resultObj.recommendation || resultObj.technicalStackMatch)) {
                return (
                    <div>
                        {resultObj.jobFit && (
                            <div style={{ marginBottom: 12 }}>
                                <strong>Job Fit:</strong>
                                <div>{typeof resultObj.jobFit === 'string' ? resultObj.jobFit : JSON.stringify(resultObj.jobFit, null, 2)}</div>
                            </div>
                        )}
                        {resultObj.recommendation && (
                            <div style={{ marginBottom: 12 }}>
                                <strong>Recommendation:</strong>
                                <div>{resultObj.recommendation}</div>
                            </div>
                        )}
                        {resultObj.technicalStackMatch && (
                            <div style={{ marginBottom: 12 }}>
                                <strong>Technical Stack Match:</strong>
                                <div>{typeof resultObj.technicalStackMatch === 'string' ? resultObj.technicalStackMatch : JSON.stringify(resultObj.technicalStackMatch, null, 2)}</div>
                            </div>
                        )}
                        {!resultObj.jobFit && !resultObj.recommendation && !resultObj.technicalStackMatch && (
                            <pre style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: 12, borderRadius: 6 }}>{JSON.stringify(resultObj, null, 2)}</pre>
                        )}
                    </div>
                );
            }
            return <pre>{JSON.stringify(resultObj, null, 2)}</pre>;
        }

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

        // Layout: criteria column 10%, candidate columns share remaining 90%
        const candidateCount = candidates.length;
        const criteriaWidth = '10%';
        const candidateWidth = candidateCount === 2 ? '45%' : `${Math.max(20, Math.floor(90 / candidateCount))}%`;

        const columns = [
            {
                title: 'Criteria',
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
                const rankNum = Number(rankText);
                const rankColor = Number.isFinite(rankNum)
                    ? (rankNum === 1 ? 'green' : rankNum === 2 ? 'geekblue' : rankNum === 3 ? 'orange' : 'red')
                    : 'default';

                return {
                    title: (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {rankNum === 1 && <CrownOutlined style={{ color: '#fa1414ff', fontSize: 20 }} />}
                            <span style={{ fontWeight: 700 }}>{candidateName}</span>
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
        <>
            <Card
                title={
                    <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <Button
                                    className="company-btn"
                                    icon={<ArrowLeftOutlined />}
                                    onClick={() => navigate(-1)}
                                />
                                <div style={{ fontWeight: 600 }}>
                                    {`Compare Candidate`}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                
                                {selectionEnabled && (
                                    <Button danger onClick={() => { setSelectedKeys([]); setSelectionEnabled(false); }}>Cancel</Button>
                                )}
                                <Button
                                    className="company-btn--filled"
                                    onClick={() => {
                                        if (!selectionEnabled) {
                                            setSelectionEnabled(true);
                                            return;
                                        }
                                        handleCompare();
                                    }}
                                    disabled={selectionEnabled ? selectedKeys.length === 0 : false}
                                    loading={submitting}
                                >
                                    {selectionEnabled ? `Compare (${selectedKeys.length})` : 'Compare'}
                                </Button>
                                <Button className="company-btn" onClick={openHistory}>View History</Button>
                            </div>
                        </div>
                    </div>
                }
                style={{ maxWidth: 1200, margin: "12px auto", borderRadius: 12 }}
            >
                {/* Buttons moved into Card title */}

                {resumes.length === 0 && !loading ? (
                    <div>No resumes found with scores.</div>
                ) : (
                    <>
                        <Table
                            className={selectionEnabled ? 'edit-mode-table' : undefined}
                            rowKey={(r: Resume) => r.applicationId ?? r.resumeId}
                            loading={loading}
                            dataSource={resumes}
                            columns={columns}
                            pagination={{ pageSize: 4 }}
                            rowSelection={selectionEnabled ? {
                                selectedRowKeys: selectedKeys,
                                columnWidth: '2%',
                                onChange: (keys) => {
                                    if ((keys || []).length > 5) {
                                        message.error('You may select up to 5 resumes only');
                                        return;
                                    }
                                    setSelectedKeys(keys as React.Key[]);
                                },
                            } : undefined}
                        />

                        {/* Polling loading state */}
                        {polling && (
                            <Card style={{ marginTop: 12, textAlign: 'center' }}>
                                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                    <Spin size="large" />
                                    <div>Comparing... The system is processing, please wait.</div>
                                </Space>
                            </Card>
                        )}

                        {/* Comparison result */}
                        {comparisonResult && (
                            <Card title={`Comparison Result: ${comparisonName ? ` ${comparisonName}` : ''}`} style={{ marginTop: 12 }}>
                                {renderComparisonTable(comparisonResult)}
                            </Card>
                        )}
                    </>
                )}
            </Card>

            <ResumeDetailDrawer
                open={drawerOpen}
                loading={loadingDetail}
                selectedResume={selectedResume}
                onClose={() => { setDrawerOpen(false); setSelectedResume(null); }}
            />

            <HistoryDrawer open={historyOpen} onClose={() => setHistoryOpen(false)} loading={historyLoading} list={historyList} />
        </>
    );
};

export default CompareResumes;