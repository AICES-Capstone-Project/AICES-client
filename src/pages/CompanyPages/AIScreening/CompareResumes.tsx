import React, { useEffect, useState } from "react";
import { Card, Table, Tag, Button, Drawer, Space, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useSearchParams, useNavigate } from "react-router-dom";
import resumeService from "../../../services/resumeService";
import { EyeOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { toastError } from "../../../components/UI/Toast";

interface Resume {
    resumeId: number;
    fullName: string;
    status: string;
    totalResumeScore: number | null;
    email?: string;
    phoneNumber?: string;
    fileUrl?: string;
    aiExplanation?: string;
    scoreDetails?: Array<any>;
}

const CompareResumes: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const jobId = Number(searchParams.get("jobId") || "0");
    const scoreParam = searchParams.get("score");
    const score = scoreParam != null ? Number(scoreParam) : null;

    const [loading, setLoading] = useState(false);
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    useEffect(() => {
        if (!jobId || score == null || Number.isNaN(jobId) || Number.isNaN(score)) return;
        loadMatchingResumes();
    }, [jobId, score]);

    const loadMatchingResumes = async () => {
        setLoading(true);
        try {
            const resp = await resumeService.getByJob(Number(jobId));
            if (String(resp?.status || "").toLowerCase() === "success" && resp.data) {
                const raw = Array.isArray(resp.data) ? resp.data : resp.data.items || [];
                const list = (Array.isArray(raw) ? raw : []) as any[];
                const mapped: Resume[] = list
                    .map((r) => ({
                        resumeId: r.resumeId,
                        fullName: r.fullName || r.candidateName || "Unknown",
                        status: r.status || r.stage || "Processing",
                        totalResumeScore: r.totalResumeScore ?? null,
                        email: r.email,
                        phoneNumber: r.phone || r.phoneNumber,
                        fileUrl: r.fileUrl,
                        aiExplanation: r.aiExplanation,
                        scoreDetails: r.scoreDetails,
                    }))
                    .filter((r) => r.totalResumeScore === score);
                setResumes(mapped);
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

    const loadResumeDetail = async (resumeId: number) => {
        setLoadingDetail(true);
        try {
            const resp = await resumeService.getById(Number(jobId), resumeId);
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

    const columns: ColumnsType<Resume> = [
        {
            title: "No", width: 80,
            align: "center" as const,
            render: (_: any, __: any, index: number) => index + 1
        },
        {
            title: "Full Name",
            align: "center" as const,
            dataIndex: "fullName", render: (t) => <strong>{t}</strong>
        },
        {
            title: "Status",
            dataIndex: "status",
            align: "center" as const,
            render: (s: string) => (
                <Tag color={s === "Completed" ? "green" : s === "Pending" ? "blue" : "default"}>{s}</Tag>
            ),
        },
        {
            title: "Sub-criteria score",
            align: "center" as const,
            width: 150,
            
        },
        {
            title: "Actions",
            key: "actions",
            width: 120,
            align: "center" as const,
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => loadResumeDetail(record.resumeId)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <>
            <Card
                title={
                    <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
                        <Button
                            className="company-btn"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate(`/company/ai-screening/${jobId}/resumes`)}
                        />
                        <div style={{ fontWeight: 600 }}>
                            {`Compare Resumes — Main criteria score: ${score ?? "-"}`}
                        </div>
                    </div>
                }
                style={{ maxWidth: 1200, margin: "12px auto", borderRadius: 12 }}
            >
                {resumes.length === 0 && !loading ? (
                    <div>No resumes found with score {score}.</div>
                ) : (
                    <Table rowKey="resumeId" loading={loading} dataSource={resumes} columns={columns} pagination={false} />
                )}
            </Card>

            <Drawer
                title={selectedResume ? `Resume Detail - ${selectedResume.fullName}` : "Resume Detail"}
                width={720}
                onClose={() => {
                    setDrawerOpen(false);
                    setSelectedResume(null);
                }}
                open={drawerOpen}
                destroyOnClose
                loading={loadingDetail}
            >
                {selectedResume && (
                    <Space direction="vertical" style={{ width: "100%" }} size="large">
                        <Card size="small" title="Basic Information">
                            <div>
                                <strong>Full Name:</strong> {selectedResume.fullName}
                            </div>
                            {selectedResume.email && (
                                <div>
                                    <strong>Email:</strong> {selectedResume.email}
                                </div>
                            )}
                            {selectedResume.fileUrl && (
                                <div>
                                    <strong>Resume File:</strong>{' '}
                                    <Button type="link" href={selectedResume.fileUrl} target="_blank">View PDF</Button>
                                </div>
                            )}
                        </Card>
                        {selectedResume.aiExplanation && (
                            <Card size="small" title="AI Explanation">
                                <p style={{ marginTop: 8, padding: 12, background: "#f5f5f5", borderRadius: 4 }}>{selectedResume.aiExplanation}</p>
                            </Card>
                        )}
                    </Space>
                )}
            </Drawer>
        </>
    );
};

export default CompareResumes;
