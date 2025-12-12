import { useEffect, useState } from "react";
import { Card, Input, Table, Button, Tooltip, Space, Modal, message } from "antd";
import { EyeOutlined, SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import ResumeDetailDrawer from "./components/ResumeDetailDrawer";
import type { ColumnsType } from "antd/es/table";
import candidateService from "../../../services/candidateService";

// (data comes from API)

const CandidateManagement = () => {
    // Khởi tạo state và gọi API để lấy dữ liệu
    const [candidates, setCandidates] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // UI Layout States
    const [tableHeight, setTableHeight] = useState<number | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(12);
    const [searchText, setSearchText] = useState("");

    // Drawer States
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
    // PDF preview state (kept for detail drawer)
    const [pdfOpen, setPdfOpen] = useState(false);
    const [pdfUrl] = useState<string | null>(null);

    // Delete modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [candidateToDelete, setCandidateToDelete] = useState<any | null>(null);

    // Delete candidate via API (updates UI on success)
    const handleDelete = async (record: any) => {
        const id = record?.candidateId ?? record?.resumeId ?? record?.id ?? null;
        if (!id) {
            message.error("Invalid candidate id");
            return;
        }

        setLoading(true);
        try {
            const resp = await candidateService.deleteCandidate(Number(id));
            if (String(resp?.status || "").toLowerCase() === "success") {
                const newData = candidates.filter((item) => (item.candidateId ?? item.resumeId ?? item.id) !== id);
                setCandidates(newData);
                // decrement total shown in pagination
                setApiTotal((prev) => Math.max(0, prev - 1));
                message.success(resp?.message || "Candidate deleted");

                // if current page is now empty and we are beyond page 1, load previous page
                if (newData.length === 0 && currentPage > 1) {
                    const prevPage = currentPage - 1;
                    setCurrentPage(prevPage);
                    await loadCandidates(prevPage, pageSize);
                }
            } else {
                message.error(resp?.message || "Unable to delete candidate");
            }
        } catch (e) {
            console.error("Failed to delete candidate:", e);
            message.error("Unable to delete candidate");
        } finally {
            setLoading(false);
        }
    };

    // Tính toán chiều cao bảng (UI Logic)
    useEffect(() => {
        const calculate = () => {
            const reserved = 220; // px
            const h = window.innerHeight - reserved;
            setTableHeight(h > 300 ? h : 300);
        };

        calculate();
        window.addEventListener("resize", calculate);
        return () => window.removeEventListener("resize", calculate);
    }, []);

    // Load candidates from API (paged)
    const [apiTotal, setApiTotal] = useState<number>(0);

    const loadCandidates = async (page = 1, size = 10) => {
        setLoading(true);
        try {
            const resp = await candidateService.getCandidates({ page, pageSize: size });
            if (String(resp?.status || "").toLowerCase() === "success") {
                const payload = resp.data ?? {};
                const raw = Array.isArray(payload)
                    ? payload
                    : payload.candidates ?? payload.data ?? payload.items ?? [];

                const mapped = (Array.isArray(raw) ? raw : []).map((c: any) => ({
                    resumeId: c.candidateId ?? c.id,
                    candidateId: c.candidateId ?? c.id,
                    candidateName: c.fullName ?? c.candidateName ?? c.name,
                    email: c.email,
                    phone: c.phoneNumber ?? c.phone,
                    createdAt: c.createdAt,
                }));

                setCandidates(mapped);

                // compute total from API pagination if available
                const totalPages = Number(payload.totalPages) || 0;
                const pageSizeFromApi = Number(payload.pageSize) || size;
                const total = totalPages > 0 ? totalPages * pageSizeFromApi : mapped.length;
                setApiTotal(total);

                const current = Number(payload.currentPage) || page;
                setCurrentPage(current);
                setPageSize(pageSizeFromApi);
            } else {
                message.error(resp?.message || "Unable to load candidates");
            }
        } catch (e) {
            console.error("Failed to load candidates:", e);
            message.error("Unable to load candidates");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCandidates(currentPage, pageSize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Logic tìm kiếm (Client-side filtering)
    useEffect(() => {
        let result = [...candidates];
        if (searchText) {
            const v = searchText.trim().toLowerCase();
            result = result.filter(
                (c) =>
                    c.candidateName?.toLowerCase().includes(v) ||
                    c.email?.toLowerCase().includes(v) ||
                    c.jobTitle?.toLowerCase().includes(v)
            );
        }
        setFiltered(result);
    }, [candidates, searchText]);

    // Mở drawer xem chi tiết của một resume (nếu cần, có thể fetch thêm)
    const openResume = (record: any) => {
        const id = record?.candidateId ?? record?.resumeId ?? record?.id ?? null;
        setSelectedCandidateId(id);
        setDrawerOpen(true);
    };

    // (resume list drawer removed)

    const columns: ColumnsType<any> = [
        {
            title: "No",
            key: "no",
            width: 72,
            align: "center",
            render: (_: any, __: any, index: number) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: "Name",
            dataIndex: "candidateName",
            key: "candidateName",
            align: "center",
            width: "30%",
            ellipsis: true,
            render: (v: string) => v || "-",
        },
        { title: "Email", dataIndex: "email", key: "email", align: "center", width: "25%", ellipsis: true, render: (v: string) => v || "-" },
        { title: "Phone", dataIndex: "phone", key: "phone", align: "center", width: "15%", render: (v: string) => v || "-" },
        {
            title: "Actions",
            key: "actions",
            width: "10%",
            align: "center",
            render: (_: any, record: any) => (
                <Space size="small">
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => openResume(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Remove">
                        <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                            onClick={() => { setCandidateToDelete(record); setDeleteModalOpen(true); }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Card
            title={
                <div style={{ display: "flex", alignItems: "center", width: '100%', gap: 16 }}>
                    <div style={{ flex: '0 0 auto' }}>
                        <span className="font-semibold">Candidate</span>
                    </div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 10 }}>
                        <Input
                            placeholder="Search name, email or phone..."
                            prefix={<SearchOutlined />}
                            allowClear
                            style={{ width: 320 }}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                </div>
            }
            style={{
                maxWidth: 1200,
                margin: "12px auto",
                borderRadius: 12,
                height: 'calc(100% - 25px)',
            }}
        >
            <Table
                dataSource={filtered}
                columns={columns}
                rowKey="candidateId"
                loading={loading}
                pagination={{
                    current: currentPage,
                    pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: [6, 12, 24, 48],
                    total: apiTotal,
                    showTotal: (total) => `Total ${total} candidates`,
                    onChange: (page, size) => {
                        loadCandidates(page, size || pageSize);
                    },
                }}
                size="middle"
                tableLayout="fixed"
                className="job-table"
                scroll={{ y: tableHeight }}
                rowClassName={(_, index) => (index % 2 === 0 ? "table-row-light" : "table-row-dark")}
            />
            <ResumeDetailDrawer open={drawerOpen} candidateId={selectedCandidateId} onClose={() => { setDrawerOpen(false); setSelectedCandidateId(null); }} />

            {/* PDF preview modal (UI-only, sample PDF) */}
            <Modal open={pdfOpen} onCancel={() => setPdfOpen(false)} footer={null} width="80%" style={{ top: 20 }} bodyStyle={{ height: '80vh', padding: 0 }}>
                {pdfUrl ? (
                    <iframe src={pdfUrl} title="CV PDF" style={{ width: '100%', height: '100%', border: 0 }} />
                ) : (
                    <div style={{ padding: 24 }}>No PDF available</div>
                )}
            </Modal>
            {/* Delete confirmation modal */}
            <Modal
                title="Delete Resume"
                open={deleteModalOpen}
                onOk={async () => {
                    if (candidateToDelete) await handleDelete(candidateToDelete);
                    setDeleteModalOpen(false);
                    setCandidateToDelete(null);
                }}
                onCancel={() => { setDeleteModalOpen(false); setCandidateToDelete(null); }}
                okText="Delete"
                okButtonProps={{ danger: true }}
            >
                <p>Are you sure you want to delete this resume? This action cannot be undone.</p>
                {candidateToDelete && (
                    <div style={{ fontSize: 13, color: '#555' }}><strong>{candidateToDelete.candidateName}</strong> &mdash; {candidateToDelete.jobTitle}</div>
                )}
            </Modal>

        </Card>
    );
};

export default CandidateManagement;